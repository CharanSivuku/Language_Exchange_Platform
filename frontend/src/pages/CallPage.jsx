import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { ArrowLeftIcon, CopyIcon, VideoIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const FALLBACK_STREAM_KEY = "eqzs86utatrh";

const CallPage = () => {
  usePageTitle("Live Video Call — Verba");

  const { id: callId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const { authUser, isLoading: authLoading } = useAuthUser();

  const { data: tokenData, isLoading: tokenLoading, refetch: refetchToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const activeClientRef = useRef(null);
  const activeCallRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      setIsConnecting(true);
      setErrorMsg(null);

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id.toString(),
          name: authUser.fullName,
          image: authUser.profilePic || "",
        };

        const apiKey = tokenData.apiKey || import.meta.env.VITE_STREAM_API_KEY || FALLBACK_STREAM_KEY;

        const videoClient = new StreamVideoClient({
          apiKey,
          user,
          token: tokenData.token,
        });

        activeClientRef.current = videoClient;

        // If callId is a single friend ID, sort [authUser, friend] to create a deterministic shared mutual room
        const roomId = callId.includes("-")
          ? callId
          : [authUser._id.toString(), callId.toString()].sort().join("-");

        console.log("Joining video room:", roomId);

        const callInstance = videoClient.call("default", roomId);
        activeCallRef.current = callInstance;

        await callInstance.join({ create: true });

        // Explicitly enable camera and microphone so video is transmitted immediately
        try {
          await callInstance.camera.enable();
        } catch (camErr) {
          console.warn("Camera could not be automatically enabled:", camErr);
        }

        try {
          await callInstance.microphone.enable();
        } catch (micErr) {
          console.warn("Microphone could not be automatically enabled:", micErr);
        }

        if (isCancelled) {
          callInstance.leave().catch(() => {});
          videoClient.disconnectUser().catch(() => {});
          return;
        }

        setClient(videoClient);
        setCall(callInstance);
        console.log("Joined call successfully and camera enabled");
      } catch (error) {
        console.error("Error joining video call:", error);
        if (!isCancelled) {
          setErrorMsg(error?.message || "Could not connect to video stream. Please check camera permissions.");
          toast.error("Could not connect to video call. Please try again.");
        }
      } finally {
        if (!isCancelled) {
          setIsConnecting(false);
        }
      }
    };

    initCall();

    return () => {
      isCancelled = true;
      if (activeCallRef.current) {
        activeCallRef.current.leave().catch(() => {});
      }
      if (activeClientRef.current) {
        activeClientRef.current.disconnectUser().catch(() => {});
      }
    };
  }, [tokenData, authUser, callId]);

  if (authLoading || tokenLoading) return <PageLoader />;

  if (errorMsg && !isConnecting) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#141418] border border-zinc-800 text-center space-y-4 shadow-2xl">
          <div className="size-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircleIcon className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Video Call Connection Failed</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">{errorMsg}</p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => navigate("/messages")}
              className="btn btn-sm btn-ghost rounded-xl text-xs w-full sm:w-auto text-zinc-300"
            >
              Back to Messages
            </button>
            <button
              onClick={() => {
                refetchToken();
                setIsConnecting(true);
              }}
              className="btn btn-sm btn-primary rounded-xl text-xs gap-1.5 w-full sm:w-auto"
            >
              <RefreshCwIcon className="size-3.5" />
              <span>Retry Call</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0A0A0C] text-white flex flex-col overflow-hidden">
      {/* Sleek Top Bar */}
      <header className="h-14 px-4 bg-[#141418]/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Leave Call"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <VideoIcon className="size-4 text-primary" />
              <span>Verba Live Video Session</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Call link copied! Share with your partner.", { icon: "📋" });
            }}
            className="btn btn-xs btn-ghost border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 rounded-lg gap-1.5 font-medium"
            title="Copy Invite Link"
          >
            <CopyIcon className="size-3" />
            <span className="hidden sm:inline">Copy Invite Link</span>
          </button>
        </div>
      </header>

      {/* Main Video Screen Container */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative overflow-hidden flex flex-col items-center justify-center">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <div className="w-full h-full flex flex-col">
                <StreamTheme className="w-full h-full flex-1 flex flex-col justify-between">
                  <div className="flex-1 w-full h-full min-h-0 relative">
                    <SpeakerLayout participantsBarPosition="bottom" />
                  </div>
                  <div className="p-3 bg-[#141418]/95 backdrop-blur-md border-t border-zinc-800/80 flex justify-center shrink-0">
                    <CallControls onLeave={() => navigate("/messages")} />
                  </div>
                </StreamTheme>
              </div>
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400 font-medium">Connecting video stream...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CallPage;
