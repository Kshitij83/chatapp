import { useEffect, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = ({ setShowSidebar }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { socket, onlineUsers } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    setIsTyping(false);
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (!socket) return;
    const onTyping = ({ senderId }) => {
      if (senderId === selectedConversation?._id) setIsTyping(true);
    };
    const onStopTyping = ({ senderId }) => {
      if (senderId === selectedConversation?._id) setIsTyping(false);
    };
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);
    return () => {
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
    };
  }, [socket, selectedConversation?._id]);

  if (!selectedConversation) {
    return <NoChatSelected setShowSidebar={setShowSidebar} />;
  }

  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface">
      {/* Header */}
      <div className="chat-header">
        <button
          onClick={() => setShowSidebar(true)}
          className="theme-btn sm:hidden"
          title="Conversations"
        >
          <FaArrowLeft size={15} />
        </button>
        <img
          src={selectedConversation.profilePic}
          alt={selectedConversation.fullName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink truncate">
            {selectedConversation.fullName}
          </p>
          <p className="text-xs text-ink-muted">
            {isTyping ? (
              <span className="text-primary font-medium">typing…</span>
            ) : isOnline ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-online" />
                Online
              </span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

      <Messages isTyping={isTyping} />
      <MessageInput />
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = ({ setShowSidebar }) => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-6 text-center flex flex-col items-center gap-5 animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-primary-soft flex items-center justify-center">
          <TiMessages className="text-5xl text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink">
            Welcome, <span className="text-primary">{authUser.fullName}</span> 👋
          </p>
          <p className="text-ink-muted mt-1">
            Select a conversation to start messaging
          </p>
        </div>
        <button
          onClick={() => setShowSidebar(true)}
          className="btn-primary sm:hidden"
        >
          Open conversations
        </button>
      </div>
    </div>
  );
};
