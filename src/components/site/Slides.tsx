import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import slide1 from "@/assets/slides/file_0000000075787207b1cf729508a15cdf.png";
import slide2 from "@/assets/slides/file_000000008be07230a26184fe0fc851b9.png";
import slide3 from "@/assets/slides/file_00000000a8f87207be5f45ab925775b3.png";
import slide4 from "@/assets/slides/file_00000000eda071f88785e991f4fc9188.png";
import slide5 from "@/assets/slides/file_00000000eda071f88785e991f4fc9188 (1).png";

const SLIDES = [slide1, slide2, slide3, slide4, slide5];
const INTERVAL_MS = 2000;

export function Slides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto w-full max-w-5xl aspect-video overflow-hidden rounded-2xl border border-border shadow-card bg-muted">
          <AnimatePresence mode="sync">
            <motion.img
              key={index}
              src={SLIDES[index]}
              alt={`Slide ${index + 1}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-background/70 hover:bg-background"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
