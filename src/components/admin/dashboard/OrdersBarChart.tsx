import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";
import { ChartCard } from "./ChartCard";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "day" | "week" | "month" | "year";

type Bucket = { key: string; count: number };

type PeriodResponse = {
  success: boolean;
  data: {
    period: Period;
    year?: number;
    month?: number;
    buckets: Bucket[];
  };
};

const PERIODS: { value: Period; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString("en-US", { month: "long" }),
}));

const MONTHS_SHORT = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleString("en-US", { month: "short" }),
);

function yearOptions(count = 6): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => current - i);
}

function formatLabel(key: string, period: Period): string {
  if (period === "day") {
    const d = new Date(key);
    if (Number.isNaN(d.getTime())) return key;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (period === "week") {
    const m = key.match(/W(\d{1,2})/);
    return m ? `W${m[1]}` : key;
  }
  if (period === "month") {
    const [, mm] = key.split("-");
    const idx = Number(mm) - 1;
    return MONTHS_SHORT[idx] ?? key;
  }
  return key;
}

export function OrdersBarChart() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>("day");
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  const [buckets, setBuckets] = useState<Bucket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ period });
    if (period === "week" || period === "month")
      params.set("year", String(year));
    if (period === "week") params.set("month", String(month));

    api<PeriodResponse>(
      `/admin/dashboard/orders-per-period?${params.toString()}`,
    )
      .then((res) => {
        if (!cancelled) setBuckets(res.data.buckets);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load orders",
          );
          setBuckets(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, year, month]);

  const data = useMemo(
    () =>
      (buckets ?? []).map((b) => ({
        label: formatLabel(b.key, period),
        key: b.key,
        count: b.count,
      })),
    [buckets, period],
  );

  const total = useMemo(
    () => (buckets ? buckets.reduce((s, b) => s + b.count, 0) : 0),
    [buckets],
  );

  const max = useMemo(
    () => (data.length ? Math.max(...data.map((d) => d.count)) : 0),
    [data],
  );

  const subtitle = useMemo(() => {
    if (!buckets) return "Loading…";
    if (period === "day")
      return `${total.toLocaleString()} orders · last 30 days`;
    if (period === "week") {
      const mName = MONTHS[month - 1]?.label ?? "";
      return `${total.toLocaleString()} orders · ${mName} ${year}`;
    }
    if (period === "month")
      return `${total.toLocaleString()} orders · ${year}`;
    return `${total.toLocaleString()} orders · last 4 years`;
  }, [buckets, period, total, year, month]);

  const title = useMemo(() => {
    if (period === "day") return "Orders per Day";
    if (period === "week") return "Orders per Week";
    if (period === "month") return "Orders per Month";
    return "Orders per Year";
  }, [period]);

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      delay={0.15}
      action={
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="inline-flex p-1 bg-muted/60 rounded-xl">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {(period === "week" || period === "month") && (
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="h-9 w-[96px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions(6).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {period === "week" && (
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="h-9 w-[128px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      }
    >
      <div className="h-70 w-full">
        {error ? (
          <div className="h-full flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : loading && !buckets ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : total === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No orders in this window yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="ordersBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.95}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0.55}
                  />
                </linearGradient>
                <linearGradient id="ordersBarPeak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
                  <stop
                    offset="100%"
                    stopColor="var(--accent)"
                    stopOpacity={0.7}
                  />
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
                minTickGap={12}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  color: "var(--foreground)",
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                formatter={(value: number) => [`${value} orders`, "Orders"]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.count === max && max > 0
                        ? "url(#ordersBarPeak)"
                        : "url(#ordersBarGradient)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
