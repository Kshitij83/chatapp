import React from "react";
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const sendMessage = async (message, messageType = "text", fileName = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, messageType, fileName }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
