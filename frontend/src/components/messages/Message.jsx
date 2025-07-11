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
  const bubbleBgColor = fromMe ? "#00ADB5" : "#393E46";
  const textColor = fromMe ? "#222831" : "#EEEEEE";
  const shakeClass = message.shouldShake ? "shake" : "";

  // Render message content based on type
  let content;
  if (message.messageType === "audio") {
    content = (
      <div className="flex flex-col gap-2">
        <audio
          controls
          className="max-w-[300px]"
          preload="metadata"
          style={{
            backgroundColor: fromMe ? "#222831" : "#EEEEEE",
            borderRadius: "8px",
            outline: "none",
          }}
          onError={(e) => {
            console.error("Audio playback error:", e);
          }}
          onLoadedMetadata={(e) => {
            console.log("Audio loaded, duration:", e.target.duration);
          }}
        >
          <source src={message.message} type="audio/webm" />
          <source src={message.message} type="audio/mp4" />
          <source src={message.message} type="audio/wav" />
          <source src={message.message} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        {message.fileName && (
          <span className="text-xs opacity-70">{message.fileName}</span>
        )}
      </div>
    );
  } else if (message.messageType === "image") {
    content = (
      <img
        src={message.message}
        alt={message.fileName || "Image"}
        className="max-w-[250px] max-h-[250px] rounded-lg"
        style={{ objectFit: "cover", border: "2px solid #00ADB5" }}
      />
    );
  } else {
    content = message.message;
  }

  return (
    <>
      <div className={`chat ${chatClassName} mb-4`}>
        <div className="chat-image avatar">
          <div
            className="w-10 rounded-full"
            style={{ border: "2px solid #00ADB5" }}
          >
            <img alt="User avatar" src={profilePic} />
          </div>
        </div>
        <div
          className={`chat-bubble ${shakeClass} max-w-xs font-medium`}
          style={{ backgroundColor: bubbleBgColor, color: textColor }}
        >
          {content}
        </div>
        <div
          className="chat-footer opacity-70 text-xs flex gap-1 items-center"
          style={{ color: "#EEEEEE" }}
        >
          {formattedTime}
        </div>
      </div>
    </>
  );
};

export default Message;
