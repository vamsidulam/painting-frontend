import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";
import { ChartCard } from "./ChartCard";
import { api } from "@/lib/api";

type DayPoint = { date: string; revenue: number };

type RevenueResponse = {
  success: boolean;
  data: { days: DayPoint[] };
};

function formatRupees(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatTick(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${Math.round(v / 1000)}k`;
  return `₹${v}`;
}

function formatDayLabel(key: string) {
  const d = new Date(key);
  if (Number.isNaN(d.getTime())) return key;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RevenueLineChart() {
  const [days, setDays] = useState<DayPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<RevenueResponse>("/admin/dashboard/revenue-over-time")
      .then((res) => {
        if (!cancelled) setDays(res.data.days);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load revenue",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(
    () =>
      (days ?? []).map((d) => ({
        label: formatDayLabel(d.date),
        date: d.date,
        revenue: d.revenue,
      })),
    [days],
  );

  const total = useMemo(
    () => (days ? days.reduce((s, d) => s + d.revenue, 0) : 0),
    [days],
  );

  return (
    <ChartCard
      title="Revenue Over Time"
      subtitle={
        days ? `Last 30 days · ${formatRupees(total)} total` : "Last 30 days"
      }
      delay={0.1}
    >
      <div className="flex-1 min-h-70 w-full">
        {error ? (
          <div className="h-full flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : !days ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatTick}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [formatRupees(value), "Revenue"]}
                cursor={{
                  stroke: "var(--primary)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                activeDot={{
                  r: 6,
                  fill: "var(--primary)",
                  stroke: "var(--card)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
