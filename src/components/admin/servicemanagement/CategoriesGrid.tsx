import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceCategoryRecord } from "./data";

type Props = {
  rows: ServiceCategoryRecord[];
  onOpen: (category: ServiceCategoryRecord) => void;
  onEdit: (category: ServiceCategoryRecord) => void;
  onDelete: (category: ServiceCategoryRecord) => void;
  emptyLabel?: string;
  loading?: boolean;
};

export function CategoriesGrid({
  rows,
  onOpen,
  onEdit,
  onDelete,
  emptyLabel = "No categories yet.",
  loading = false,
}: Props) {
  if (loading && rows.length === 0) {
    return (
      <div className="py-16 grid place-items-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && rows.length > 0 && (
        <div className="absolute inset-0 bg-card/40 backdrop-blur-[1px] grid place-items-center z-10 rounded-2xl pointer-events-none">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            className="group relative bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col"
          >
            <button
              type="button"
              onClick={() => onOpen(c)}
              className="text-left w-full"
              aria-label={`View ${c.name} services`}
            >
              <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                {!c.isActive && (
                  <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                    Inactive
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-lg text-foreground line-clamp-1">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {c.description || (
                    <span className="italic text-muted-foreground/60">
                      No description
                    </span>
                  )}
                </p>
              </div>
            </button>
            <div className="flex items-center justify-end gap-2 px-4 pb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(c);
                }}
                className="h-8 w-8 p-0"
                aria-label={`Edit ${c.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c);
                }}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
