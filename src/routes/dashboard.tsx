import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ListOrdered, Users, Settings, BarChart3,
  TrendingUp, Briefcase, DollarSign, PaintBucket, Bell, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Brushly" },
      { name: "description", content: "Manage orders, jobs and revenue from your Brushly dashboard." },
      { property: "og:title", content: "Dashboard — Brushly" },
      { property: "og:description", content: "Manage orders, jobs and revenue." },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Total Orders", value: 1284, prefix: "", icon: ListOrdered, color: "from-primary to-primary-glow", trend: "+12%" },
  { label: "Active Jobs", value: 47, prefix: "", icon: Briefcase, color: "from-accent to-accent-glow", trend: "+5%" },
  { label: "Revenue", value: 184320, prefix: "$", icon: DollarSign, color: "from-success to-primary-glow", trend: "+23%" },
  { label: "Pro Painters", value: 312, prefix: "", icon: Users, color: "from-primary-glow to-accent", trend: "+8%" },
];

const orders = [
  { id: "BRS-1248", customer: "Sarah Mitchell", service: "Interior", amount: 1240, status: "In Progress" },
  { id: "BRS-1247", customer: "James Carter", service: "Commercial", amount: 8900, status: "Pending" },
  { id: "BRS-1246", customer: "Aisha Rahman", service: "Exterior", amount: 3450, status: "Completed" },
  { id: "BRS-1245", customer: "Marcus Chen", service: "Wall Repair", amount: 320, status: "Completed" },
  { id: "BRS-1244", customer: "Olivia Park", service: "Interior", amount: 2100, status: "In Progress" },
  { id: "BRS-1243", customer: "Daniel Reed", service: "Exterior", amount: 4780, status: "Pending" },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In Progress": "bg-primary/10 text-primary border-primary/30",
  Completed: "bg-success/15 text-success border-success/30",
};

function Counter({ to, prefix = "" }: { to: number; prefix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{prefix}{n.toLocaleString()}</>;
}

function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-sidebar text-sidebar-foreground flex-col p-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
            <PaintBucket className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-xl">
            Brush<span className="text-accent">ly</span>
          </span>
        </Link>

        <nav className="mt-10 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Overview", active: true },
            { icon: ListOrdered, label: "Orders" },
            { icon: Briefcase, label: "Jobs" },
            { icon: Users, label: "Painters" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Settings, label: "Settings" },
          ].map((it) => (
            <button
              key={it.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                it.active
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-2xl glass-dark">
          <div className="text-xs text-sidebar-foreground/60">Need help?</div>
          <div className="mt-1 font-semibold text-sm">Talk to support</div>
          <button className="mt-3 w-full px-3 py-2 rounded-lg gradient-accent text-accent-foreground text-xs font-semibold">
            Contact us
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-border px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders, customers..." className="pl-10 rounded-xl bg-background" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </button>
            <img src="https://i.pravatar.cc/40?img=15" alt="User" className="h-10 w-10 rounded-xl object-cover ring-2 ring-accent/30" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-8">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Welcome back, Alex 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your business today.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border relative overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-2xl`} />
                <div className="flex items-start justify-between">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-success">
                    <TrendingUp className="h-3 w-3" /> {s.trend}
                  </div>
                </div>
                <div className="mt-5 font-display font-bold text-3xl text-foreground">
                  <Counter to={s.value} prefix={s.prefix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Latest bookings and their status</p>
              </div>
              <button className="text-sm font-semibold text-accent hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order ID</th>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Service</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{o.customer}</td>
                      <td className="px-6 py-4 text-foreground">{o.service}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">${o.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
