import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { StatCard } from "./components/StatCard";
import { useToast } from "@/components/ui/Toast";

export function DashboardPage() {
  const stats = useQuery(api.dashboard.stats);
  const seed = useMutation(api.seed.runAsAdmin);
  const { push } = useToast();
  if (!stats) {
    return <p>Loading dashboard…</p>;
  }
  return (
    <div>
      <h1 className="display text-5xl">Today in the studio</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="New quotes" value={stats.newQuotes} />
        <StatCard label="Active products" value={stats.activeProducts} />
        <StatCard label="Published projects" value={stats.publishedProjects} />
        <StatCard label="Active services" value={stats.activeServices} />
        <StatCard label="Live campaigns" value={stats.liveCampaigns} />
        <StatCard label="Published articles" value={stats.publishedArticles} />
      </div>
      <h2 className="display mt-12 text-3xl">Recent enquiries</h2>
      <ul className="mt-4 space-y-3">
        {stats.recentQuotes.map((quote) => (
          <li key={quote._id} className="flex items-center justify-between gap-4 border-b border-gold/20 py-3">
            <Link to={`/admin/quotes/${quote._id}`} className="hover:text-gold">
              {quote.name} · {quote.needType}
            </Link>
            <StatusBadge status={quote.status} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Button
          variant="line"
          onClick={async () => {
            await seed({});
            push("Sample content applied where missing.");
          }}
        >
          Apply sample content
        </Button>
      </div>
    </div>
  );
}
