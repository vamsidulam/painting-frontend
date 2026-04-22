import { motion } from "framer-motion";
import { recentOrders, type OrderRow } from "./data";

const statusStyles: Record<OrderRow["status"], string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In Progress": "bg-primary/10 text-primary border-primary/30",
  Completed: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

type Props = {
  rows?: OrderRow[];
  title?: string;
  description?: string;
  showHeader?: boolean;
  showViewAll?: boolean;
};

export function RecentOrdersTable({
  rows = recentOrders,
  title = "Recent Orders",
  description = "Latest bookings and their status",
  showHeader = true,
  showViewAll = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
    >
      {showHeader && (
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {showViewAll && (
            <button className="text-sm font-semibold text-accent hover:underline">
              View all
            </button>
          )}
        </div>
      )}
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  No orders match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {o.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {o.customer}
                  </td>
                  <td className="px-6 py-4 text-foreground">{o.service}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    ${o.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
