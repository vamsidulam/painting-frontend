import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Heart,
  PaintBucket,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero/hero-1.jpg";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    desc: "Every decision we make starts with the homeowner. Clarity, care, and consistency across every project.",
  },
  {
    icon: Award,
    title: "Craftsmanship",
    desc: "We only work with vetted painters who take pride in the tiny details — clean lines, even coats, spotless finishes.",
  },
  {
    icon: Sparkles,
    title: "Transparent Pricing",
    desc: "Upfront quotes with no surprises. You know exactly what you're paying for before a brush touches the wall.",
  },
  {
    icon: Target,
    title: "On-Time, Every Time",
    desc: "We respect your schedule. Most projects start within 48 hours and finish on the day we promised.",
  },
];

const stats = [
  { v: "12,000+", l: "Homes painted" },
  { v: "200+", l: "Verified pros" },
  { v: "4.9", l: "Average rating" },
  { v: "48hr", l: "Typical start time" },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "About — PaintBrush";
  }, []);

  return (
    <main>
      <Navbar />

      <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 -z-10 opacity-[0.07]">
          <img
            src={hero1}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h1 className="mt-3 font-display font-extrabold text-4xl md:text-6xl text-foreground leading-tight">
              We believe every wall{" "}
              <span className="text-gradient">tells a story.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              PaintBrush started with a simple idea — finding a trustworthy
              painter shouldn't be harder than picking a colour. We built a
              modern, transparent booking experience around the painters our
              families trust, and we're growing it one happy home at a time.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-display font-extrabold text-3xl md:text-4xl text-primary">
                  {s.v}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              What we stand for
            </span>
            <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl text-foreground">
              Values that guide every brushstroke.
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-bold text-lg text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our mission
              </span>
              <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl text-foreground">
                Modern home services, built around you.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Painting is personal. It changes the way a room feels, the mood
                you walk into every morning. Our job is to make that change
                smooth — instant quotes, trusted painters, clean finishes, and
                a team that shows up when they said they would.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We combine technology and tradition. Book in two minutes,
                track your project, and talk to real humans when you need them.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/booking">
                  <Button className="rounded-2xl h-11 px-6">
                    Get Free Quote
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" className="rounded-2xl h-11 px-6">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
                <Users className="h-6 w-6 text-primary" />
                <div className="mt-3 font-display font-bold text-2xl">
                  200+
                </div>
                <div className="text-sm text-muted-foreground">
                  Verified painters in our network
                </div>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6 shadow-card mt-8">
                <PaintBucket className="h-6 w-6 text-accent" />
                <div className="mt-3 font-display font-bold text-2xl">
                  120+
                </div>
                <div className="text-sm text-muted-foreground">
                  Premium paint finishes available
                </div>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
                <Award className="h-6 w-6 text-primary" />
                <div className="mt-3 font-display font-bold text-2xl">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">
                  Repeat & referral customers
                </div>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6 shadow-card mt-8">
                <Heart className="h-6 w-6 text-accent" />
                <div className="mt-3 font-display font-bold text-2xl">
                  5yr
                </div>
                <div className="text-sm text-muted-foreground">
                  Warranty on exterior paint
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
