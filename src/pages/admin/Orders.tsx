import { useEffect } from "react";
import { OrdersPanel } from "@/components/admin/ordermanagement";

export default function OrdersPage() {
  useEffect(() => {
    document.title = "Orders — Brushly";
  }, []);

  return (
    <>
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
          Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          Review incoming bookings, accept or reject them, and track work
          progress.
        </p>
      </div>

      <OrdersPanel />
    </>
  );
}
