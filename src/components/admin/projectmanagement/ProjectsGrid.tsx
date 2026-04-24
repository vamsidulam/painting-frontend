import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectRecord } from "./data";

type Props = {
  rows: ProjectRecord[];
  onEdit?: (p: ProjectRecord) => void;
  onDelete?: (p: ProjectRecord) => void;
  emptyLabel?: string;
  loading?: boolean;
};

export function ProjectsGrid({
  rows,
  onEdit,
  onDelete,
  emptyLabel = "No projects yet.",
  loading = false,
}: Props) {
  if (loading && rows.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-10 grid place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] grid place-items-center z-10 pointer-events-none rounded-2xl">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {rows.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
          className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden flex flex-col"
        >
          <div className="aspect-4/3 bg-muted overflow-hidden">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="p-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground line-clamp-1">
                {p.name}
              </div>
            </div>
            <div className="inline-flex gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(p)}
                className="h-8 w-8 p-0"
                aria-label={`Edit ${p.name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(p)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${p.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
