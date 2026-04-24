import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import exteriorImg from "@/assets/exterior.jpg";
import interiorImg from "@/assets/interior.jpg";
import waterImg from "@/assets/water.jpg";

type PaintType = {
  title: string;
  image: string;
};

const TYPES: PaintType[] = [
  { title: "Exterior paints", image: exteriorImg },
  { title: "Interior paints", image: interiorImg },
  { title: "Waterproofing", image: waterImg },
];

export function PaintTypes() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="relative">
          <Link
            to="/booking"
            className="absolute -top-2 right-0 z-10 inline-flex items-center rounded-md bg-amber-400 hover:bg-amber-500 text-foreground text-sm font-semibold px-4 h-8 shadow-md transition-colors"
          >
            Book
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {TYPES.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden bg-card shadow-card"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={t.image}
                    alt={t.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="bg-emerald-100/70 py-5 text-center">
                  <h3 className="font-display font-semibold text-xl md:text-2xl text-foreground">
                    {t.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/booking">
              <Button size="lg" className="rounded-2xl h-11 px-6 font-semibold">
                Book a service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
