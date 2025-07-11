import React from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notifysound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => {
      // Only shake and play sound if the message is NOT sent by the current user
      if (newMessage.senderId !== authUser._id) {
        newMessage.shouldShake = true;
        const sound = new Audio(notifysound);
        sound.play();
      }
      setMessages((prev) => [...prev, newMessage]);
      console.log("Received new message:", newMessage);
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, [socket, setMessages, authUser]);
};

export default useListenMessages;
