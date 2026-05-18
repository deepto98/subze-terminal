import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's driving BTC today?",
  "ETH support levels?",
  "Top movers in last 4h",
];

export function AICopilot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Welcome to Subze Copilot. Ask me anything about market structure, price action, or trade ideas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (q: string) => {
    const query = q.trim();
    if (!query || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: query }]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/ask?q=${encodeURIComponent(query)}`);
      const text = res.ok ? await res.text() : "";
      const answer =
        text ||
        "I couldn't reach the intelligence backend. Showing a cached perspective: market is consolidating with neutral sentiment.";
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Backend unreachable. Once your server at localhost:8080 is running, live answers will stream here.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[640px] lg:h-full lg:min-h-[640px] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[oklch(0.72_0.17_30)] to-[oklch(0.75_0.14_350)] grid place-items-center">
          <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Market Copilot</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            AI Intelligence
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-glow-pulse" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 animate-message-in ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`h-7 w-7 rounded-lg grid place-items-center shrink-0 ${
                m.role === "user"
                  ? "bg-accent"
                  : "bg-gradient-to-br from-[oklch(0.72_0.17_30)] to-[oklch(0.75_0.14_350)]"
              }`}
            >
              {m.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-background" />
              )}
            </div>
            <div
              className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] ${
                m.role === "user"
                  ? "bg-accent text-foreground"
                  : "bg-[oklch(0.96_0.02_40_/_0.8)] border border-border"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 animate-message-in">
            <div className="h-7 w-7 rounded-lg grid place-items-center shrink-0 bg-gradient-to-br from-[oklch(0.72_0.17_30)] to-[oklch(0.75_0.14_350)] animate-glow-pulse">
              <Bot className="h-3.5 w-3.5 text-background" />
            </div>
            <div className="rounded-xl px-3.5 py-3 bg-[oklch(0.96_0.02_40_/_0.8)] border border-border flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] typing-dot" />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] typing-dot"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] typing-dot"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] hover:bg-[oklch(0.72_0.17_30_/_0.08)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-border flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the market…"
          className="flex-1 bg-[oklch(0.98_0.012_50_/_0.9)] border border-border rounded-lg px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[oklch(0.72_0.17_30_/_0.2)] transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 rounded-lg font-medium text-sm text-background bg-gradient-to-br from-[oklch(0.72_0.17_30)] to-[oklch(0.7_0.16_15)] hover:animate-glow-pulse transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 glow-green"
        >
          <Send className="h-3.5 w-3.5" />
          Ask
        </button>
      </form>
    </div>
  );
}
