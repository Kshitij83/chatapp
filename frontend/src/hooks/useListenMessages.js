import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notifysound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => {
      const isFromOther = newMessage.senderId !== authUser._id;
      if (isFromOther) {
        newMessage.shouldShake = true;
        try {
          const sound = new Audio(notifysound);
          sound.play();
        } catch {
          // Audio playback blocked — ignore
        }
      }
      const isForOpenChat =
        selectedConversation?._id === newMessage.senderId ||
        newMessage.senderId === authUser._id;
      if (isForOpenChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [socket, setMessages, authUser, selectedConversation]);
};

export default useListenMessages;
