import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Image as ImageIcon, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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

const heroModules = import.meta.glob<{ default: string }>(
  "/src/assets/hero/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const slides = Object.entries(heroModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, mod]) => ({
    src: mod.default,
    label: path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "",
  }));

const rotatingWords = ["Walls", "Rooms", "Homes", "Dreams"];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [categories, setCategories] = useState<PublicCategory[]>([]);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    api<CategoriesResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories.slice(0, 5));
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[640px] max-h-[820px] overflow-hidden flex flex-col pt-20 md:pt-24">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[index].src}
              alt="Painting service"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 flex-1 flex flex-col justify-center pb-10 z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl md:pl-8 lg:pl-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 text-foreground px-3 py-1.5 text-xs md:text-sm shadow-card"
          >
            <Sparkles className="h-4 w-4" />
            <span>Rated 4.9 by 12,000+ homeowners</span>
            <div className="flex gap-0.5 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
          </motion.div>

          <h1 className="mt-5 font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight">
            We Paint Your
            <br />
            <span className="relative inline-block pb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[wordIndex]}
                  initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            <span>With Magic.</span>
          </h1>

          <p className="mt-5 text-sm md:text-base text-white/90 max-w-xl leading-relaxed">
            Where every brushstroke tells a story. Affordable, fast & trusted
            painting services — get a free instant quote and transform your
            space in days.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button
                size="lg"
                className="rounded-2xl text-sm h-11 px-6 font-semibold transition-transform hover:scale-105 group"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl bg-white/10 text-white border-white/40 text-sm h-11 px-6 hover:bg-white/20 hover:text-white"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </motion.div>

          {categories.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block w-80 xl:w-96 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 bg-linear-to-r from-primary to-primary/90 text-primary-foreground">
                <div className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  Our services
                </div>
                <div className="font-display font-bold text-lg">
                  Explore by category
                </div>
              </div>
              <ul className="divide-y divide-border">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/categories/${c.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="h-11 w-11 rounded-xl bg-muted border border-border overflow-hidden shrink-0 grid place-items-center">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground line-clamp-1">
                          {c.name}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-3 bg-muted/40 text-center">
                <Link
                  to="/services"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  View all services
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.aside>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
