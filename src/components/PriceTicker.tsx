import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import subzeLogo from "@/assets/subze-logo.png";

type Tick = { symbol: string; price: number; change?: number };

const SYMBOLS = ["BTC", "ETH", "SOL", "BNB"];

function seedPrices(): Record<string, number> {
  return { BTC: 67432.18, ETH: 3521.44, SOL: 178.92, BNB: 612.05 };
}

export function PriceTicker() {
  const [prices, setPrices] = useState<Record<string, Tick>>(() =>
    Object.fromEntries(
      Object.entries(seedPrices()).map(([s, p]) => [s, { symbol: s, price: p, change: 0 }])
    )
  );
  const [connected, setConnected] = useState(false);
  const flashRef = useRef<Record<string, "up" | "down" | null>>({});
  const [, force] = useState(0);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallback: ReturnType<typeof setInterval> | null = null;
    let closed = false;

    const startFallback = () => {
      if (fallback) return;
      fallback = setInterval(() => {
        setPrices((prev) => {
          const next = { ...prev };
          for (const sym of SYMBOLS) {
            const cur = next[sym].price;
            const delta = cur * (Math.random() - 0.5) * 0.004;
            const np = Math.max(0.01, cur + delta);
            flashRef.current[sym] = np >= cur ? "up" : "down";
            next[sym] = { symbol: sym, price: np, change: np - cur };
          }
          return next;
        });
        force((n) => n + 1);
      }, 1500);
    };

    try {
      ws = new WebSocket("ws://localhost:8080/ws");
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        if (!closed) startFallback();
      };
      ws.onerror = () => {
        setConnected(false);
        startFallback();
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          const sym = (data.symbol || data.s || "").toUpperCase();
          const price = Number(data.price ?? data.p);
          if (!sym || !Number.isFinite(price)) return;
          setPrices((prev) => {
            const prevPrice = prev[sym]?.price ?? price;
            flashRef.current[sym] = price >= prevPrice ? "up" : "down";
            return { ...prev, [sym]: { symbol: sym, price, change: price - prevPrice } };
          });
        } catch {
          /* ignore */
        }
      };
    } catch {
      startFallback();
    }

    return () => {
      closed = true;
      ws?.close();
      if (fallback) clearInterval(fallback);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={subzeLogo}
            alt="Subze logo"
            className="h-9 w-9 rounded-lg object-cover shadow-sm"
          />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Subze</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Market Intelligence
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-thin">
          {SYMBOLS.map((sym) => {
            const t = prices[sym];
            const dir = flashRef.current[sym];
            const up = (t.change ?? 0) >= 0;
            return (
              <div
                key={sym}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border border-border min-w-fit transition-colors ${
                  dir === "up" ? "animate-flash-green" : dir === "down" ? "animate-flash-red" : ""
                }`}
              >
                <span className="text-xs font-semibold text-muted-foreground">{sym}</span>
                <span className="font-mono text-sm tabular-nums">
                  ${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-mono ${
                    up ? "text-neon-green" : "text-neon-red"
                  }`}
                >
                  {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(t.change ?? 0).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? "bg-[var(--brand)] animate-glow-pulse" : "bg-muted-foreground/50"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {connected ? "Live" : "Simulated"}
          </span>
        </div>
      </div>
    </header>
  );
}
