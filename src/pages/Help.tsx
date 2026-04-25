import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

type Faq = { q: string; a: string };

const faqs: Faq[] = [
  {
    q: "How do I book a painting service?",
    a: "Pick a category on the Services page, choose a service that fits your space, and tap Book Now. Fill in your property details and contact info — we'll confirm a painter and a start date within a few hours.",
  },
  {
    q: "How are prices calculated?",
    a: "We quote by square footage and service type. Every price you see includes paint, prep, and cleanup unless stated otherwise. You can see your full breakdown on the Summary step before paying.",
  },
  {
    q: "Can I reschedule after booking?",
    a: "Yes. Email or call us at least 24 hours before your scheduled start and we'll move things around at no charge. Late changes may incur a small fee depending on the painter's availability.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Interior finishes are covered for 2 years against peeling and blistering. Exterior paint carries a 5-year warranty. If something isn't right, we'll come back and fix it — no questions asked.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, major cards, and net banking. You'll upload a payment screenshot at the end of the booking flow and we'll confirm your slot once payment is verified.",
  },
  {
    q: "Are your painters vetted?",
    a: "Every painter on PaintBrush passes a background check, a craftsmanship test, and carries insurance. We only partner with teams that meet our standards.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Help & Support — PaintBrush";
  }, []);

  return (
    <main>
      <Navbar />

      <section className="pt-28 md:pt-36 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Help Center
            </span>
            <h1 className="mt-3 font-display font-extrabold text-4xl md:text-5xl text-foreground">
              How can we <span className="text-gradient">help you?</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Answers to common questions, plus the quickest ways to reach a
              human on our team.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-5">
            <a
              href="tel:+919999999999"
              className="group bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-bold text-lg">
                Call Support
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                +91 7899615463 · Mon–Sun, 9am–9pm
              </p>
            </a>
            <a
              href="alamjmhir91@gmail.com"
              className="group bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-bold text-lg">
                Email us
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                alamjmhir91@gmail.com · 24-hour response
              </p>
            </a>
            
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl text-foreground">
              Quick answers
            </h2>
          </div>

          <div className="mt-10 max-w-3xl space-y-3">
            {faqs.map((f, i) => {
              const open = openIndex === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-foreground">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-10 shadow-card text-center"
          >
            <div className="inline-flex h-12 w-12 rounded-2xl bg-accent/10 text-accent items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display font-bold text-2xl md:text-3xl">
              Still stuck?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Our support team is one message away. We usually respond in under
              an hour during working hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <a href="mailto:hello@PaintBrush.app">
                <Button className="rounded-2xl h-11 px-6">Email us</Button>
              </a>
              <Link to="/booking">
                <Button variant="outline" className="rounded-2xl h-11 px-6">
                  Start a booking
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
