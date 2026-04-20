import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star, PaintBucket, Brush, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  { src: hero1, label: "Interior" },
  { src: hero2, label: "Exterior" },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden flex flex-col pt-20 md:pt-24">
      {/* Carousel background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[index].src}
              alt="Painting service"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/40" />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-32 right-10 hidden md:block"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-16 w-16 rounded-2xl glass-dark flex items-center justify-center">
          <Brush className="h-7 w-7 text-accent-glow" />
        </div>
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-8 hidden lg:block"
        animate={{ y: [0, 25, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-14 w-14 rounded-2xl glass-dark flex items-center justify-center">
          <PaintBucket className="h-6 w-6 text-primary-foreground" />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-1/4 hidden lg:block"
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-12 w-12 rounded-2xl glass-dark flex items-center justify-center">
          <Palette className="h-5 w-5 text-accent-glow" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="container relative mx-auto px-4 flex-1 flex flex-col justify-center pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl md:pl-12 lg:pl-20"
        >
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-3 py-1.5 text-primary-foreground text-xs md:text-sm">
            <Sparkles className="h-4 w-4 text-accent-glow" />
            <span>Rated 4.9 by 12,000+ homeowners</span>
            <div className="flex gap-0.5 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent-glow text-accent-glow" />
              ))}
            </div>
          </div>

          <h1 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-[1.05] tracking-tight">
            Book Professional
            <br />
            <span className="bg-gradient-to-r from-accent-glow via-accent to-accent-glow bg-clip-text text-transparent">
              Painters
            </span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-primary-foreground/80 max-w-xl leading-relaxed">
            Affordable, fast & trusted painting services. Get a free instant quote and
            transform your space in days — not weeks.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button
                size="lg"
                className="rounded-2xl gradient-accent text-accent-foreground shadow-accent-glow text-sm h-11 px-6 hover:scale-105 transition-transform"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl glass-dark text-primary-foreground border-white/20 text-sm h-11 px-6 hover:bg-white/10"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-primary-foreground/80">
            {[
              { v: "12K+", l: "Happy Homes" },
              { v: "200+", l: "Pro Painters" },
              { v: "48hr", l: "Avg. Start" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-bold text-2xl text-primary-foreground">{s.v}</div>
                <div className="text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-10 bg-accent" : "w-2 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
