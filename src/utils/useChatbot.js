import { useState, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Shown immediately when the chat window opens — no API call needed
const OPENING_MESSAGE = {
  role: 'assistant',
  content:
    "Greetings, adventurer! I'm Salim's digital companion. Ask me anything about his quests — skills, projects, or experience! ⚔️\n\n⏳ Heads up: the backend runs on Render's free tier, so the first response may take ~30s to wake up. Sorry for the wait!",
};

export function useChatbot() {
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(
    async (text) => {
      if (isTyping || !text.trim()) return;

      // Show user message immediately
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setIsTyping(true);
      setError(null);

      // Add an empty bot placeholder — content fills in as chunks arrive
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, session_id: sessionId }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        // Buffer handles the case where a chunk boundary splits an SSE line
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep any incomplete line for next iteration

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                // Append chunk to the last (bot placeholder) message
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + data.text,
                  };
                  return updated;
                });
              }

              if (data.done) {
                setSessionId(data.session_id);
                setMessageCount(data.message_count);
                setIsLimitReached(data.is_limit_reached);
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError('Connection lost. Please try again.');
        // Remove the empty bot placeholder so UI stays clean
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, sessionId]
  );

  return { messages, isTyping, messageCount, isLimitReached, error, sendMessage };
}
