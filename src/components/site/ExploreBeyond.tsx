import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import s1 from "@/assets/beyond/s1.png";
import s2 from "@/assets/beyond/s2.png";
import s3 from "@/assets/beyond/s3.png";
import s4 from "@/assets/beyond/s4.png";
import s5 from "@/assets/beyond/s5.png";
import s6 from "@/assets/beyond/s6.png";
import s7 from "@/assets/beyond/s7.png";
import s8 from "@/assets/beyond/s8.png";
import s9 from "@/assets/beyond/s9.png";
import s10 from "@/assets/beyond/s10.png";
import s11 from "@/assets/beyond/s11.png";
import s12 from "@/assets/beyond/s12.png";
import s13 from "@/assets/beyond/s13.png";
import s14 from "@/assets/beyond/s14.png";
import s15 from "@/assets/beyond/s15.png";

type Panel = {
  title: string;
  to: string;
  images: string[];
};

const panels: Panel[] = [
  {
    title: "Textures",
    to: "/services",
    images: [s1, s2, s3],
  },
  {
    title: "Wallpapers",
    to: "/services",
    images: [s4, s5, s6],
  },
  {
    title: "Stencils",
    to: "/services",
    images: [s13, s14, s15],
  },
  {
    title: "Polish",
    to: "/services",
    images: [s10, s11, s12],
  },
  {
    title: "Duco Painting",
    to: "/services",
    images: [s7, s8, s9],
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

        <div className="mt-12 md:mt-16 grid lg:grid-cols-2 gap-10 lg:gap-10">
          {panels.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-3 lg:items-stretch"
            >
              <div className="lg:col-span-2 flex flex-col justify-center lg:pr-2">
                <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                  {p.title}
                </h3>
                <Link to={p.to} className="mt-4 lg:mt-5 inline-flex w-fit">
                  <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-foreground/70 text-foreground text-sm font-medium transition-all hover:bg-foreground hover:text-background group">
                    View all
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              <div className="lg:col-span-3 grid grid-cols-2 grid-rows-2 gap-3 h-80 md:h-100 lg:h-105">
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
