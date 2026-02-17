import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

const pixelFont = { fontFamily: "'Press Start 2P', cursive" };
const monoFont = { fontFamily: "'Roboto Mono', monospace" };

export default function ChatWindow({
  messages,
  isTyping,
  isLimitReached,
  error,
  onSend,
  onClose,
  isListening,
  isSpeaking,
  voiceEnabled,
  voiceSupported,
  onMicClick,
  onVoiceToggle,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  // Track touch start Y to detect swipe-down-to-close on mobile
  const touchStartY = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping || isLimitReached) return;
    onSend(text);
    setInput('');
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  // Close when the user swipes down more than 80px (mobile UX)
  const handleTouchEnd = (e) => {
    if (!touchStartY.current) return;
    if (e.changedTouches[0].clientY - touchStartY.current > 80) onClose();
    touchStartY.current = null;
  };

  return (
    /*
     * Layout:
     *   Mobile  → inset-0 (full screen takeover)
     *   Desktop → fixed 380×520px above the avatar button (bottom-24 right-6)
     *
     * The pixel-art aesthetic uses:
     *   - border-2 border-[var(--accent)] + box-shadow offset for depth
     *   - borderRadius: 0 everywhere (hard edges, no rounded corners)
     */
    <div
      className="
        fixed z-50 flex flex-col
        inset-0 chat-safe-container
        md:inset-auto md:bottom-24 md:right-6 md:w-[380px] md:h-[520px] md:chat-safe-container-reset
        bg-[var(--bg-primary)] border-2 border-[var(--accent)]
      "
      style={{ borderRadius: 0, boxShadow: '4px 4px 0 var(--accent)', animation: 'chatOpen 0.2s ease-out' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--accent)] bg-[var(--bg-secondary)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🧑‍💻</span>
          <span className="text-[var(--accent)] text-[8px]" style={pixelFont}>
            SALIM BOT
          </span>
        </div>
        <div className="flex items-center gap-2">
          {voiceSupported && (
            <button
              onClick={onVoiceToggle}
              className="text-[9px] transition-colors"
              style={{
                ...pixelFont,
                color: voiceEnabled ? 'var(--accent)' : 'var(--text-secondary)',
              }}
              aria-label="Toggle voice"
            >
              {voiceEnabled ? (isSpeaking ? '[♪]' : '[VOC]') : '[VOC]'}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] text-[9px] transition-colors"
            style={pixelFont}
            aria-label="Close chat"
          >
            [X]
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 chat-messages-scroll">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div
          className="mx-4 mb-2 px-3 py-2 text-[10px] text-red-400 border border-red-400 bg-red-400/10 flex-shrink-0"
          style={{ ...monoFont, borderRadius: 0 }}
        >
          {error}
        </div>
      )}

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t-2 border-[var(--accent)] bg-[var(--bg-secondary)] chat-input-safe">
        {isLimitReached ? (
          // Session limit hit — point user to contact form
          <p
            className="px-4 py-3 text-[8px] text-[var(--text-secondary)] text-center leading-relaxed"
            style={pixelFont}
          >
            QUEST COMPLETE!
            <br />
            <span className="text-[var(--accent)]">USE CONTACT FORM ↑</span>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              maxLength={500}
              disabled={isTyping}
              className="
                flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)]
                border-2 border-[var(--border)] focus:border-[var(--accent)]
                px-3 py-2 text-[11px] outline-none
                disabled:opacity-50
              "
              style={{ ...monoFont, borderRadius: 0 }}
            />
            {voiceSupported && !isLimitReached && (
              <button
                type="button"
                onClick={onMicClick}
                disabled={isTyping}
                className="
                  px-3 py-2 text-[8px] border-2 flex-shrink-0
                  disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                "
                style={{
                  ...pixelFont,
                  borderRadius: 0,
                  borderColor: isListening ? '#ef4444' : 'var(--border)',
                  color: isListening ? '#ef4444' : 'var(--text-secondary)',
                  background: 'transparent',
                  animation: isListening ? 'pulse 1s infinite' : 'none',
                }}
                aria-label="Voice input"
              >
                {isListening ? '[●]' : '[MIC]'}
              </button>
            )}
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="
                bg-[var(--accent)] text-[var(--bg-primary)]
                px-3 py-2 text-[8px]
                hover:bg-[var(--accent-hover)] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0
              "
              style={{ ...pixelFont, borderRadius: 0 }}
            >
              {isTyping ? '...' : '▶'}
            </button>
          </form>
        )}
      </div>

      {/* ── Swipe handle (mobile only) ── */}
      <div className="md:hidden flex justify-center py-2 bg-[var(--bg-secondary)]">
        <div className="w-8 h-1 bg-[var(--border)]" style={{ borderRadius: 0 }} />
      </div>
    </div>
  );
}
