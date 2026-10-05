import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { upsertStreamUser } from "../lib/stream.js";
import { notifyUser } from "../lib/matchmaking.js";

export async function getPlatformStats(req, res) {
  try {
    const totalLearners = await User.countDocuments({ isOnboarded: true });

    const users = await User.find({ isOnboarded: true }).select("nativeLanguage learningLanguage");
    const langSet = new Set();
    users.forEach((u) => {
      if (u.nativeLanguage) langSet.add(u.nativeLanguage.toLowerCase());
      if (u.learningLanguage) langSet.add(u.learningLanguage.toLowerCase());
    });

    const currentUser = await User.findById(req.user.id).select("friends");
    const friendsCount = currentUser?.friends?.length || 0;

    const pendingCount = await FriendRequest.countDocuments({
      recipient: req.user.id,
      status: "pending",
    });

    res.status(200).json({
      totalLearners,
      languagesCount: langSet.size || 1,
      friendsCount,
      pendingCount,
    });
  } catch (error) {
    console.error("Error in getPlatformStats controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { _id: { $nin: currentUser.friends || [] } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage bio location");

    res.status(200).json(user?.friends || []);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends && recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    // Notify recipient in real time
    notifyUser(recipientId, "new_friend_request", {
      sender: {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
        nativeLanguage: req.user.nativeLanguage,
        learningLanguage: req.user.learningLanguage,
      },
      requestId: friendRequest._id,
    });
    notifyUser(recipientId, "friend_requests_updated", {});

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    // Notify sender in real time
    notifyUser(friendRequest.sender, "friend_request_accepted", {
      recipient: {
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
      },
    });
    notifyUser(friendRequest.sender, "friend_requests_updated", {});
    notifyUser(friendRequest.recipient, "friend_requests_updated", {});

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to decline this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    notifyUser(friendRequest.recipient, "friend_requests_updated", {});
    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.log("Error in rejectFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage bio location");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage bio location");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage bio location");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, bio, profilePic, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName.trim();
    if (bio !== undefined) updateFields.bio = bio;
    if (profilePic) updateFields.profilePic = profilePic;
    if (nativeLanguage) updateFields.nativeLanguage = nativeLanguage;
    if (learningLanguage) updateFields.learningLanguage = learningLanguage;
    if (location !== undefined) updateFields.location = location;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update Stream user as well so in video & chat calls the new avatar/name are shown
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamError) {
      console.log("Error updating Stream user during profile update:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeFriend(req, res) {
  try {
    const myId = req.user.id;
    const { id: friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    // 1. Remove friend from current user's friends array
    await User.findByIdAndUpdate(myId, {
      $pull: { friends: friendId },
    });

    // 2. Remove current user from friend's friends array
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: myId },
    });

    // 3. Remove mutual friend requests between them
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    // 4. Notify both users in real-time via socket
    notifyUser(friendId, "friends_updated", { removedBy: myId });
    notifyUser(myId, "friends_updated", { removedFriendId: friendId });

    res.status(200).json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error in removeFriend controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
