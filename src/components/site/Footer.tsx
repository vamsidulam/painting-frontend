import { useEffect, useState } from "react";
import { PaintBucket, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

type PublicCategory = {
  id: string;
  name: string;
};

type CategoriesResponse = {
  success: boolean;
  data: { categories: PublicCategory[] };
};

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Reviews", to: "/reviews" },
  { label: "About", to: "/about" },
  { label: "Help", to: "/help" },
];

export function Footer() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    api<CategoriesResponse>("/services/categories", { auth: false })
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <PaintBucket className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-2xl">
                Brush<span className="text-accent-glow">ly</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-primary-foreground/70 leading-relaxed">
              Premium painting services on-demand. Trusted professionals,
              transparent pricing, and finishes that turn heads.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-xl glass-dark flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              {categories.length === 0 ? (
                <li>
                  <Link to="/services" className="hover:text-accent">
                    Browse all
                  </Link>
                </li>
              ) : (
                categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/categories/${c.id}`}
                      className="hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              {quickLinks.map((q) => (
                <li key={q.to}>
                  <Link to={q.to} className="hover:text-accent">
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Brushly. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/help" className="hover:text-accent">
              Privacy
            </Link>
            <Link to="/help" className="hover:text-accent">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
