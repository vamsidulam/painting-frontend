import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

const featured = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner, Brooklyn",
    avatar: "https://i.pravatar.cc/120?img=1",
    rating: 5,
    text: "Absolutely flawless. The team showed up on time, finished a day early, and the deep blue accent wall is the talk of every dinner party.",
  },
  {
    name: "James Carter",
    role: "Office Manager",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    text: "We repainted our entire 3-floor office over a weekend with zero disruption. Pricing was transparent and the finish is gallery-grade.",
  },
  {
    name: "Aisha Rahman",
    role: "Interior Designer",
    avatar: "https://i.pravatar.cc/120?img=5",
    rating: 5,
    text: "I recommend PaintBrush to all my clients. Their painters are precise, polite and treat every home like it's their own.",
  },
  {
    name: "Marcus Chen",
    role: "Apartment Owner",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    text: "Booked Friday night, painters arrived Sunday morning. My living room looks brand new. This is the future of home services.",
  },
];

const wall = [
  {
    name: "Priya Nair",
    role: "Villa owner, Kochi",
    avatar: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    text: "The exterior came out stunning. Survived the monsoon without a single peel. The warranty gave us real peace of mind.",
  },
  {
    name: "Ethan Blake",
    role: "Studio owner",
    avatar: "https://i.pravatar.cc/100?img=14",
    rating: 5,
    text: "They matched an old 80s teal perfectly. Can't believe how fast the colour-matching process was.",
  },
  {
    name: "Ritu Patel",
    role: "Homeowner, Mumbai",
    avatar: "https://i.pravatar.cc/100?img=21",
    rating: 5,
    text: "From booking to finishing was under a week. The app kept us updated at every step.",
  },
  {
    name: "Noah Williams",
    role: "Co-working space",
    avatar: "https://i.pravatar.cc/100?img=52",
    rating: 5,
    text: "Night shift paint-over meant we opened Monday morning with zero downtime. Genuinely impressed.",
  },
  {
    name: "Anjali Kumar",
    role: "Apartment, Bengaluru",
    avatar: "https://i.pravatar.cc/100?img=30",
    rating: 5,
    text: "The prep work is what sold me. They sanded and patched everything before a single coat went on.",
  },
  {
    name: "Daniel Lopez",
    role: "Boutique owner",
    avatar: "https://i.pravatar.cc/100?img=58",
    rating: 5,
    text: "Clean finish, tidy site, on-time delivery. Will hire PaintBrush again for our next store.",
  },
];

export default function ReviewsPage() {
  const [i, setI] = useState(0);

  useEffect(() => {
    document.title = "PaintBrush";
  }, []);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % featured.length), 5000);
    return () => clearInterval(id);
  }, []);

  const r = featured[i];

  return (
    <main>
      <Navbar />

      <section className="pt-28 md:pt-36 pb-10 md:pb-14">
        <div className="container mx-auto px-4 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Loved by thousands
            </span>
            <h1 className="mt-3 font-display font-extrabold text-4xl md:text-5xl text-foreground">
              Real stories from <span className="text-gradient">real homes.</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              4.9 average rating across 12,000+ completed projects.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
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

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {featured.map((_, idx) => (
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setI((v) => (v - 1 + featured.length) % featured.length)
                }
                className="h-9 w-9 p-0 rounded-xl"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setI((v) => (v + 1) % featured.length)}
                className="h-9 w-9 p-0 rounded-xl"
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-secondary/40 border-y border-border py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              More reviews
            </span>
            <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl">
              What homeowners are saying
            </h2>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wall.map((w, idx) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex gap-1">
                  {[...Array(w.rating)].map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground leading-relaxed flex-1">
                  "{w.text}"
                </p>
                <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold">{w.name}</div>
                    <div className="text-xs text-muted-foreground">{w.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl">
            Ready to join them?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get a free quote in under two minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/booking">
              <Button size="lg" className="rounded-2xl h-11 px-6">
                Book a painter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
