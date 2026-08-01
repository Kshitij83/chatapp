import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { FaCheckDouble } from "react-icons/fa";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt || message.timestamp);
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  let content;
  if (message.messageType === "audio") {
    content = (
      <div className="flex flex-col gap-1">
        <audio controls preload="metadata" src={message.message}>
          Your browser does not support the audio element.
        </audio>
        {message.fileName && (
          <span className="text-xs opacity-70 truncate max-w-[240px]">
            {message.fileName}
          </span>
        )}
      </div>
    );
  } else if (message.messageType === "image") {
    content = (
      <img
        src={message.message}
        alt={message.fileName || "Image"}
        className="max-w-[250px] max-h-[250px] rounded-xl object-cover"
        loading="lazy"
      />
    );
  } else {
    content = <span className="whitespace-pre-wrap">{message.message}</span>;
  }

  return (
    <div className={`flex items-end gap-2.5 ${fromMe ? "justify-end" : "justify-start"}`}>
      {!fromMe && (
        <img
          src={profilePic}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      )}
      <div className={`bubble ${fromMe ? "bubble-out" : "bubble-in"} ${message.shouldShake ? "shake" : ""}`}>
        {content}
        <div className="msg-meta">
          <span>{formattedTime}</span>
          {fromMe && <FaCheckDouble size={11} />}
        </div>
      </div>
    </div>
  );
};

export default Message;
