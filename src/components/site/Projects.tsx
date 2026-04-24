import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type PublicProject = {
  id: string;
  name: string;
  image: string;
};

type ListResponse = {
  success: boolean;
  data: { projects: PublicProject[] };
};

export function Projects() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<ListResponse>("/projects", { auth: false })
      .then((res) => {
        if (!cancelled) setProjects(res.data.projects.slice(0, 8));
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Recent projects
            </span>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
              Work we&rsquo;re <span className="text-gradient">proud of</span>.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              A glimpse of our recent transformations.
            </p>
          </div>

          <Link to="/projects" className="shrink-0">
            <Button variant="outline" className="rounded-xl h-10 gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-card/60 border border-border animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted-foreground bg-card border border-border rounded-2xl px-5 py-10">
            No projects to display yet.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative rounded-2xl overflow-hidden shadow-[0_20px_45px_-20px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] transition-shadow duration-300 aspect-square"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted grid place-items-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display font-semibold text-sm text-primary-foreground line-clamp-1">
                    {p.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
