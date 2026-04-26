import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  formatRupees,
  type BookingService,
  type ServiceCategory,
  type WorkType,
} from "./types";

type Props = {
  category: ServiceCategory;
  workType: WorkType;
  value: BookingService | null;
  onChange: (service: BookingService) => void;
};

type ApiService = {
  id: string;
  name: string;
  cost: number;
  description: string;
  image: string;
  workType: WorkType;
  category: string;
  categoryId: string;
  categoryName: string;
  categoryIncludesMoney?: boolean;
};

type ListResponse = {
  success: boolean;
  data: { services: ApiService[] };
};

export function ServiceStep({ category, workType, value, onChange }: Props) {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api<ListResponse>(
      `/services?categoryId=${encodeURIComponent(
        category.id,
      )}&workType=${encodeURIComponent(workType)}`,
      { auth: false },
    )
      .then((res) => {
        if (!cancelled) setServices(res.data.services);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load services",
          );
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category.id, workType]);

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

  if (services.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        No services available in {category.name} yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {services.map((s) => {
        const active = value?.id === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() =>
              onChange({
                id: s.id,
                name: s.name,
                cost: s.cost,
                description: s.description,
                image: s.image,
                workType: s.workType,
                categoryId: s.categoryId || category.id,
                categoryName: s.categoryName || category.name,
                categoryIncludesMoney:
                  s.categoryIncludesMoney ?? category.includesMoney ?? true,
              })
            }
            className={`group overflow-hidden rounded-xl border-2 text-left transition-all flex flex-col ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/40"
            }`}
          >
            <div className="aspect-4/3 bg-muted overflow-hidden relative">
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.name}
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
            <div className="p-3 flex flex-col flex-1 gap-2">
              <div className="font-semibold text-sm text-foreground line-clamp-1">
                {s.name}
              </div>
              {s.description && (
                <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                  {s.description}
                </p>
              )}
              {category.includesMoney !== false && (
                <div className="mt-auto text-primary font-semibold text-sm whitespace-nowrap">
                  {formatRupees(s.cost)}
                  <span className="text-muted-foreground font-normal text-[10px] ml-1">
                    /sqft
                  </span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
