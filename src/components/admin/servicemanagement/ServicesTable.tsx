import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, workTypeLabel, type ServiceRecord } from "./data";

type Props = {
  rows: ServiceRecord[];
  onEdit?: (service: ServiceRecord) => void;
  onDelete?: (service: ServiceRecord) => void;
  emptyLabel?: string;
  loading?: boolean;
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
              <th className="px-6 py-3 font-semibold">Service</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Work type</th>
              <th className="px-6 py-3 font-semibold">Cost</th>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted border border-border grid place-items-center overflow-hidden shrink-0">
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground line-clamp-1">
                          {s.name}
                        </div>
                        {s.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {s.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 text-primary capitalize">
                      {s.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-border bg-muted/50 text-foreground whitespace-nowrap">
                      {workTypeLabel(s.workType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-semibold whitespace-nowrap">
                    {s.category?.includesMoney === false
                      ? "—"
                      : formatCurrency(s.cost)}
                  </td>
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
