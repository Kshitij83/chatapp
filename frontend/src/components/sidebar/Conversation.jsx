import React from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  const handleMouseEnter = (e) => {
    // if (!isSelected) {
    //   e.currentTarget.style.backgroundColor = "#1a1f25"; // Darker shade than #222831
    // }
  };

  const handleMouseLeave = (e) => {
    // if (!isSelected) {
    //   e.currentTarget.style.backgroundColor = "#222831";
    // }
  };

  return (
    <>
      <div
        className="flex gap-2 items-center rounded-lg p-2 cursor-pointer transition-colors"
        style={{
          backgroundColor: isSelected ? "#00ADB5" : "#393E46",
          color: isSelected ? "#222831" : "#EEEEEE",
        }}
        onClick={() => setSelectedConversation(conversation)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div
            className="w-10 rounded-full"
            style={{ border: "3px solid #00ADB5" }}
          >
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-2 justify-between items-center">
            <p
              className="font-bold text-sm truncate"
              style={{ color: isSelected ? "#222831" : "#EEEEEE" }}
            >
              {conversation.fullName}
            </p>
            <span className="text-lg flex-shrink-0">{emoji}</span>
          </div>
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#222831]" />
        )}
      </div>
      {!lastIdx && (
        <div
          className="divider my-1 py-0 h-px"
          style={{ backgroundColor: "#00ADB5" }}
        />
      )}
    </>
  );
};

export default Conversation;
