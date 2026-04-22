import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatRupees, type BookingService, type ServiceCategory } from "./types";

type Props = {
  category: ServiceCategory;
  value: BookingService | null;
  onChange: (service: BookingService) => void;
};

type ListResponse = {
  success: boolean;
  data: { services: BookingService[] };
};

export function ServiceStep({ category, value, onChange }: Props) {
  const [services, setServices] = useState<BookingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api<ListResponse>(`/services?category=${category}`, { auth: false })
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
  }, [category]);

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
      <div className="text-center py-12 text-muted-foreground">
        No {category} services available right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((s) => {
        const active = value?.id === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s)}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              active
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display font-bold text-lg text-foreground">
                  {s.name}
                </div>
                {s.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                )}
              </div>
              <div className="text-primary font-semibold whitespace-nowrap">
                {formatRupees(s.cost)}
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  / sqft
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
