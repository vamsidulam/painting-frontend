import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { ServiceCategory } from "./types";

type Props = {
  value: ServiceCategory | null;
  onChange: (category: ServiceCategory) => void;
};

type ListResponse = {
  success: boolean;
  data: { categories: ServiceCategory[] };
};

export function CategoryStep({ value, onChange }: Props) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api<ListResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load categories",
          );
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
        {error}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No categories available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((c) => {
        const active = value?.id === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c)}
            className={`group overflow-hidden rounded-xl border-2 text-left transition-all ${
              active
                ? "border-primary shadow-glow"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="aspect-[16/10] bg-muted relative overflow-hidden">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full grid place-items-center">
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
              {active && (
                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground shadow">
                  Selected
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm text-foreground line-clamp-1">
                {c.name}
              </div>
              {c.description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {c.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
