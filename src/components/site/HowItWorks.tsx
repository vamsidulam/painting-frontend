import { motion } from "framer-motion";
import { MousePointerClick, Calculator, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    num: "01",
    title: "Select Service",
    desc: "Choose interior, exterior or commercial — pick the room or surface.",
  },
  {
    icon: Calculator,
    num: "02",
    title: "Get Instant Quote",
    desc: "Transparent pricing in seconds. No hidden fees, ever.",
  },
  {
    icon: CalendarCheck,
    num: "03",
    title: "Book & Relax",
    desc: "Pick a date — our pros show up on time and leave it spotless.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            How it works
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Three steps. <span className="text-gradient">Zero hassle.</span>
          </h2>
        </motion.div>

        <div className="mt-20 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

          <div className="grid md:grid-cols-3 gap-10 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="relative h-24 w-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-3 -right-3 h-10 w-10 rounded-full gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-accent-glow">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-8 font-display font-bold text-2xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
