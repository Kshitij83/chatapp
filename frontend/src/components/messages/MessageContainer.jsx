import React from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{
        background:
          "linear-gradient(135deg, #222831 0%, #393E46 50%, #222831 100%)",
      }}
    >
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div
            className="px-4 py-4 mb-2"
            style={{
              background: "linear-gradient(90deg, #393E46, #222831)",
              borderBottom: "2px solid #00ADB5",
            }}
          >
            <span
              style={{ color: "#00ADB5" }}
              className="font-medium"
            >
              Chatting with:{" "}
            </span>
            <span
              style={{ color: "#EEEEEE" }}
              className="font-bold text-lg"
            >
              {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div
      className="flex items-center justify-center w-full h-full relative"
      style={{
        background:
          "linear-gradient(135deg, #222831 0%, #393E46 50%, #222831 100%)",
      }}
    >
      <div className="px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-4">
        <p className="text-2xl" style={{ color: "#EEEEEE" }}>
          Welcome{" "}
          <span style={{ color: "#00ADB5" }}>{authUser.fullName}</span> 👋
        </p>
        <p style={{ color: "#EEEEEE" }}>Select a chat to start messaging</p>
        <TiMessages
          className="text-6xl md:text-8xl animate-pulse"
          style={{ color: "#00ADB5" }}
        />
      </div>
    </div>
  );
};
