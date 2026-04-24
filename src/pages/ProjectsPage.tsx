import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Projects — Brushly";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api<ListResponse>("/projects", { auth: false })
      .then((res) => {
        if (!cancelled) setProjects(res.data.projects);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load projects",
          );
          setProjects([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <Navbar />

      <section className="pt-28 md:pt-36 pb-10 md:pb-14">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Our Projects
            </span>
            <h1 className="mt-3 font-display font-extrabold text-4xl md:text-5xl text-foreground">
              Work we're <span className="text-gradient">proud of.</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Recent transformations across homes, offices, and exteriors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-card/60 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-5 py-4 text-center">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-card border border-border rounded-2xl px-5 py-10 text-center">
              No projects to display yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer aspect-square"
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

          <div className="mt-14 text-center">
            <Link to="/booking">
              <Button size="lg" className="rounded-2xl h-11 px-6">
                Start your project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
