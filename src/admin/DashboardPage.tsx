import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { StatCard } from "./components/StatCard";

export function DashboardPage() {
  const stats = useQuery(api.dashboard.stats);
  if (!stats) {
    return <p>Loading dashboard…</p>;
  }
  return (
    <div>
      <h1 className="display text-5xl">Today in the studio</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active products" value={stats.activeProducts} />
        <StatCard label="Active services" value={stats.activeServices} />
      </div>
    </div>
  );
}
