import React from "react";
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "https://chatapp-backend.onrender.com" : "http://localhost:5000");

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message, messageType = "text", fileName = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({
            message,
            messageType,
            fileName,
          }),
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

  const sendImageFile = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('messageType', 'image');
      formData.append('fileName', imageFile.name);

      const res = await fetch(`${API_BASE_URL}/api/messages/send/${selectedConversation._id}`, {
        method: "POST",
        credentials: 'include',
        body: formData,
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, sendImageFile, loading };
};

export default useSendMessage;
  };

  return { sendMessage, sendImageFile, loading };
};

export default useSendMessage;
