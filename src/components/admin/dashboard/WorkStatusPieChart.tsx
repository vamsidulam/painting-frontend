import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";
import { ChartCard } from "./ChartCard";
import { api } from "@/lib/api";

type WorkStatusCounts = {
  pending: number;
  started: number;
  completed: number;
};

type WorkStatusResponse = {
  success: boolean;
  data: { counts: WorkStatusCounts; total: number };
};

const SEGMENTS: {
  key: keyof WorkStatusCounts;
  name: string;
  color: string;
}[] = [
  { key: "pending", name: "Pending", color: "var(--muted-foreground)" },
  { key: "started", name: "Started", color: "var(--primary)" },
  { key: "completed", name: "Completed", color: "var(--success)" },
];

export function WorkStatusPieChart() {
  const [counts, setCounts] = useState<WorkStatusCounts | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<WorkStatusResponse>("/admin/dashboard/work-status")
      .then((res) => {
        if (!cancelled) {
          setCounts(res.data.counts);
          setTotal(res.data.total);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load work status",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = counts
    ? SEGMENTS.map((s) => ({
        name: s.name,
        value: counts[s.key],
        color: s.color,
      }))
    : [];

  return (
    <ChartCard
      title="Work Status"
      subtitle="Progress across accepted orders"
      delay={0.25}
    >
      <div className="flex-1 min-h-70 w-full relative">
        {error ? (
          <div className="h-full flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : !counts ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : total === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No active jobs yet.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} (${((value / total) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={3}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="font-display font-bold text-3xl text-foreground">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Active jobs</div>
            </div>
          </>
        )}
      </div>

      {counts && total > 0 && (
        <div className="mt-6 space-y-2.5">
          {data.map((s) => {
            const pct = ((s.value / total) * 100).toFixed(1);
            return (
              <div
                key={s.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: s.color }}
                  />
                  <span className="text-foreground font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{s.value}</span>
                  <span className="text-foreground font-semibold w-12 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}
