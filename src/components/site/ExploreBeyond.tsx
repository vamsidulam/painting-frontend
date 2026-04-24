import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Panel = {
  title: string;
  to: string;
  images: string[];
};

const panels: Panel[] = [
  {
    title: "Textures",
    to: "/services",
    images: ["/ss1.jpg", "/ss2.jpg", "/ss3.jpg"],
  },
  {
    title: "Wallpapers",
    to: "/services",
    images: ["/ss3.jpg", "/ss4.jpg", "/ss5.jpg"],
  },
];

export function ExploreBeyond() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground"
        >
          Explore beyond colours
        </motion.h2>

        <div className="mt-12 md:mt-16 grid lg:grid-cols-2 gap-8 lg:gap-10">
          {panels.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-5 gap-3 items-stretch"
            >
              <div className="col-span-2 flex flex-col justify-center pr-2">
                <h3 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight">
                  {p.title}
                </h3>
                <Link to={p.to} className="mt-5 inline-flex w-fit">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-foreground/70 text-foreground text-sm font-medium transition-all hover:bg-foreground hover:text-background group">
                    View all
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              <div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-3 h-[360px] md:h-[420px]">
                <Link
                  to={p.to}
                  className="row-span-2 overflow-hidden rounded-2xl group relative"
                >
                  <img
                    src={p.images[0]}
                    alt={`${p.title} sample 1`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <Link
                  to={p.to}
                  className="overflow-hidden rounded-2xl group relative"
                >
                  <img
                    src={p.images[1]}
                    alt={`${p.title} sample 2`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <Link
                  to={p.to}
                  className="overflow-hidden rounded-2xl group relative"
                >
                  <img
                    src={p.images[2]}
                    alt={`${p.title} sample 3`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
