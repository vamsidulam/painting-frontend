import { useState } from "react";
import { motion } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero3 from "@/assets/hero-3.jpg";

const projects = [
  { before: hero3, after: project1, title: "Bedroom Makeover", category: "Interior" },
  { before: hero3, after: project2, title: "Office Refresh", category: "Commercial" },
  { before: hero3, after: project3, title: "Kitchen Cabinets", category: "Interior" },
  { before: hero3, after: project4, title: "Villa Exterior", category: "Exterior" },
  { before: hero3, after: hero1, title: "Living Room", category: "Interior" },
  { before: hero3, after: project1, title: "Master Suite", category: "Interior" },
];

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-500 cursor-pointer aspect-[4/5]"
      onMouseEnter={() => setShowAfter(false)}
      onMouseLeave={() => setShowAfter(true)}
    >
      <img
        src={showAfter ? project.after : project.before}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent" />

      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <span className="px-3 py-1 rounded-full glass-dark text-primary-foreground text-xs font-medium">
          {project.category}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            showAfter ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
          }`}
        >
          {showAfter ? "AFTER" : "BEFORE"}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display font-bold text-xl text-primary-foreground">{project.title}</h3>
        <p className="text-sm text-primary-foreground/70 mt-1">Hover to see before</p>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Recent projects
          </span>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Before & after, <span className="text-gradient">in one click</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Hover any card to see the transformation.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
