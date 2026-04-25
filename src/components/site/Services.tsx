import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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

type Tab = "categories" | "services";

function formatRupees(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Services() {
  const [tab, setTab] = useState<Tab>("categories");

  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [services, setServices] = useState<PublicService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    setCategoriesError(null);

    api<CategoriesResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories);
      })
      .catch((err) => {
        if (!cancelled) {
          setCategoriesError(
            err instanceof Error ? err.message : "Failed to load categories",
          );
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tab !== "services" || servicesLoaded) return;
    let cancelled = false;
    setServicesLoading(true);
    setServicesError(null);

    api<ServicesResponse>("/services", { auth: false })
      .then((res) => {
        if (!cancelled) {
          setServices(res.data.services);
          setServicesLoaded(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setServicesError(
            err instanceof Error ? err.message : "Failed to load services",
          );
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, servicesLoaded]);

  return (
    <section id="services" className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
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
            Pick a category,
            <br />
            <span className="text-gradient">we'll do the rest.</span>
          </h2>
         
        </motion.div>

        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card/70 backdrop-blur-sm p-1 shadow-card">
          <TabButton
            active={tab === "categories"}
            onClick={() => setTab("categories")}
          >
            Categories
          </TabButton>
          <TabButton
            active={tab === "services"}
            onClick={() => setTab("services")}
          >
            Services
          </TabButton>
        </div>

        {tab === "categories" ? (
          <CategoriesView
            categories={categories}
            loading={categoriesLoading}
            error={categoriesError}
          />
        ) : (
          <ServicesView
            services={services}
            loading={servicesLoading}
            error={servicesError}
          />
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground shadow-glow"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function CategoriesView({
  categories,
  loading,
  error,
}: {
  categories: PublicCategory[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-3xl bg-card/60 border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-12 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-6 py-8">
        {error}
      </div>
    );
  }
  if (categories.length === 0) {
    return (
      <div className="mt-12 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl px-6 py-10">
        No categories available yet.
      </div>
    );
  }
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((c, i) => (
        <CategoryCard key={c.id} category={c} index={i} />
      ))}
    </div>
  );
}

function ServicesView({
  services,
  loading,
  error,
}: {
  services: PublicService[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-96 rounded-3xl bg-card/60 border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-12 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-6 py-8">
        {error}
      </div>
    );
  }
  if (services.length === 0) {
    return (
      <div className="mt-12 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl px-6 py-10">
        No services available yet.
      </div>
    );
  }
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {services.map((s, i) => (
        <ServiceCard key={s.id} service={s} index={i} />
      ))}
    </div>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: PublicCategory;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link
        to={`/categories/${category.id}`}
        className="group relative block h-full rounded-2xl overflow-hidden bg-card border border-border shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
      >
        <div className="aspect-4/3 overflow-hidden bg-muted relative">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-base text-foreground line-clamp-1">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Explore
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>

          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: PublicService;
  index: number;
}) {
  const workTypeLabel =
    service.workType === "fresh" ? "Fresh Painting" : "Repainting";
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
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2.5 py-1 border border-border line-clamp-1">
            {service.categoryName}
          </span>
          <span
            className={`inline-flex items-center rounded-full text-[10px] font-semibold px-2.5 py-1 backdrop-blur-sm border ${
              service.workType === "fresh"
                ? "bg-primary/90 text-primary-foreground border-primary/40"
                : "bg-secondary/90 text-secondary-foreground border-secondary/40"
            }`}
          >
            {workTypeLabel}
          </span>
        </div>
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
