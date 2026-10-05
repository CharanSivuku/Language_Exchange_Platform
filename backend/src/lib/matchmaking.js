/**
 * Real-time Language Exchange Matchmaking Engine & User Socket Notifier
 */

// Track registered user sockets: userId string -> Set of socketIds
const userSockets = new Map();
let globalIo = null;

export function notifyUser(userId, event, payload) {
  if (!globalIo || !userId) return;
  const strId = userId.toString();
  const sockets = userSockets.get(strId);
  if (sockets && sockets.size > 0) {
    for (const socketId of sockets) {
      globalIo.to(socketId).emit(event, payload);
    }
  }
}

export function setupMatchmaking(io) {
  globalIo = io;

  // In-memory queue of users looking for language partners
  let waitingQueue = [];
  
  // Track active rooms: roomId -> Set of socketIds
  const activeRooms = new Map();
  // Track socket to active roomId
  const socketToRoom = new Map();

  io.on("connection", (socket) => {
    console.log(`[Socket Connected] ID: ${socket.id}`);

    // Register user for real-time notifications
    socket.on("register_user", (userId) => {
      if (!userId) return;
      const strId = userId.toString();
      socket.userId = strId;
      if (!userSockets.has(strId)) {
        userSockets.set(strId, new Set());
      }
      userSockets.get(strId).add(socket.id);
      console.log(`[Socket Registered User] User ${strId} linked to socket ${socket.id}`);
    });

    // User requests to find a language exchange partner
    socket.on("find_match", ({ user, practiceLanguage }) => {
      if (!user || !user._id) return;

      // Clean up previous state if any
      leaveCurrentRoom(socket);
      removeFromQueue(socket.id);

      const normalizedPractice = (practiceLanguage || "any").toLowerCase();
      const userNative = (user.nativeLanguage || "").toLowerCase();
      const userLearning = (user.learningLanguage || "").toLowerCase();

      // Find best match in waiting queue
      let bestCandidateIndex = -1;
      let highestScore = -1;

      for (let i = 0; i < waitingQueue.length; i++) {
        const candidate = waitingQueue[i];

        // Cannot match with oneself
        if (candidate.user._id === user._id) continue;

        const candidateNative = (candidate.user.nativeLanguage || "").toLowerCase();
        const candidateLearning = (candidate.user.learningLanguage || "").toLowerCase();
        const candidatePractice = (candidate.practiceLanguage || "any").toLowerCase();

        let score = 0;

        // Tier 1: Perfect Mutual Complement
        // User wants Candidate's native language, Candidate wants User's native language
        if (
          (normalizedPractice === candidateNative || userLearning === candidateNative) &&
          (candidatePractice === userNative || candidateLearning === userNative)
        ) {
          score = 100;
        }
        // Tier 2: One-way native match (one person is a native speaker of what the other wants)
        else if (normalizedPractice === candidateNative || candidatePractice === userNative) {
          score = 60;
        }
        // Tier 3: Co-learners (both practicing the same language)
        else if (
          normalizedPractice !== "any" &&
          (normalizedPractice === candidatePractice || normalizedPractice === candidateLearning)
        ) {
          score = 40;
        }
        // Tier 4: Open / Any language
        else if (normalizedPractice === "any" || candidatePractice === "any") {
          score = 20;
        } else {
          score = 5; // fallback
        }

        if (score > highestScore) {
          highestScore = score;
          bestCandidateIndex = i;
        }
      }

      // If we found a compatible partner
      if (bestCandidateIndex !== -1) {
        const [candidate] = waitingQueue.splice(bestCandidateIndex, 1);
        const roomId = `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Join sockets to room
        socket.join(roomId);
        const candidateSocket = io.sockets.sockets.get(candidate.socketId);

        if (candidateSocket) {
          candidateSocket.join(roomId);

          // Track room
          activeRooms.set(roomId, new Set([socket.id, candidate.socketId]));
          socketToRoom.set(socket.id, roomId);
          socketToRoom.set(candidate.socketId, roomId);

          console.log(`[Match Created] Room: ${roomId} between ${user.fullName} and ${candidate.user.fullName}`);

          // Emit match details to both participants
          socket.emit("match_found", {
            roomId,
            partner: candidate.user,
            role: "initiator",
          });

          candidateSocket.emit("match_found", {
            roomId,
            partner: user,
            role: "receiver",
          });
        } else {
          // Candidate disconnected; queue current user instead
          enqueueUser(socket, user, normalizedPractice);
        }
      } else {
        // No match found yet, enqueue user
        enqueueUser(socket, user, normalizedPractice);
      }
    });

    // User cancels search
    socket.on("cancel_search", () => {
      removeFromQueue(socket.id);
      socket.emit("search_cancelled");
    });

    // User clicks "Next Partner" / Skip
    socket.on("skip_partner", () => {
      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        socket.to(roomId).emit("partner_left");
        leaveCurrentRoom(socket);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket Disconnected] ID: ${socket.id}`);
      if (socket.userId && userSockets.has(socket.userId)) {
        const set = userSockets.get(socket.userId);
        set.delete(socket.id);
        if (set.size === 0) {
          userSockets.delete(socket.userId);
        }
      }
      removeFromQueue(socket.id);
      const roomId = socketToRoom.get(socket.id);
      if (roomId) {
        socket.to(roomId).emit("partner_left");
        leaveCurrentRoom(socket);
      }
    });
  });

  function enqueueUser(socket, user, practiceLanguage) {
    waitingQueue.push({
      socketId: socket.id,
      user,
      practiceLanguage,
      timestamp: Date.now(),
    });
    socket.emit("waiting_for_partner", {
      queueLength: waitingQueue.length,
      practiceLanguage,
    });
  }

  function removeFromQueue(socketId) {
    waitingQueue = waitingQueue.filter((item) => item.socketId !== socketId);
  }

  function leaveCurrentRoom(socket) {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    socket.leave(roomId);
    socketToRoom.delete(socket.id);

    const roomMembers = activeRooms.get(roomId);
    if (roomMembers) {
      roomMembers.delete(socket.id);
      if (roomMembers.size === 0) {
        activeRooms.delete(roomId);
      }
    }
  }
}
