import { TrendingDown, TrendingUp, Waves, BarChart3 } from "lucide-react";

const stats = [
  { label: "24h Min", value: "$66,108.42", icon: TrendingDown, accent: "text-neon-red" },
  { label: "24h Max", value: "$68,902.10", icon: TrendingUp, accent: "text-neon-green" },
  { label: "Volatility", value: "2.41%", icon: Waves, accent: "text-[var(--neon-cyan)]" },
  { label: "Volume", value: "$28.4B", icon: BarChart3, accent: "text-foreground" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="glass rounded-xl p-4 transition-all hover:border-[oklch(1_0_0_/_0.15)] hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
            <Icon className={`h-3.5 w-3.5 ${accent}`} />
          </div>
          <div className={`font-mono text-lg font-semibold tabular-nums ${accent}`}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
