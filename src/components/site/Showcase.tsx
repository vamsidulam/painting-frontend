import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import interiorImg from "@/assets/hero/interior.png";
import kitchenImg from "@/assets/hero/kitchen.png";
import serviceImg from "@/assets/hero/service.png";

type ShowcaseCard = {
  title: string;
  description: string;
  image: string;
  href: string;
};

const CARDS: ShowcaseCard[] = [
  {
    title: "Home Interiors",
    description: "Get home décor advice and interior design solutions.",
    image: interiorImg,
    href: "/services",
  },
  {
    title: "Modular Kitchen",
    description: "Shape your dream kitchen with our diverse collection.",
    image: kitchenImg,
    href: "/services",
  },
  {
    title: "Painting Services",
    description: "Get expert painting with on-time completion guaranteed.",
    image: serviceImg,
    href: "/services",
  },
];

export function Showcase() {
  return (
    <section className="bg-[#0A0A0A] text-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl">
            One-stop shop for all things interiors
          </h2>
          <p className="mt-3 text-white/70 text-sm md:text-base leading-relaxed">
            We provide complete painting service, interior design, renovation,
            and modular solutions for your home, including furniture and decor.
          </p>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 group"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-2">
                  {card.description}
                </p>
                <Link to={card.href} className="inline-block mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors"
                  >
                    Explore now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
