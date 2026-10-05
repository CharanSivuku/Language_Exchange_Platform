import { useState, useEffect, useRef, useCallback } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getPlatformStats, getStreamToken, sendFriendRequest } from "../lib/api";
import { getSocket } from "../lib/socket";
import { LANGUAGES } from "../constants";
import { getLanguageFlag } from "../components/FriendCard";
import { getRandomIcebreaker } from "../constants/icebreakers";
import { capitialize } from "../lib/utils";
import usePageTitle from "../hooks/usePageTitle";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import {
  CheckIcon,
  CompassIcon,
  FastForwardIcon,
  LightbulbIcon,
  PhoneOffIcon,
  RefreshCwIcon,
  SparklesIcon,
  UserPlusIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const FALLBACK_STREAM_KEY = "eqzs86utatrh";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || FALLBACK_STREAM_KEY;

const RandomMatchPage = () => {
  usePageTitle("Find a Partner — Instant Conversation Lounge");

  const { authUser } = useAuthUser();
  const socketRef = useRef(null);

  // Matchmaking states
  const [selectedLanguage, setSelectedLanguage] = useState(
    authUser?.learningLanguage || "any"
  );
  const [isSearching, setIsSearching] = useState(false);
  const [queueInfo, setQueueInfo] = useState(null);
  const [matchData, setMatchData] = useState(null); // { roomId, partner, role }
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // Call states
  const [videoClient, setVideoClient] = useState(null);
  const [callInstance, setCallInstance] = useState(null);
  const [isCallConnecting, setIsCallConnecting] = useState(false);
  const videoClientRef = useRef(null);
  const callInstanceRef = useRef(null);

  const cleanupCall = useCallback(() => {
    if (callInstanceRef.current) {
      callInstanceRef.current.leave().catch(() => {});
      callInstanceRef.current = null;
      setCallInstance(null);
    }
    if (videoClientRef.current) {
      videoClientRef.current.disconnectUser().catch(() => {});
      videoClientRef.current = null;
      setVideoClient(null);
    }
  }, []);

  // Learning tools states
  const [icebreaker, setIcebreaker] = useState(getRandomIcebreaker());
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Fetch Stream Token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 60000,
  });

  // Fetch real platform stats from MongoDB
  const { data: platformStats } = useQuery({
    queryKey: ["platformStats"],
    queryFn: getPlatformStats,
    staleTime: 10000,
  });

  // Socket setup & listeners
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("waiting_for_partner", (info) => {
      setIsSearching(true);
      setQueueInfo(info);
    });

    socket.on("match_found", (data) => {
      setIsSearching(false);
      setMatchData(data);
      setFriendRequestSent(false);
      setTimerSeconds(0);
      setIcebreaker(getRandomIcebreaker());
      toast.success(`You matched with ${data.partner.fullName}!`, {
        icon: "🎉",
      });
    });

    socket.on("partner_left", () => {
      toast("Partner has left the conversation.", { icon: "👋" });
      cleanupCall();
      setMatchData(null);
    });

    socket.on("search_cancelled", () => {
      setIsSearching(false);
      setQueueInfo(null);
    });

    return () => {
      socket.off("waiting_for_partner");
      socket.off("match_found");
      socket.off("partner_left");
      socket.off("search_cancelled");
    };
  }, [cleanupCall]);

  // Call timer
  useEffect(() => {
    let interval = null;
    if (matchData) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [matchData]);

  // Initialize Stream Video Call when matchData arrives
  useEffect(() => {
    if (!matchData?.roomId || !tokenData?.token || !authUser) return;

    let mounted = true;
    const startCall = async () => {
      try {
        setIsCallConnecting(true);

        const apiKey = tokenData.apiKey || STREAM_API_KEY || FALLBACK_STREAM_KEY;

        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: authUser._id.toString(),
            name: authUser.fullName,
            image: authUser.profilePic || "",
          },
          token: tokenData.token,
        });

        const call = client.call("default", matchData.roomId);
        await call.join({ create: true });

        // Explicitly enable camera and microphone so partner sees video stream
        try {
          await call.camera.enable();
        } catch (camErr) {
          console.warn("Could not enable camera:", camErr);
        }

        try {
          await call.microphone.enable();
        } catch (micErr) {
          console.warn("Could not enable microphone:", micErr);
        }

        callInstanceRef.current = call;
        videoClientRef.current = client;

        if (mounted) {
          setVideoClient(client);
          setCallInstance(call);
        }
      } catch (err) {
        console.error("Error joining matched call:", err);
        toast.error("Could not connect to video stream. Try skipping.");
      } finally {
        if (mounted) setIsCallConnecting(false);
      }
    };

    startCall();

    return () => {
      mounted = false;
      cleanupCall();
    };
  }, [matchData, tokenData, authUser, cleanupCall]);

  const handleStartSearch = () => {
    if (!socketRef.current || !authUser) return;
    setIsSearching(true);
    socketRef.current.emit("find_match", {
      user: authUser,
      practiceLanguage: selectedLanguage,
    });
  };

  const handleCancelSearch = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("cancel_search");
    setIsSearching(false);
  };

  const handleSkipPartner = () => {
    if (socketRef.current) {
      socketRef.current.emit("skip_partner");
    }
    cleanupCall();
    setMatchData(null);
    toast("Finding next partner...", { icon: "⚡" });
    setTimeout(() => {
      handleStartSearch();
    }, 300);
  };

  const handleLeaveCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("skip_partner");
    }
    cleanupCall();
    setMatchData(null);
    setIsSearching(false);
  };

  const handleSendFriendRequest = async () => {
    if (!matchData?.partner?._id || friendRequestSent) return;
    try {
      await sendFriendRequest(matchData.partner._id);
      setFriendRequestSent(true);
      toast.success(`Invitation sent to ${matchData.partner.fullName}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send invitation");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center bg-base-100 text-base-content transition-colors duration-200 select-none">
      {/* 1. ACTIVE CONVERSATION / CALL VIEW */}
      {matchData && (
        <div className="w-full max-w-5xl mx-auto space-y-4 animate-fadeIn">
          {/* TOP CONTROLS & PARTNER BAR */}
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 text-base-content shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Partner Profile */}
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full overflow-hidden border border-base-content/20 bg-base-300 shrink-0 shadow-xs">
                  <img
                    src={matchData.partner.profilePic}
                    alt={matchData.partner.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                    {matchData.partner.fullName}
                    <span className="size-2 rounded-full bg-[#22C55E]" />
                  </h3>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {getLanguageFlag(matchData.partner.nativeLanguage)} Native {capitialize(matchData.partner.nativeLanguage || "N/A")} • Learning {capitialize(matchData.partner.learningLanguage || "N/A")}
                  </p>
                </div>
              </div>

              {/* Timer */}
              <div className="text-center font-mono text-sm font-bold text-base-content bg-base-300 px-3.5 py-1.5 rounded-xl border border-base-content/10 shadow-xs">
                {formatTimer(timerSeconds)}
              </div>

              {/* Actions: Connect, Next Partner, Leave */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendFriendRequest}
                  disabled={friendRequestSent}
                  className={`btn btn-sm rounded-xl text-xs font-semibold ${
                    friendRequestSent
                      ? "btn-ghost border border-base-300 text-base-content/60"
                      : "btn-primary shadow-xs"
                  }`}
                >
                  {friendRequestSent ? (
                    <>
                      <CheckIcon className="size-3.5" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="size-3.5" />
                      <span>Add Partner</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSkipPartner}
                  className="btn btn-sm btn-outline rounded-xl text-xs font-semibold hover:btn-primary"
                  title="Skip to next available partner"
                >
                  <FastForwardIcon className="size-3.5" />
                  <span>Next partner →</span>
                </button>

                <button
                  onClick={handleLeaveCall}
                  className="btn btn-sm btn-circle btn-error text-error-content shadow-xs"
                  title="End conversation"
                >
                  <PhoneOffIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN VIDEO DISPLAY */}
          <div className="relative rounded-3xl overflow-hidden bg-base-200 border border-base-300 min-h-[460px] flex items-center justify-center shadow-lg">
            {isCallConnecting ? (
              <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-base-content/70 font-semibold">Connecting live video stream...</p>
              </div>
            ) : videoClient && callInstance ? (
              <StreamVideo client={videoClient}>
                <StreamCall call={callInstance}>
                  <StreamTheme>
                    <div className="w-full h-full flex flex-col items-center justify-center p-3">
                      <SpeakerLayout />
                      <div className="mt-3">
                        <CallControls onLeave={handleLeaveCall} />
                      </div>
                    </div>
                  </StreamTheme>
                </StreamCall>
              </StreamVideo>
            ) : (
              <div className="text-center p-8 space-y-3">
                <p className="text-xs text-base-content/60">
                  Ready to connect. If camera stream doesn't appear, click Next Partner.
                </p>
                <button onClick={handleSkipPartner} className="btn btn-sm btn-primary rounded-xl text-xs">
                  Next partner →
                </button>
              </div>
            )}
          </div>

          {/* CONVERSATION TOPIC / ICEBREAKER */}
          <div className="p-4 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <LightbulbIcon className="size-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-base-content/50">
                  Conversation Topic & Icebreaker
                </p>
                <p className="text-xs sm:text-sm font-semibold text-base-content mt-0.5">
                  "{icebreaker}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setIcebreaker(getRandomIcebreaker())}
              className="btn btn-xs btn-ghost gap-1.5 text-xs font-semibold text-primary hover:bg-base-300 rounded-lg"
            >
              <RefreshCwIcon className="size-3" />
              <span>New Topic</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SEARCHING / RADAR SCREEN (FULLY THEMED) */}
      {isSearching && !matchData && (
        <div className="p-8 sm:p-12 max-w-md w-full text-center space-y-6 rounded-3xl bg-base-200 border border-base-300 shadow-2xl animate-fadeIn">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Matchmaking Lounge
          </p>

          {/* Radar Animation */}
          <div className="relative size-28 mx-auto flex items-center justify-center my-3">
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping [animation-duration:2.5s]" />
            <div className="absolute inset-2 rounded-full border border-primary/20 animate-ping [animation-duration:1.8s]" />
            <div className="size-16 rounded-full bg-base-300 border border-base-content/15 flex items-center justify-center shadow-inner">
              <span className="size-3.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-base-content">
              Connecting with someone...
            </h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Searching the database for native {selectedLanguage === "any" ? "speakers worldwide" : `${capitialize(selectedLanguage)} speakers`}
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-base-content/70 bg-base-300/80 py-2 px-3.5 rounded-xl border border-base-content/10 inline-block shadow-xs">
            ● {platformStats?.totalLearners ?? 10} learners in database
          </div>

          <div>
            <button
              onClick={handleCancelSearch}
              className="btn btn-sm btn-ghost border border-base-300 text-xs w-full justify-center rounded-xl hover:bg-base-300"
            >
              Cancel Search
            </button>
          </div>
        </div>
      )}

      {/* 3. LOBBY SCREEN (DEFAULT - FULLY THEMED) */}
      {!isSearching && !matchData && (
        <div className="relative overflow-hidden p-6 sm:p-10 max-w-lg w-full rounded-3xl bg-base-200 border border-base-300 shadow-2xl space-y-6 text-base-content transition-all duration-200">
          {/* Subtle Ambient Background Texture */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />

          {/* Header */}
          <div className="relative z-10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shadow-xs">
              <SparklesIcon className="size-3.5" />
              <span>Instant Conversation Lounge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              Who do you want to speak with?
            </h2>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto leading-relaxed">
              Pair instantly for 1-on-1 language exchange with someone whose native language matches your goals.
            </p>
          </div>

          {/* TARGET LANGUAGE SELECTOR */}
          <div className="relative z-10 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
              <span>Choose Target Language</span>
              <span className="text-[10px] text-primary lowercase font-mono">filter</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-base-300 text-base-content text-sm font-semibold border border-base-300 rounded-2xl px-4 py-3.5 focus:outline-hidden focus:border-primary shadow-xs transition-colors cursor-pointer"
            >
              <option value="any">🌍 Any Language (Casual Global Match)</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang.toLowerCase()}>
                  {lang} — Native speakers
                </option>
              ))}
            </select>
          </div>

          {/* YOUR PROFILE SUMMARY */}
          <div className="relative z-10 p-3.5 bg-base-300/80 rounded-2xl border border-base-content/10 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full overflow-hidden border border-base-content/20 bg-base-200">
                <img src={authUser?.profilePic} alt={authUser?.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-base-content">{authUser?.fullName}</p>
                <p className="text-[11px] text-base-content/60 mt-0.5">
                  Native: {capitialize(authUser?.nativeLanguage || "None")} → Learning: {capitialize(authUser?.learningLanguage || "None")}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-[#22C55E] flex items-center gap-1.5 font-bold">
              <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
              Ready
            </span>
          </div>

          {/* PRIMARY ACTION */}
          <div className="relative z-10 pt-1">
            <button
              onClick={handleStartSearch}
              className="btn btn-primary w-full text-sm font-bold !py-3.5 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
            >
              <CompassIcon className="size-4" />
              <span>Find someone to talk to →</span>
            </button>
          </div>

          {/* REAL ONLINE INDICATOR */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-base-content/60 pt-1">
            <span className="size-2 rounded-full bg-[#22C55E]" />
            <span className="font-medium">
              {platformStats?.totalLearners ?? 10} registered learners in database
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomMatchPage;
