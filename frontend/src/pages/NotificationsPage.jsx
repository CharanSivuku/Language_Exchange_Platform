import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  InboxIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";
import toast from "react-hot-toast";
import usePageTitle from "../hooks/usePageTitle";
import { Link } from "react-router";

const NotificationsPage = () => {
  usePageTitle("Partner Invitations & Requests");
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 8000,
    staleTime: 5000,
  });

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Partner connected! You can now chat and video call.", { icon: "🎉" });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept request");
    },
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to decline request");
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 bg-base-100 text-base-content select-none transition-colors duration-200">
      {/* HEADER */}
      <div className="border-b border-base-300 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <span>Requests & Notifications</span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {incomingRequests.length} Pending
            </span>
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Review incoming language partner invitations and recently connected peers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/explore"
            className="btn btn-sm btn-ghost rounded-xl text-xs font-bold border border-base-300"
          >
            Find More Partners
          </Link>
        </div>
      </div>

      {isLoading ? (
        /* SKELETON */
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-base-300" />
                <div className="space-y-1.5">
                  <div className="h-4 bg-base-300 rounded w-28" />
                  <div className="h-3 bg-base-300 rounded w-40" />
                </div>
              </div>
              <div className="h-8 bg-base-300 rounded-xl w-32" />
            </div>
          ))}
        </div>
      ) : incomingRequests.length === 0 && acceptedRequests.length === 0 ? (
        /* CLEAN EMPTY STATE (FULLY THEMED) */
        <div className="p-10 sm:p-12 text-center space-y-3 max-w-md mx-auto rounded-3xl bg-base-200 border border-base-300 shadow-sm">
          <div className="size-12 rounded-2xl bg-base-300 flex items-center justify-center mx-auto text-base-content/50">
            <InboxIcon className="size-6" />
          </div>
          <h3 className="font-bold text-base text-base-content">All caught up!</h3>
          <p className="text-xs text-base-content/60 leading-relaxed">
            You don't have any pending invitations right now. Visit Explore or Practice Radar to match with native speakers!
          </p>
          <div className="pt-2">
            <Link
              to="/match"
              className="btn btn-sm btn-primary rounded-xl font-bold text-xs shadow-md shadow-primary/25"
            >
              Start Practice Radar →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* INCOMING REQUESTS (THEME-ADAPTIVE WITH PROMINENT ACCEPT BOX) */}
          {incomingRequests.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/75 px-1">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span>Pending Partner Invitations ({incomingRequests.length})</span>
              </div>

              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 sm:p-5 rounded-3xl bg-base-200 border border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="size-12 rounded-full overflow-hidden border-2 border-primary bg-base-100 shrink-0 shadow-sm">
                        <img
                          src={request.sender.profilePic}
                          alt={request.sender.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-base-content flex items-center gap-1.5">
                          <span>{request.sender.fullName}</span>
                          <span className="text-xs font-normal text-base-content/60">
                            wants to practice with you
                          </span>
                        </p>
                        <p className="text-xs text-base-content/70 flex items-center gap-1.5 mt-1 font-medium">
                          <span>{getLanguageFlag(request.sender.nativeLanguage)} Speaks {capitialize(request.sender.nativeLanguage || "N/A")}</span>
                          <span>•</span>
                          <span>{getLanguageFlag(request.sender.learningLanguage)} Learning {capitialize(request.sender.learningLanguage || "N/A")}</span>
                        </p>
                        {request.sender.bio && (
                          <p className="text-[11px] text-base-content/50 italic line-clamp-1 mt-1">
                            "{request.sender.bio}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PROMINENT ACTION BUTTONS: CLEAR HIGH-CONTRAST ACCEPT & DECLINE */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => rejectRequestMutation(request._id)}
                        disabled={isRejecting || isAccepting}
                        className="btn btn-sm btn-ghost hover:btn-error rounded-xl text-xs font-bold px-3 transition-colors"
                        title="Decline invitation"
                      >
                        <XIcon className="size-3.5" />
                        <span>Decline</span>
                      </button>

                      {/* HIGH-VISIBILITY ACCEPT BOX */}
                      <button
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isAccepting || isRejecting}
                        className="btn btn-sm btn-primary rounded-xl text-xs font-bold px-5 gap-1.5 shadow-md shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all text-primary-content"
                        title="Accept partner and start chatting"
                      >
                        <CheckIcon className="size-4 stroke-[3]" />
                        <span>Accept Partner</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ACCEPTED REQUESTS (RECENT CONNECTIONS) */}
          {acceptedRequests.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">
                <CheckIcon className="size-3.5 text-[#22C55E]" />
                <span>Recently Connected Conversations</span>
              </div>

              <div className="space-y-2">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-3.5 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-between gap-3 text-xs transition-colors hover:border-base-content/15"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full overflow-hidden border border-base-300 bg-base-100 shrink-0">
                        <img
                          src={notification.recipient.profilePic}
                          alt={notification.recipient.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-base-content">
                          {notification.recipient.fullName}{" "}
                          <span className="font-normal text-base-content/60">
                            accepted your invitation
                          </span>
                        </p>
                        <p className="text-[11px] text-base-content/50 mt-0.5">
                          You are now connected partners. Ready for text & video sessions!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/chat/${notification.recipient._id}`}
                        className="btn btn-xs btn-primary rounded-lg font-bold gap-1 shadow-xs"
                      >
                        <MessageSquareIcon className="size-3" />
                        <span>Chat</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
