import { motion } from "framer-motion";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type ServiceRecord } from "./data";

type Props = {
  rows: ServiceRecord[];
  onEdit?: (service: ServiceRecord) => void;
  onDelete?: (service: ServiceRecord) => void;
  emptyLabel?: string;
  loading?: boolean;
};

const categoryStyles: Record<ServiceRecord["category"], string> = {
  interior: "bg-primary/10 text-primary border-primary/30",
  exterior: "bg-accent/10 text-accent-foreground border-accent/30",
};

export function ServicesTable({
  rows,
  onEdit,
  onDelete,
  emptyLabel = "No services yet.",
  loading = false,
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
              <th className="px-6 py-3 font-semibold">Service name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Cost</th>
              {/* <th className="px-6 py-3 font-semibold">Description</th> */}
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors align-top"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {s.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${categoryStyles[s.category]}`}
                    >
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-semibold whitespace-nowrap">
                    {formatCurrency(s.cost)}
                  </td>
                  {/* <td className="px-6 py-4 text-muted-foreground max-w-md">
                    <p className="line-clamp-2">
                      {s.description || (
                        <span className="italic text-muted-foreground/60">
                          No description
                        </span>
                      )}
                    </p>
                  </td> */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(s)}
                        className="h-8 w-8 p-0"
                        aria-label={`Edit ${s.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete?.(s)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label={`Delete ${s.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
