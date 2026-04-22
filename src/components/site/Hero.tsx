import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  { src: hero1, label: "Interior" },
  { src: hero2, label: "Exterior" },
];

const rotatingWords = ["Walls", "Rooms", "Homes", "Dreams"];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIndex(0);
      return;
    }
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5500,
    );
    return () => clearInterval(id);
  }, [isMobile]);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden flex flex-col pt-20 md:pt-24">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[index].src}
              alt="Painting service"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 flex-1 flex flex-col justify-center pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl md:pl-12 lg:pl-20"
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
            <span className="relative inline-block pb-2">
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
            </span>
            <br />
            <span>With Magic.</span>
          </h1>

          <p className="mt-6 text-sm md:text-base text-white/90 max-w-xl leading-relaxed">
            Where every brushstroke tells a story. Affordable, fast & trusted
            painting services — get a free instant quote and transform your
            space in days, not weeks.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button
                size="lg"
                className="rounded-2xl text-sm h-11 px-6 font-semibold transition-transform hover:scale-105 group"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl bg-white/10 text-white border-white/40 text-sm h-11 px-6 hover:bg-white/20 hover:text-white"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-8 text-white/90">
            {[
              { v: "12K+", l: "Happy Homes" },
              { v: "200+", l: "Pro Painters" },
              { v: "48hr", l: "Avg. Start" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
              >
                <div className="font-display font-extrabold text-2xl md:text-3xl text-white">
                  {s.v}
                </div>
                <div className="text-xs mt-0.5 tracking-wide">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-10 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
