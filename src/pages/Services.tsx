import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Wrench, Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Services } from "@/components/site/Services";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    desc: "Transform any room with premium low-VOC paints and a flawless finish.",
    price: "From $299",
    features: ["Color consultation", "Furniture protection", "2-coat application", "Cleanup included"],
    color: "from-primary to-primary-glow",
  },
  {
    icon: Building2,
    title: "Exterior Painting",
    desc: "Weather-resistant finishes that protect and beautify for years.",
    price: "From $899",
    features: ["Power wash & prep", "Premium exterior paint", "Trim & detail work", "5-year warranty"],
    color: "from-accent to-accent-glow",
  },
  {
    icon: Briefcase,
    title: "Commercial Painting",
    desc: "Offices, retail and industrial spaces — minimal downtime, maximum impact.",
    price: "Custom quote",
    features: ["After-hours work", "Brand color matching", "Large team capacity", "Insurance covered"],
    color: "from-primary-glow to-accent",
  },
  {
    icon: Wrench,
    title: "Wall Repair",
    desc: "Patch, sand, and prime damaged walls so your new paint looks perfect.",
    price: "From $99",
    features: ["Crack & hole repair", "Drywall patching", "Sanding & priming", "Texture matching"],
    color: "from-accent-glow to-primary",
  },
];

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Services — Brushly";
  }, []);

  return (
    <main>
      <Navbar />
      {/* <section className="pt-36 pb-20 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Services</span>
            <h1 className="mt-3 font-display font-bold text-5xl md:text-6xl text-foreground">
              Painting done <span className="text-gradient">right</span>.
            </h1>
             <p className="mt-5 text-lg text-muted-foreground">
              Every service includes vetted professionals, premium paints, and a satisfaction guarantee.
            </p> 
          </motion.div>
        </div>
      </section> */}

      {/* <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-card hover:shadow-glow transition-all border border-border group"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-7 w-7 text-white" />
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <h3 className="font-display font-bold text-2xl text-foreground">{s.title}</h3>
                  <span className="text-accent font-semibold">{s.price}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <ul className="mt-6 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-5 w-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/booking">
                  <Button className="mt-8 w-full rounded-xl gradient-primary text-primary-foreground shadow-glow">
                    Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

<Services/>
      
      <Footer />
    </main>
  );
}
