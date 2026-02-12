import { useState } from 'react';
import ChatWindow from './ChatWindow';
import { useChatbot } from '../../utils/useChatbot';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isTyping, isLimitReached, error, sendMessage } = useChatbot();

  return (
    <>
      {/* ── Floating avatar button (bottom-right) ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed z-40
          w-16 h-16
          bg-[var(--bg-secondary)] border-2 border-[var(--accent)]
          flex items-center justify-center
          hover:bg-[var(--accent)] hover:scale-110
          transition-all duration-200
        "
        style={{
          borderRadius: 0,
          boxShadow: '3px 3px 0 var(--accent)',
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          right: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
        }}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
      >
        <span className="text-2xl" aria-hidden="true">
          {isOpen ? '✕' : '🧑‍💻'}
        </span>

        {/* Pulsing dot — hints to the visitor that the bot is available */}
        {!isOpen && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent)] animate-pulse"
            style={{ borderRadius: 0 }}
          />
        )}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          isLimitReached={isLimitReached}
          error={error}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
