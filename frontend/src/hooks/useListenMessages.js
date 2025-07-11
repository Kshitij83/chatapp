import React from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notifysound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notifysound);
      sound.play();
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages]);
};

export default useListenMessages;
