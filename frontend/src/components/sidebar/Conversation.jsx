import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { extractTime } from "../../utils/extractTime";

const Conversation = ({ conversation, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  const last = conversation.lastMessage;
  const time = last ? extractTime(last.timestamp) : "";
  const preview = last
    ? last.messageType === "image"
      ? "📷 Photo"
      : last.messageType === "audio"
        ? "🎤 Voice message"
        : last.text
    : "Say hello 👋";

  return (
    <div
      className={`conversation-row ${isSelected ? "conversation-row-active" : ""}`}
      onClick={() => setSelectedConversation(conversation)}
    >
      <div className="relative shrink-0">
        <img
          src={conversation.profilePic}
          alt="user avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && <span className="online-dot" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-ink truncate">
            {conversation.fullName}
          </p>
          <span className="text-[10px] text-ink-muted shrink-0">{time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-ink-muted truncate">{preview}</p>
          <span className="text-sm shrink-0">{emoji}</span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
