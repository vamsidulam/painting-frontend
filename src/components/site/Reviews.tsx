import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner, Brooklyn",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    text: "Absolutely flawless. The team showed up on time, finished a day early, and the deep blue accent wall is the talk of every dinner party.",
  },
  {
    name: "James Carter",
    role: "Office Manager",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "We repainted our entire 3-floor office over a weekend with zero disruption. Pricing was transparent and the finish is gallery-grade.",
  },
  {
    name: "Aisha Rahman",
    role: "Interior Designer",
    avatar: "https://i.pravatar.cc/100?img=5",
    rating: 5,
    text: "I recommend Brushly to all my clients. Their painters are precise, polite and treat every home like it's their own.",
  },
  {
    name: "Marcus Chen",
    role: "Apartment Owner",
    avatar: "https://i.pravatar.cc/100?img=33",
    rating: 5,
    text: "Booked Friday night, painters arrived Sunday morning. My living room looks brand new. This is the future of home services.",
  },
];

export function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, []);

  const r = reviews[i];

  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Loved by thousands
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            What our customers <span className="text-gradient">say</span>.
          </h2>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-soft border border-border">
            <Quote className="absolute top-6 right-6 h-12 w-12 text-accent/20" />

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
                  "{r.text}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/30"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{r.name}</div>
                    <div className="text-sm text-muted-foreground">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-10 bg-accent" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
