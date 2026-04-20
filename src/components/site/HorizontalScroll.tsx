import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const items = [
  { img: project1, title: "Sage Bedroom", tag: "Interior" },
  { img: project2, title: "Vibrant Office", tag: "Commercial" },
  { img: project3, title: "Navy Kitchen", tag: "Interior" },
  { img: project4, title: "Mediterranean Villa", tag: "Exterior" },
  { img: hero1, title: "Deep Blue Lounge", tag: "Interior" },
  { img: hero2, title: "Modern Facade", tag: "Exterior" },
];

export function HorizontalScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-primary">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-12 left-0 right-0 text-center z-10 px-4">
          <span className="text-accent-glow font-semibold text-sm uppercase tracking-wider">
            Our work
          </span>
          <h2 className="mt-2 font-display font-bold text-4xl md:text-5xl text-primary-foreground">
            Transformations that <span className="text-accent-glow">speak</span>.
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-[10vw]">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative h-[60vh] w-[80vw] md:w-[45vw] lg:w-[35vw] rounded-3xl overflow-hidden shrink-0 group shadow-glow"
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 rounded-full glass-dark text-primary-foreground text-xs font-medium">
                  {item.tag}
                </span>
                <h3 className="mt-3 font-display font-bold text-2xl md:text-3xl text-primary-foreground">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
