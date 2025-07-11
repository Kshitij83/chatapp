import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages:[],
  setMessages: (messages) =>
    set((state) =>
      typeof messages === "function"
        ? { messages: messages(state.messages) }
        : { messages }
    ),
}));

export default useConversation;
