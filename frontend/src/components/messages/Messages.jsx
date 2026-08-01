import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useEffect, useRef } from "react";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = ({ isTyping }) => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const bottomRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 relative chat-wallpaper">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {!loading &&
          Array.isArray(messages) &&
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))}

        {loading &&
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

        {!loading && Array.isArray(messages) && messages.length === 0 && (
          <p className="text-center text-sm text-ink-muted py-8">
            No messages yet — say hi to start the conversation 👋
          </p>
        )}

        {!loading && !Array.isArray(messages) && (
          <p className="text-center text-sm text-danger py-8">
            Something went wrong loading messages.
          </p>
        )}

        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Messages;
