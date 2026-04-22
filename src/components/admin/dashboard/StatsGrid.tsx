import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "./StatCard";

type Stats = {
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  completedJobs: number;
  pendingJobs: number;
};

type StatsResponse = {
  success: boolean;
  data: Stats;
};

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border px-6 py-5 min-h-32.5 animate-pulse">
      <div className="h-3 w-24 bg-muted rounded" />
      <div className="mt-5 h-9 w-28 bg-muted rounded" />
    </div>
  );
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<StatsResponse>("/admin/dashboard/stats")
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load stats");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-4 py-3 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards: {
    label: string;
    value: number;
    prefix?: string;
  }[] = [
    { label: "Total Customers", value: stats.totalCustomers },
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Revenue", value: stats.totalRevenue, prefix: "₹" },
    { label: "Completed Jobs", value: stats.completedJobs },
    { label: "Pending Jobs", value: stats.pendingJobs },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
      {cards.map((c, i) => (
        <StatCard key={c.label} index={i} {...c} />
      ))}
    </div>
  );
}
