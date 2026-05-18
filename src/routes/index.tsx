import { createFileRoute } from "@tanstack/react-router";
import { PriceTicker } from "@/components/PriceTicker";
import { MarketChart } from "@/components/MarketChart";
import { StatCards } from "@/components/StatCards";
import { AICopilot } from "@/components/AICopilot";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Subze — Market Intelligence Trading Terminal" },
      {
        name: "description",
        content:
          "Subze is a modern market intelligence trading terminal with live crypto prices and an AI copilot for traders.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <PriceTicker />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          <section className="lg:col-span-7 space-y-5">
            <MarketChart />
            <StatCards />
          </section>
          <aside className="lg:col-span-3">
            <AICopilot />
          </aside>
        </div>
      </main>
    </div>
  );
}
