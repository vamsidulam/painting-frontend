import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

type PublicCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type ListResponse = {
  success: boolean;
  data: { categories: PublicCategory[] };
};

export function Services() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
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
          <p className="mt-4 text-muted-foreground text-lg">
            Browse categories and dive into the services that fit your space.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-card/60 border border-border animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-6 py-8">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-12 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl px-6 py-10">
            No categories available yet.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
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
