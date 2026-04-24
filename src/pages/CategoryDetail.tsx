import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Paintbrush, Palette } from "lucide-react";
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

type CategoriesResponse = {
  success: boolean;
  data: { categories: PublicCategory[] };
};

type WorkTypeChoice = {
  value: "fresh" | "repainting";
  title: string;
  subtitle: string;
  icon: typeof Paintbrush;
  gradient: string;
};

const WORK_TYPE_CHOICES: WorkTypeChoice[] = [
  {
    value: "fresh",
    title: "Fresh Painting",
    subtitle: "Brand new walls, first coat, full finish.",
    icon: Palette,
    gradient: "from-primary/25 via-primary/10 to-transparent",
  },
  {
    value: "repainting",
    title: "Repainting",
    subtitle: "Refresh existing walls with a new look.",
    icon: Paintbrush,
    gradient: "from-secondary/25 via-secondary/10 to-transparent",
  },
];

export default function CategoryDetailPage() {
  const { categoryId = "" } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<PublicCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = category
      ? `${category.name} — PaintBrush`
      : "Category — PaintBrush";
  }, [category]);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api<CategoriesResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (cancelled) return;
        const match =
          res.data.categories.find((c) => c.id === categoryId) ?? null;
        setCategory(match);
        if (!match) setError("Category not found.");
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load category",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

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
        <div className="container mx-auto px-4 max-w-5xl">
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
              {loading ? "Loading…" : category?.name || "Category"}
            </span>
            <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl text-foreground">
              {loading && !category ? (
                <span className="inline-block h-10 w-64 bg-muted rounded-lg animate-pulse" />
              ) : (
                <>
                  Fresh coat or
                  <br />
                  <span className="text-gradient">touch-up?</span>
                </>
              )}
            </h1>
           
          </div>

          <div className="mt-10">
            {error ? (
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
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {WORK_TYPE_CHOICES.map((choice, i) => (
                  <WorkTypeCard
                    key={choice.value}
                    choice={choice}
                    index={i}
                    to={`/categories/${categoryId}/${choice.value}`}
                    disabled={loading && !category}
                  />
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

function WorkTypeCard({
  choice,
  index,
  to,
  disabled,
}: {
  choice: WorkTypeChoice;
  index: number;
  to: string;
  disabled?: boolean;
}) {
  const Icon = choice.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Link
        to={to}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        className={`group relative block h-full rounded-3xl overflow-hidden bg-card border border-border shadow-card transition-all duration-500 ${
          disabled
            ? "opacity-60 pointer-events-none"
            : "hover:-translate-y-2 hover:shadow-glow"
        }`}
      >
        <div
          className={`absolute inset-0 bg-linear-to-br ${choice.gradient} opacity-80`}
        />
        <div className="relative p-8 md:p-10 flex flex-col gap-6 min-h-55">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary grid place-items-center">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              {choice.title}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {choice.subtitle}
            </p>
          </div>
          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
            See services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
