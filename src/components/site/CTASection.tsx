import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden gradient-hero p-10 md:p-16 text-center shadow-glow"
        >
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white 0, transparent 50%), radial-gradient(circle at 80% 70%, white 0, transparent 50%)"
          }} />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-foreground">
              Ready to transform your space?
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg">
              Get a free instant quote in under 60 seconds.
            </p>
            <Link to="/booking">
              <Button
                size="lg"
                className="mt-8 rounded-2xl bg-white text-primary hover:bg-white/90 h-14 px-8 text-base font-semibold hover:scale-105 transition-transform"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
