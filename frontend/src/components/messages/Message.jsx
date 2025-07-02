import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt || message.timestamp);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  // Render message content based on type
  let content;
  if (message.messageType === "audio") {
    content = (
      <audio controls>
        <source src={message.message} type="audio/webm" />
        Your browser does not support the audio element.
      </audio>
    );
  } else if (message.messageType === "image") {
    content = (
      <img
        src={message.message}
        alt={message.fileName || "Image"}
        className="max-w-[200px] max-h-[200px] rounded-lg border"
        style={{ objectFit: "cover" }}
      />
    );
  } else {
    content = message.message;
  }

  return (
    <>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component" src={profilePic} />
          </div>
        </div>
        <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
          {content}
        </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
    </>
  );
};

export default Message;
