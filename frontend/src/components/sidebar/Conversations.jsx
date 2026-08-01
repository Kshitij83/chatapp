import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div className="skeleton-block w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton-block h-3.5 w-32" />
              <div className="skeleton-block h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="text-center text-sm text-ink-muted px-6 py-8">
        No users yet. Share the app so friends can join!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {conversations.map((conversation) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
        />
      ))}
    </div>
  );
};

export default Conversations;
