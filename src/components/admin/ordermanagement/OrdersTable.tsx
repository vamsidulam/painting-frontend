import { motion } from "framer-motion";
import { Check, Eye, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  type OrderRecord,
  type OrderStatus,
  type OrderWorkStatus,
} from "./data";

type Props = {
  rows: OrderRecord[];
  loading?: boolean;
  emptyLabel?: string;
  onView: (order: OrderRecord) => void;
  onDelete: (order: OrderRecord) => void;
  onAccept: (order: OrderRecord) => void;
  onReject: (order: OrderRecord) => void;
  onSetWorkStatus: (order: OrderRecord, next: OrderWorkStatus) => void;
  busyOrderId?: string | null;
};

const statusStyles: Record<OrderStatus, string> = {
  requested: "bg-warning/15 text-warning border-warning/30",
  accepted: "bg-primary/10 text-primary border-primary/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const workStatusStyles: Record<OrderWorkStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  started: "bg-primary/10 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
};

function getWorkProgression(current: OrderWorkStatus | null): {
  next: OrderWorkStatus | null;
  label: string;
} {
  const actual = current ?? "pending";
  if (actual === "pending") return { next: "started", label: "Mark started" };
  if (actual === "started") return { next: "completed", label: "Mark completed" };
  return { next: null, label: "Completed" };
}

export function OrdersTable({
  rows,
  loading = false,
  emptyLabel = "No orders yet.",
  onView,
  onDelete,
  onAccept,
  onReject,
  onSetWorkStatus,
  busyOrderId = null,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden relative"
    >
      {loading && rows.length > 0 && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] grid place-items-center z-10 pointer-events-none">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Service</th>
              <th className="px-6 py-3 font-semibold">Amount</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Work</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((o) => {
                const busy = busyOrderId === o.id;
                const work = getWorkProgression(o.workStatus);
                return (
                  <tr
                    key={o.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors align-top"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {o.customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {o.customer.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {o.customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {o.service.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {o.category} · {o.propertyType}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap text-foreground">
                      {formatCurrency(o.totalCost)}
                      <div className="text-xs text-muted-foreground font-normal">
                        {o.sqft.toLocaleString()} sqft
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {o.workStatus ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${workStatusStyles[o.workStatus]}`}
                        >
                          {o.workStatus}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {o.status === "requested" && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onAccept(o)}
                              disabled={busy}
                              className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                              aria-label={`Accept order for ${o.customer.name}`}
                              title="Accept"
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onReject(o)}
                              disabled={busy}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label={`Reject order for ${o.customer.name}`}
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onView(o)}
                              className="h-8 w-8 p-0"
                              aria-label={`View order for ${o.customer.name}`}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {o.status === "accepted" && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                work.next && onSetWorkStatus(o, work.next)
                              }
                              disabled={busy || work.next === null}
                              className="h-8 rounded-lg gap-1"
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : null}
                              {work.label}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onView(o)}
                              className="h-8 w-8 p-0"
                              aria-label={`View order for ${o.customer.name}`}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(o)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label={`Delete order for ${o.customer.name}`}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {o.status === "rejected" && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onAccept(o)}
                              disabled={busy}
                              className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                              aria-label={`Accept order for ${o.customer.name}`}
                              title="Accept"
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onView(o)}
                              className="h-8 w-8 p-0"
                              aria-label={`View order for ${o.customer.name}`}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(o)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label={`Delete order for ${o.customer.name}`}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
