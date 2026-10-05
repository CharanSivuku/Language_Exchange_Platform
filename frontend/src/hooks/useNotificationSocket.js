import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";

export default function useNotificationSocket() {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?._id) return;

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    // Register user for targeted server notifications
    socket.emit("register_user", authUser._id);

    const handleNewRequest = (data) => {
      const senderName = data?.sender?.fullName || "A language learner";
      toast.success(`New partner request from ${senderName}!`, {
        icon: "✨",
        duration: 4500,
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    };

    const handleRequestAccepted = (data) => {
      const partnerName = data?.recipient?.fullName || "Your partner";
      toast.success(`${partnerName} accepted your request! Start chatting now.`, {
        icon: "🎉",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    };

    const handleRequestsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    };

    socket.on("new_friend_request", handleNewRequest);
    socket.on("friend_request_accepted", handleRequestAccepted);
    socket.on("friend_requests_updated", handleRequestsUpdated);

    return () => {
      socket.off("new_friend_request", handleNewRequest);
      socket.off("friend_request_accepted", handleRequestAccepted);
      socket.off("friend_requests_updated", handleRequestsUpdated);
    };
  }, [authUser?._id, queryClient]);
}
