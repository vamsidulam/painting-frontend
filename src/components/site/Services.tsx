import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Wrench, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    desc: "Living rooms, bedrooms, kitchens — flawless finishes inside your home.",
    price: "from $299",
    color: "from-primary to-primary-glow",
  },
  {
    icon: Building2,
    title: "Exterior Painting",
    desc: "Weather-proof, long-lasting paint jobs that boost your curb appeal.",
    price: "from $899",
    color: "from-accent to-accent-glow",
  },
  {
    icon: Briefcase,
    title: "Commercial",
    desc: "Offices, retail and large-scale projects with minimal downtime.",
    price: "Custom quote",
    color: "from-primary-glow to-accent",
  },
  {
    icon: Wrench,
    title: "Wall Repair",
    desc: "Cracks, holes, dents — patched, sanded and primed before painting.",
    price: "from $99",
    color: "from-accent-glow to-primary",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Everything your walls need,
            <br />
            <span className="text-gradient">in one place.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From a single accent wall to a full home makeover — handled by vetted pros.
          </p>
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card rounded-3xl p-7 shadow-card hover:shadow-glow transition-all duration-500 border border-border overflow-hidden"
            >
              <div
                className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-30 transition-opacity blur-2xl`}
              />
              <div
                className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
              >
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-6 font-display font-bold text-xl text-foreground">{s.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-accent font-semibold text-sm">{s.price}</span>
                <Link
                  to="/booking"
                  className="h-9 w-9 rounded-full bg-muted group-hover:bg-accent group-hover:text-accent-foreground flex items-center justify-center transition-all"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
