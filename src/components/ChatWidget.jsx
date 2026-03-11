import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useChat } from "../hooks/useChat";

function Message({ msg, isJa }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
          style={{ background: "var(--ocean)" }}
        >
          <Bot size={14} color="white" />
        </div>
      )}
      <div
        className="max-w-[80%] px-4 py-3 rounded-3xl"
        style={{
          background: isUser ? "var(--ocean)" : "var(--mist-card)",
          color: isUser ? "white" : "var(--ink)",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          fontFamily: isJa
            ? "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif"
            : "var(--font-body)",
          borderRadius: isUser ? "24px 24px 6px 24px" : "24px 24px 24px 6px",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === "ja";
  const { messages, loading, error, limitError, send } = useChat(i18n.language);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [greeted, setGreeted] = useState(false);

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
    }
  }, [open, greeted]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    send(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const allMessages = greeted
    ? [{ role: "assistant", content: t("chat.greeting") }, ...messages]
    : messages;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="chat-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => setOpen(true)}
              className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: "var(--coral)",
                boxShadow: "0 4px 24px rgba(217,107,79,0.45)",
                border: "none",
              }}
              aria-label={t("ui.aria.openChat")}
            >
              <MessageCircle size={24} color="white" />
              {!greeted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{
                    background: "#dc2626",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  1
                </motion.span>
              )}
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                style={{ background: "var(--coral)" }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed z-50 bottom-4 sm:bottom-6 left-2 right-2 sm:left-auto sm:right-6 flex justify-center sm:block">
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col rounded-3xl overflow-hidden w-full max-w-[350px] sm:w-[350px]"
              style={{
                height: "min(500px, calc(100vh - 80px))",
                background: "#FAFAFA",
                border: "2px solid var(--card-border)",
                boxShadow: "var(--card-shadow-elevated)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: "var(--ocean)", flexShrink: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <Bot size={16} color="white" />
                  </div>
                  <span
                    className="text-white font-medium text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {t("chat.title")}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                  aria-label={t("ui.aria.closeChat")}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
                style={{}}
              >
                {allMessages.map((msg, i) => (
                  <Message key={i} msg={msg} isJa={isJa} />
                ))}

                {loading && (
                  <div className="flex justify-start mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                      style={{ background: "var(--ocean)" }}
                    >
                      <Bot size={14} color="white" />
                    </div>
                    <div
                      className="px-4 py-3 rounded-3xl"
                      style={{ background: "var(--mist-card)" }}
                    >
                      <div className="flex gap-1 items-center h-4">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "var(--ocean)", opacity: 0.5 }}
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <p
                    className="text-center text-xs py-2"
                    style={{
                      color: "var(--coral)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t("chat.error")}
                  </p>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  borderTop: "1px solid rgba(27,79,107,0.08)",
                  flexShrink: 0,
                  background: "var(--ivory)",
                }}
              >
                {limitError && (
                  <p
                    className="text-xs px-4 pt-2"
                    style={{
                      color: "var(--coral)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t(`chat.${limitError}`)}
                  </p>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("chat.placeholder")}
                      disabled={loading}
                      maxLength={500}
                      className={`w-full rounded-2xl px-4 py-2.5 text-sm outline-none transition-colors ${loading ? "cursor-not-allowed" : ""}`}
                      style={{
                        background: loading ? "var(--mist)" : "white",
                        border: `1px solid ${loading ? "rgba(27,79,107,0.08)" : "rgba(27,79,107,0.15)"}`,
                        color: loading ? "rgba(26,26,26,0.4)" : "var(--ink)",
                        fontFamily: isJa
                          ? "'Hiragino Kaku Gothic ProN', sans-serif"
                          : "var(--font-body)",
                        fontSize: "0.875rem",
                        transition: "background 0.2s, border-color 0.2s, color 0.2s",
                      }}
                    />
                    {input.length > 400 && (
                      <span
                        className="absolute right-2 bottom-1 text-xs"
                        style={{
                          color:
                            input.length >= 500
                              ? "var(--coral)"
                              : "var(--sand)",
                        }}
                      >
                        {input.length}/500
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={
                      loading || !input.trim() || limitError === "limitReached"
                    }
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                    style={{
                      background:
                        input.trim() &&
                        !loading &&
                        limitError !== "limitReached"
                          ? "var(--coral)"
                          : "rgba(27,79,107,0.1)",
                      border: "none",
                    }}
                    aria-label={t("chat.send")}
                  >
                    <Send
                      size={15}
                      color={
                        input.trim() &&
                        !loading &&
                        limitError !== "limitReached"
                          ? "white"
                          : "var(--ocean)"
                      }
                    />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
