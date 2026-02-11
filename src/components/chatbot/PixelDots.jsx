// Three pixel squares that bounce sequentially — the "thinking" animation
export default function PixelDots() {
  return (
    <div className="flex items-center gap-[5px] py-1" aria-label="Thinking...">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-[var(--accent)] inline-block animate-bounce"
          style={{ borderRadius: 0, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
