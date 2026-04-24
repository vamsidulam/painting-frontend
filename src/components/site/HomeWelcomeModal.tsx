import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";
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

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HomeWelcomeModal({ open, onClose }: Props) {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    api<CategoriesResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categories.length]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const count = categories.length;

  const goNext = () => {
    if (count === 0) return;
    setIndex((i) => (i + 1) % count);
  };
  const goPrev = () => {
    if (count === 0) return;
    setIndex((i) => (i - 1 + count) % count);
  };

  if (!open) return null;

  const current = categories[index];

  return (
    <AnimatePresence>
      <motion.div
        key="welcome-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-card rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg grid place-items-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {count === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Loading categories…
            </div>
          ) : (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-4/3 md:aspect-auto bg-muted overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    {current?.image ? (
                      <img
                        src={current.image}
                        alt={current.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center">
                        <ImageIcon className="h-14 w-14 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 text-foreground text-[11px] font-semibold px-3 py-1 shadow">
                    {index + 1} / {count}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between min-h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-primary font-semibold text-xs uppercase tracking-wider">
                      Our Services
                    </span>
                    <h3 className="mt-2 font-display font-bold text-2xl md:text-3xl text-foreground">
                      {current?.name}
                    </h3>
                    {current?.description && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-5">
                        {current.description}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link to="/services" onClick={onClose}>
                    <Button className="rounded-xl h-11 px-5 gap-1.5 font-semibold">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="inline-flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={goPrev}
                      disabled={count <= 1}
                      aria-label="Previous"
                      className="h-11 w-11 rounded-full"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      onClick={goNext}
                      disabled={count <= 1}
                      aria-label="Next"
                      className="h-11 w-11 rounded-full"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex gap-1.5">
                  {categories.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Category ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
