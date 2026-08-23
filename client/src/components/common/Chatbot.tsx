import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { mutate: sendChatMessage, isPending } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    sendChatMessage(
      { message },
      {
        onSuccess: (response) => {
          setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), role: "assistant", content: response },
          ]);
        },
        onError: () => {
          setMessages((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "Sorry, I couldn't process your request right now. Please try again.",
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex h-[min(600px,70vh)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    Portfolio Assistant
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask me about Rohit
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                aria-label="Close chatbot"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-xl bg-[var(--accent)] px-4 py-3 text-sm leading-6 text-white"
                        : "mr-auto max-w-[85%] rounded-xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }
                  >
                    {message.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-auto flex w-fit items-center gap-1 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-current"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isPending}
                placeholder="Ask something..."
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-[var(--accent)] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

              <motion.button
                type="submit"
                whileTap={{ scale: 0.92 }}
                disabled={!input.trim() || isPending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={17} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg"
        aria-label="Open portfolio assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default Chatbot;
