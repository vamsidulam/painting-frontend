import { useEffect, useMemo, useState } from "react";
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

const paletteColors = [
  "#F97316", // orange
  "#EC4899", // pink
  "#8B5CF6", // purple
  "#06B6D4", // cyan
  "#10B981", // emerald
  "#FACC15", // yellow
];

const rotatingWords = [
  { word: "Walls", color: "from-pink-400 via-rose-400 to-orange-400" },
  { word: "Rooms", color: "from-cyan-300 via-sky-400 to-blue-400" },
  { word: "Homes", color: "from-amber-300 via-orange-400 to-red-400" },
  { word: "Dreams", color: "from-violet-400 via-fuchsia-400 to-pink-400" },
];

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
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [isMobile]);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2600);
    return () => clearInterval(id);
  }, []);

  const current = rotatingWords[wordIndex];

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden flex flex-col pt-20 md:pt-24">
      {/* Continuous paint rain & splats */}
      <PaintRain />

      {/* Carousel background */}
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

        {/* Base brand gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/65 to-accent/50" />

        {/* Multi-color painterly wash */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, rgba(236,72,153,0.75), transparent 40%), radial-gradient(circle at 85% 75%, rgba(6,182,212,0.65), transparent 45%), radial-gradient(circle at 70% 10%, rgba(250,204,21,0.55), transparent 35%), radial-gradient(circle at 30% 90%, rgba(139,92,246,0.6), transparent 40%)",
          }}
        />

        {/* Subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.09] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Paint drips from top */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none opacity-90 z-[1]"
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        style={{ height: 130 }}
      >
        <defs>
          <linearGradient id="dripPink" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dripOrange" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dripCyan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dripYellow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M160 0 Q 165 40 162 72 Q 159 98 164 112 L 168 118 Q 173 108 170 88 Q 167 50 172 0 Z"
          fill="url(#dripPink)"
        />
        <path
          d="M430 0 Q 436 30 434 58 Q 432 80 436 94 L 440 98 Q 444 86 442 66 Q 440 38 444 0 Z"
          fill="url(#dripOrange)"
        />
        <path
          d="M720 0 Q 726 48 724 82 Q 722 106 727 122 L 731 126 Q 736 114 733 90 Q 731 54 735 0 Z"
          fill="url(#dripCyan)"
        />
        <path
          d="M1020 0 Q 1024 28 1022 52 Q 1020 72 1024 86 L 1028 90 Q 1032 78 1030 60 Q 1028 36 1032 0 Z"
          fill="url(#dripYellow)"
        />
        <path
          d="M1280 0 Q 1286 38 1284 66 Q 1282 90 1287 104 L 1291 108 Q 1296 96 1293 76 Q 1291 44 1295 0 Z"
          fill="url(#dripPink)"
        />
      </svg>

      {/* Animated color blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-50 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #EC4899, transparent 70%)" }}
        animate={{ x: [0, 70, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-45 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/3 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #FACC15, transparent 70%)" }}
        animate={{ x: [0, 55, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-40 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Painter's palette card */}
      <motion.div
        className="absolute top-28 right-4 md:right-8 hidden md:flex flex-col gap-2 z-10"
        initial={{ opacity: 0, x: 50, rotate: 6 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="glass-dark rounded-2xl px-3 py-2 flex items-center gap-2 border border-white/25">
          <Palette className="h-4 w-4 text-accent-glow" />
          <span className="text-xs text-primary-foreground font-medium tracking-wide">Today's palette</span>
        </div>
        <div className="glass-dark rounded-2xl p-3 flex gap-2 border border-white/25 shadow-2xl">
          {paletteColors.map((c, i) => (
            <motion.div
              key={c}
              className="h-7 w-7 rounded-full ring-2 ring-white/50 shadow-lg"
              style={{ background: c, boxShadow: `0 0 20px ${c}70` }}
              animate={{ y: [0, -6, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating glowing icons */}
      <motion.div
        className="absolute top-40 left-6 hidden lg:block z-[2]"
        animate={{ y: [0, -18, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 blur-xl opacity-70" />
          <div className="relative h-14 w-14 rounded-2xl glass-dark flex items-center justify-center border border-white/30">
            <Brush className="h-6 w-6 text-accent-glow" />
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-4 hidden lg:block z-[2]"
        animate={{ y: [0, 22, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 blur-xl opacity-70" />
          <div className="relative h-12 w-12 rounded-2xl glass-dark flex items-center justify-center border border-white/30">
            <PaintBucket className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Slow-rotating paint splash */}
      <motion.svg
        className="absolute bottom-24 right-10 hidden md:block pointer-events-none z-[1]"
        width="160"
        height="160"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="splash1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <path
          d="M50 8 Q 62 18 72 16 Q 86 22 84 38 Q 96 48 82 58 Q 90 72 74 76 Q 72 90 56 86 Q 50 98 40 88 Q 24 94 22 78 Q 8 72 16 58 Q 4 48 18 40 Q 14 22 30 22 Q 38 6 50 8 Z"
          fill="url(#splash1)"
        />
      </motion.svg>

      {/* Content */}
      <div className="container relative mx-auto px-4 flex-1 flex flex-col justify-center pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl md:pl-12 lg:pl-20"
        >
          {/* Rainbow-border rating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: 1,
              scale: 1,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2 },
              scale: { duration: 0.6, delay: 0.2 },
              backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" },
            }}
            className="relative inline-flex p-[1.5px] rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg,#EC4899,#F97316,#FACC15,#06B6D4,#8B5CF6,#EC4899)",
              backgroundSize: "300% 100%",
            }}
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
          </motion.div>

          <h1 className="mt-5 font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-[1.05] tracking-tight">
            We Paint Your
            <br />
            <span className="relative inline-block pb-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.word}
                  initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className={`inline-block bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}
                  style={{ WebkitTextStroke: "0" }}
                >
                  {current.word}
                </motion.span>
              </AnimatePresence>
              {/* Animated brush stroke underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="14"
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="brushStroke" x1="0" x2="1">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#FACC15" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M2 8 Q 50 2 150 6 T 298 5"
                  stroke="url(#brushStroke)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
              </svg>
            </span>
            <br />
            <span className="text-primary-foreground/95">With Magic.</span>
          </h1>

          <p className="mt-6 text-sm md:text-base text-primary-foreground/85 max-w-xl leading-relaxed">
            Where every brushstroke tells a story. Affordable, fast & trusted painting
            services — get a free instant quote and transform your space in days, not weeks.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button
                size="lg"
                className="relative rounded-2xl text-accent-foreground shadow-accent-glow text-sm h-11 px-6 transition-transform hover:scale-105 group overflow-hidden border-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#F97316,#EC4899,#F97316)",
                  backgroundSize: "200% 100%",
                }}
              >
                <span className="relative z-10 flex items-center font-semibold">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.span
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg,#F97316,#EC4899,#FACC15,#F97316)",
                    backgroundSize: "300% 100%",
                  }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </Button>
            </Link>
            <Link to="/booking">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl glass-dark text-primary-foreground border-white/25 text-sm h-11 px-6 hover:bg-white/10"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-8 text-primary-foreground/80">
            {[
              { v: "12K+", l: "Happy Homes", g: "from-pink-400 to-orange-400" },
              { v: "200+", l: "Pro Painters", g: "from-cyan-300 to-blue-400" },
              { v: "48hr", l: "Avg. Start", g: "from-amber-300 to-pink-400" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
              >
                <div
                  className={`font-display font-extrabold text-2xl md:text-3xl bg-gradient-to-r ${s.g} bg-clip-text text-transparent`}
                >
                  {s.v}
                </div>
                <div className="text-xs mt-0.5 tracking-wide">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide indicators (desktop only) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-10 bg-gradient-to-r from-pink-400 via-orange-400 to-amber-300"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function PaintRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: paletteColors[Math.floor(Math.random() * paletteColors.length)],
        delay: Math.random() * 6,
        duration: 2.2 + Math.random() * 2.4,
        width: 4 + Math.random() * 8,
        trail: 40 + Math.random() * 90,
      })),
    []
  );

  const splats = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: 10 + Math.random() * 80,
        color: paletteColors[Math.floor(Math.random() * paletteColors.length)],
        delay: Math.random() * 8,
        cycle: 6 + Math.random() * 5,
        size: 60 + Math.random() * 130,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {/* Continuous paint rain — teardrops with glowing trails */}
      {drops.map((d) => (
        <motion.div
          key={`drop-${d.id}`}
          className="absolute top-0"
          style={{ left: `${d.x}%`, width: d.width }}
          initial={{ y: "-20vh", opacity: 0 }}
          animate={{ y: "115vh", opacity: [0, 1, 1, 1, 0.9] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            ease: [0.4, 0, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 0.3 + Math.random() * 2,
          }}
        >
          <div
            style={{
              width: d.width,
              height: d.trail,
              background: `linear-gradient(to top, ${d.color}, ${d.color}00)`,
              borderRadius: "50%",
              filter: `drop-shadow(0 0 10px ${d.color})`,
            }}
          />
          <div
            style={{
              width: d.width * 1.4,
              height: d.width * 1.8,
              background: d.color,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              marginTop: -d.width * 0.8,
              marginLeft: -d.width * 0.2,
              filter: `drop-shadow(0 0 14px ${d.color})`,
            }}
          />
        </motion.div>
      ))}

      {/* Paint splats popping continuously across the screen */}
      {splats.map((s) => (
        <motion.svg
          key={`splat-${s.id}`}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            transform: "translate(-50%, -50%)",
          }}
          viewBox="0 0 100 100"
          initial={{ scale: 0, opacity: 0, rotate: s.rotate }}
          animate={{
            scale: [0, 1.25, 1, 1, 0.95, 0],
            opacity: [0, 0.9, 0.8, 0.6, 0.3, 0],
            rotate: [s.rotate, s.rotate + 40],
          }}
          transition={{
            duration: s.cycle,
            delay: s.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 2 + Math.random() * 4,
          }}
        >
          <path
            d="M50 12 Q 62 20 70 16 Q 84 26 82 40 Q 95 48 84 58 Q 92 72 76 74 Q 74 89 58 84 Q 52 97 42 88 Q 26 94 22 78 Q 8 72 18 58 Q 6 48 18 42 Q 14 24 30 24 Q 38 6 50 12 Z"
            fill={s.color}
            style={{ filter: `drop-shadow(0 0 18px ${s.color}90)` }}
          />
          <circle cx="78" cy="28" r="5" fill={s.color} opacity="0.85" />
          <circle cx="22" cy="74" r="4" fill={s.color} opacity="0.75" />
          <circle cx="86" cy="68" r="3" fill={s.color} opacity="0.7" />
        </motion.svg>
      ))}
    </div>
  );
}
