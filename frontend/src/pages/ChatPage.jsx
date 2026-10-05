import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { prepareChat, removeFriend } from "../lib/api";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import {
  ArrowLeftIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  VideoIcon,
  UserMinusIcon,
} from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";
import usePageTitle from "../hooks/usePageTitle";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "eqzs86utatrh";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const isConnectingRef = useRef(false);

  usePageTitle(
    targetUser ? `Chat with ${targetUser.fullName}` : "Direct Chat"
  );

  useEffect(() => {
    let isCancelled = false;

    const initChat = async () => {
      if (!authUser || !targetUserId) return;

      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      setLoading(true);
      setErrorMsg(null);

      try {
        console.log("Preparing chat session with partner:", targetUserId);

        // 1. Ensure both users exist in Stream and fetch credentials
        const prepData = await prepareChat(targetUserId);
        if (isCancelled) return;

        if (prepData.targetUser) {
          setTargetUser(prepData.targetUser);
        }

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // 2. Safe connectUser logic to prevent duplicate connection crashes
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic || "",
            },
            prepData.token
          );
        }

        if (isCancelled) return;

        // 3. Create or watch channel
        const currChannel = client.channel("messaging", prepData.channelId, {
          name: `Chat with ${prepData.targetUser.fullName}`,
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        if (isCancelled) return;

        setChatClient(client);
        setChannel(currChannel);
        setErrorMsg(null);
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (!isCancelled) {
          setErrorMsg(
            error.response?.data?.message ||
              error.message ||
              "Could not connect to chat. Please try again."
          );
          toast.error("Could not connect to chat. Please retry.");
        }
      } finally {
        isConnectingRef.current = false;
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      isCancelled = true;
      isConnectingRef.current = false;
    };
  }, [authUser, targetUserId, retryCount]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `📹 I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Starting video call...", { icon: "📹" });
      navigate(`/call/${channel.id}`);
    }
  };

  const handleConfirmRemoveFriend = async () => {
    try {
      setIsRemoving(true);
      await removeFriend(targetUserId);
      await queryClient.invalidateQueries({ queryKey: ["friends"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["platformStats"] });
      toast.success(`${targetUser?.fullName || "Partner"} removed from friends`);
      navigate("/messages");
    } catch (err) {
      console.error("Error removing friend:", err);
      toast.error(err.response?.data?.message || "Failed to remove friend");
    } finally {
      setIsRemoving(false);
      setShowRemoveModal(false);
    }
  };

  // ERROR STATE WITH RETRY
  if (errorMsg && !loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-base-200 border border-base-300 text-center space-y-4 shadow-lg">
          <div className="size-12 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto">
            <AlertCircleIcon className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-base-content">
            Chat Connection Failed
          </h2>
          <p className="text-xs text-base-content/60 leading-relaxed">
            {errorMsg}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              to="/messages"
              className="btn btn-sm btn-ghost rounded-xl text-xs w-full sm:w-auto"
            >
              Back to Messages
            </Link>
            <button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="btn btn-sm btn-primary rounded-xl text-xs gap-1.5 w-full sm:w-auto shadow-md shadow-primary/25"
            >
              <RefreshCwIcon className="size-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[calc(100vh-4.25rem)] w-full max-w-7xl mx-auto p-2 sm:p-4 flex flex-col gap-2.5">
      {/* UNIFIED SENIOR DEVELOPER TOP BAR - SINGLE NAME HEADER WITH ACTIONS */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/messages"
            className="p-2 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-300 transition-colors border border-transparent hover:border-base-content/10 shrink-0"
            title="Back to messages"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>

          {targetUser ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-10 sm:size-11 rounded-full overflow-hidden border-2 border-primary shrink-0 bg-base-100 shadow-xs">
                <img
                  src={targetUser.profilePic}
                  alt={targetUser.fullName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#22C55E] ring-2 ring-base-200" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-base-content flex items-center gap-2 truncate">
                  <span className="truncate">{targetUser.fullName}</span>
                  <span className="size-2 rounded-full bg-[#22C55E] shrink-0" />
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] text-base-content/60 mt-0.5">
                  <span className="flex items-center gap-1 bg-base-300/80 px-2 py-0.5 rounded-md font-medium text-base-content">
                    {getLanguageFlag(targetUser.nativeLanguage)}
                    <span>Native: {capitialize(targetUser.nativeLanguage || "English")}</span>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md font-semibold text-primary">
                    {getLanguageFlag(targetUser.learningLanguage)}
                    <span>Learning: {capitialize(targetUser.learningLanguage || "Spanish")}</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <h2 className="text-sm sm:text-base font-bold text-base-content">Direct Conversation</h2>
          )}
        </div>

        {/* HEADER ACTIONS: [REMOVE FRIEND] BEFORE [VIDEO CALL OPTION] */}
        <div className="flex items-center gap-2 shrink-0">
          {/* REMOVE FRIEND OPTION (BEFORE VIDEO CALL) */}
          <button
            onClick={() => setShowRemoveModal(true)}
            disabled={isRemoving}
            className="btn btn-sm sm:btn-md btn-outline btn-error rounded-xl font-semibold gap-1.5 sm:gap-2 px-3 sm:px-4 hover:bg-error/15 transition-all"
            title={`Remove ${targetUser?.fullName || "partner"} from friends`}
          >
            <UserMinusIcon className="size-4 sm:size-5" />
            <span className="hidden sm:inline text-xs sm:text-sm">Remove Friend</span>
            <span className="sm:hidden text-xs">Remove</span>
          </button>

          {/* ENLARGED PROMINENT VIDEO CALL BUTTON */}
          <button
            onClick={handleVideoCall}
            className="btn btn-sm sm:btn-md btn-primary rounded-xl font-bold gap-1.5 sm:gap-2 px-3.5 sm:px-5 shadow-md shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
            title="Start Video Call with Partner"
          >
            <VideoIcon className="size-4 sm:size-5" />
            <span className="text-xs sm:text-sm font-bold">Start Video Call</span>
          </button>
        </div>
      </div>

      {/* STREAM CHAT BIG BOX CONTAINER (FULL HEIGHT & THEMED, NO DUPLICATE HEADER) */}
      <div className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 shadow-sm flex flex-col relative">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full flex flex-col flex-1 min-h-0">
              <Window>
                {/* Note: Stream's ChannelHeader and floating CallButton removed to prevent duplicate name and small button */}
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </div>
          </Channel>
        </Chat>
      </div>

      {/* REMOVE FRIEND CONFIRMATION MODAL */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-base-200 border border-base-300 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="size-12 rounded-2xl bg-error/15 text-error flex items-center justify-center mx-auto">
              <UserMinusIcon className="size-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-base-content">
                Remove {targetUser?.fullName || "Partner"}?
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed">
                This will immediately remove {targetUser?.fullName || "this user"} from your connected friends list and delete mutual connection records.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={isRemoving}
                className="btn btn-sm btn-ghost rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveFriend}
                disabled={isRemoving}
                className="btn btn-sm btn-error rounded-xl text-xs gap-1.5 font-bold shadow-md shadow-error/25"
              >
                {isRemoving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <UserMinusIcon className="size-3.5" />
                )}
                <span>Yes, Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
