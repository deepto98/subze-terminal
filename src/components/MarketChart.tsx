import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

function generateSeries(n = 120) {
  const points: number[] = [];
  let v = 100;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.48) * 4;
    points.push(v);
  }
  return points;
}

export function MarketChart() {
  const data = useMemo(() => generateSeries(), []);
  const w = 800;
  const h = 320;
  const pad = 16;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);

  const points = data
    .map((d, i) => `${pad + i * stepX},${pad + (h - pad * 2) * (1 - (d - min) / range)}`)
    .join(" ");

  const area = `M ${pad},${h - pad} L ${points} L ${w - pad},${h - pad} Z`;

  const last = data[data.length - 1];
  const first = data[0];
  const up = last >= first;
  const pct = ((last - first) / first) * 100;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
            <TrendingUp className="h-3.5 w-3.5" />
            BTC / USDT · 1H
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-mono text-3xl font-semibold tabular-nums">
              ${(67432.18).toLocaleString()}
            </span>
            <span
              className={`font-mono text-sm ${
                up ? "text-neon-green" : "text-neon-red"
              }`}
            >
              {up ? "+" : ""}
              {pct.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {["1H", "4H", "1D", "1W", "1M"].map((tf, i) => (
            <button
              key={tf}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors hover:bg-accent ${
                i === 2 ? "bg-accent text-foreground" : "text-muted-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[280px] sm:h-[320px]">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.86 0.24 145)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="oklch(0.86 0.24 145)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.86 0.24 145)" />
              <stop offset="100%" stopColor="oklch(0.85 0.16 210)" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={pad}
              x2={w - pad}
              y1={pad + (h - pad * 2) * t}
              y2={pad + (h - pad * 2) * t}
              stroke="oklch(1 0 0 / 0.05)"
              strokeDasharray="4 6"
            />
          ))}

          <path d={area} fill="url(#chartFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="url(#chartLine)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
