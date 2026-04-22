import { useEffect } from "react";
import {
  StatsGrid,
  RevenueLineChart,
  OrdersBarChart,
  OrderStatusPieChart,
  WorkStatusPieChart,
} from "@/components/admin/dashboard";
import { useAuth } from "@/lib/auth";

export default function OverviewPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard — Brushly";
  }, []);

  const firstName = (user?.name ?? "Admin").split(/\s+/)[0];

  return (
    <>
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <RevenueLineChart />
        </div>
        <div className="h-full">
          <OrderStatusPieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <OrdersBarChart />
        </div>
        <div className="h-full">
          <WorkStatusPieChart />
        </div>
      </div>
    </>
  );
}
