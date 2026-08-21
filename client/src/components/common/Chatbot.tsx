import {
  Bot,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useChat } from "../../hooks/useChat";
import type { ChatMessage } from "../../types/chat";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Rohit's AI portfolio assistant. Ask me about his projects, skills, experience, education, or certifications.",
    },
  ]);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const {
    mutate: sendChatMessage,
    isPending,
  } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isPending]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");

    sendChatMessage(
      { message },
      {
        onSuccess: (response) => {
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response,
          };

          setMessages((current) => [
            ...current,
            assistantMessage,
          ]);
        },

        onError: () => {
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Sorry, I couldn't process your request right now. Please try again.",
          };

          setMessages((current) => [
            ...current,
            errorMessage,
          ]);
        },
      }
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      {isOpen && (
        <div className="mb-4 flex h-[min(600px,70vh)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
                <Bot size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Portfolio Assistant
                </p>

                <p className="text-xs text-slate-500">
                  Ask me about Rohit
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 transition-colors hover:text-slate-950"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-xl bg-slate-950 px-4 py-3 text-sm leading-6 text-white"
                    : "mr-auto max-w-[85%] rounded-xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700"
                }
              >
                {message.content}
              </div>
            ))}

            {isPending && (
              <div className="mr-auto w-fit rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-slate-200 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              disabled={isPending}
              placeholder="Ask something..."
              className="min-w-0 flex-1 border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-slate-950 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-950 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Open portfolio assistant"
      >
        {isOpen ? (
          <X size={23} />
        ) : (
          <MessageCircle size={23} />
        )}
      </button>
    </div>
  );
};

export default Chatbot;