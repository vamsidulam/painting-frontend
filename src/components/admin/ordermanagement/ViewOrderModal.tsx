import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatAddress,
  formatCurrency,
  type OrderRecord,
  type OrderStatus,
  type OrderWorkStatus,
} from "./data";

type Props = {
  order: OrderRecord | null;
  onClose: () => void;
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground break-words">{value}</div>
    </div>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ViewOrderModal({ order, onClose }: Props) {
  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription>
            Full details and payment screenshot for this booking.
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
              {order.workStatus && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${workStatusStyles[order.workStatus]}`}
                >
                  Work · {order.workStatus}
                </span>
              )}
            </div>

            <section className="grid sm:grid-cols-2 gap-4">
              <Field label="Customer name" value={order.customer.name} />
              <Field label="Email" value={order.customer.email} />
              <Field label="Phone" value={order.customer.phone} />
              <Field
                label="Booking date"
                value={formatDateTime(order.createdAt)}
              />
            </section>

            <section className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <Field
                label="Service"
                value={
                  <>
                    <div className="font-medium">{order.service.name}</div>
                    <div className="text-muted-foreground capitalize">
                      {order.category}
                    </div>
                  </>
                }
              />
              <Field
                label="Property type"
                value={<span className="capitalize">{order.propertyType}</span>}
              />
              <Field
                label="Area"
                value={`${order.sqft.toLocaleString()} sqft`}
              />
              <Field
                label="Rate"
                value={`${formatCurrency(order.service.cost)} / sqft`}
              />
              <Field
                label="Total"
                value={
                  <span className="font-semibold text-foreground">
                    {formatCurrency(order.totalCost)}
                  </span>
                }
              />
            </section>

            <section className="pt-4 border-t border-border">
              <Field label="Location" value={formatAddress(order.address)} />
            </section>

            <section className="pt-4 border-t border-border">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Payment screenshot
              </div>
              <div className="mt-2">
                <a
                  href={order.screenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <img
                    src={order.screenshotUrl}
                    alt="Payment screenshot"
                    className="max-h-80 rounded-xl border border-border"
                  />
                </a>
                <div className="mt-2 text-xs text-muted-foreground break-all">
                  <a
                    href={order.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Open original
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
