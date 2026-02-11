import PixelDots from './PixelDots';

const pixelFont = { fontFamily: "'Press Start 2P', cursive" };
const monoFont = { fontFamily: "'Roboto Mono', monospace" };

export default function ChatMessage({ role, content }) {
  const isBot = role === 'assistant';
  // Empty content means we're still waiting for the first chunk → show dots
  const isEmpty = content === '';

  return (
    <div className={`flex flex-col gap-1 mb-4 ${isBot ? 'items-start' : 'items-end'}`}>
      {/* Speaker label — SALIM BOT (left) or PLAYER (right) */}
      <span
        className="text-[var(--accent)] text-[7px] tracking-widest"
        style={pixelFont}
      >
        {isBot ? '⚔ SALIM BOT' : '▶ PLAYER'}
      </span>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] px-3 py-2 text-[11px] leading-relaxed ${
          isBot
            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--accent)]'
            : 'bg-[var(--accent)] text-[var(--bg-primary)]'
        }`}
        style={{ ...monoFont, borderRadius: 0 }}
      >
        {isBot && isEmpty ? <PixelDots /> : content}
      </div>
    </div>
  );
}
