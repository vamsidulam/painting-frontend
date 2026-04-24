import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import texture from "@/assets/texture-2.avif";

type PublicCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type PublicService = {
  id: string;
  name: string;
  cost: number;
  description: string;
  image: string;
  workType: "fresh" | "repainting";
  category: string;
  categoryId: string;
  categoryName: string;
};

type CategoriesResponse = {
  success: boolean;
  data: { categories: PublicCategory[] };
};

type ServicesResponse = {
  success: boolean;
  data: { services: PublicService[] };
};

const WORK_TYPE_META: Record<
  "fresh" | "repainting",
  { title: string; subtitle: string }
> = {
  fresh: {
    title: "Fresh Painting",
    subtitle: "",
  },
  repainting: {
    title: "Repainting",
    subtitle: "",
  },
};

function formatRupees(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function isValidWorkType(v: string): v is "fresh" | "repainting" {
  return v === "fresh" || v === "repainting";
}

export default function CategoryServicesPage() {
  const { categoryId = "", workType = "" } = useParams();
  const navigate = useNavigate();

  const validWorkType = isValidWorkType(workType) ? workType : null;
  const meta = validWorkType ? WORK_TYPE_META[validWorkType] : null;

  const [category, setCategory] = useState<PublicCategory | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      category && meta
        ? `${meta.title} — ${category.name} — Brushly`
        : "Services — Brushly";
  }, [category, meta]);

  useEffect(() => {
    if (!categoryId || !validWorkType) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [catsRes, svcRes] = await Promise.all([
          api<CategoriesResponse>("/services/categories", { auth: false }),
          api<ServicesResponse>(
            `/services?categoryId=${encodeURIComponent(
              categoryId,
            )}&workType=${encodeURIComponent(validWorkType)}`,
            { auth: false },
          ),
        ]);
        if (cancelled) return;
        const match =
          catsRes.data.categories.find((c) => c.id === categoryId) ?? null;
        setCategory(match);
        setServices(svcRes.data.services);
        if (!match) setError("Category not found.");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load services",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId, validWorkType]);

  const headerTitle = useMemo(() => {
    if (!meta) return "Services";
    return meta.title;
  }, [meta]);

  if (!validWorkType) {
    return (
      <main className="relative min-h-screen">
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${texture})` }}
        />
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-[1px]"
        />
        <Navbar />
        <section className="pt-28 md:pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4">
              Invalid work type.
              <div className="mt-4">
                <Link to="/services">
                  <Button variant="outline" className="rounded-xl">
                    Browse categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${texture})` }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-[1px]"
      />
      <Navbar />

      <section className="pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-6 max-w-2xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {category?.name || "Category"} · {headerTitle}
            </span>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl text-foreground">
             
            </h1>
            {meta && (
              <p className="mt-4 text-muted-foreground text-lg">
                {meta.subtitle}
              </p>
            )}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-3xl bg-card/60 border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4">
                {error}
                <div className="mt-4">
                  <Link to="/services">
                    <Button variant="outline" className="rounded-xl">
                      Browse categories
                    </Button>
                  </Link>
                </div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-card border border-border rounded-2xl px-5 py-10 text-center">
                No {headerTitle.toLowerCase()} services in{" "}
                {category?.name || "this category"} yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((s, i) => (
                  <ServiceCard key={s.id} service={s} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: PublicService;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="aspect-4/3 overflow-hidden bg-muted relative">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 text-primary/40" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-foreground line-clamp-1">
            {service.name}
          </h3>
          {service.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {service.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="font-semibold text-primary text-sm whitespace-nowrap">
            {formatRupees(service.cost)}
            <span className="text-muted-foreground font-normal text-[10px] ml-1">
              /sqft
            </span>
          </div>
          <Link
            to="/booking"
            state={{
              prefill: {
                category: {
                  id: service.categoryId,
                  name: service.categoryName,
                  description: "",
                  image: "",
                },
                workType: service.workType,
                service: {
                  id: service.id,
                  name: service.name,
                  cost: service.cost,
                  description: service.description,
                  image: service.image,
                  workType: service.workType,
                  categoryId: service.categoryId,
                  categoryName: service.categoryName,
                },
              },
            }}
          >
            <Button size="sm" className="h-8 rounded-lg gap-1 text-xs px-3">
              Book now
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
