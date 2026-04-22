import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type ServiceCategory = "interior" | "exterior";

type Service = {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: ServiceCategory;
};

type Filter = "all" | ServiceCategory;

type ListResponse = {
  success: boolean;
  data: { services: Service[] };
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
];

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

type SeedAdminResponse = {
  success: boolean;
  alreadyExisted: boolean;
  message: string;
};

export function Services() {
  const [filter, setFilter] = useState<Filter>("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleSeedAdmin = async () => {
    setSeeding(true);
    try {
      const res = await api<SeedAdminResponse>("/seed/admin", {
        method: "POST",
        auth: false,
      });
      if (res.alreadyExisted) {
        toast.message(res.message);
      } else {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filter !== "all") params.set("category", filter);
    const qs = params.toString();
    const path = qs ? `/services?${qs}` : "/services";

    api<ListResponse>(path, { auth: false })
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
  }, [filter]);

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Everything your walls need,
            <br />
            <span className="text-gradient">in one place.</span>
          </h2>
        </motion.div>

        <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-xl bg-muted">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-card/60 border border-border animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-6 py-8">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl px-6 py-8">
            {filter === "all"
              ? "No services available yet."
              : `No ${filter} services yet.`}
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <h3 className="font-display font-bold text-xl text-foreground">
                  {s.name}
                </h3>
                <div className="mt-1 text-primary font-semibold">
                  {formatRupees(s.cost)}
                  <span className="text-muted-foreground font-normal text-sm ml-1">
                    / sqft
                  </span>
                </div>
                {s.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSeedAdmin}
            disabled={seeding}
            className="rounded-xl"
          >
            {seeding ? "Seeding…" : "Seed admin"}
          </Button>
        </div>
      </div>
    </section>
  );
}
