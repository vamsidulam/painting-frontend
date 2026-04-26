import { useEffect, useState } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

type PublicService = {
  id: string;
  name: string;
  cost: number;
  description: string;
  image: string;
  workType: "fresh" | "repainting";
  category: string;
  categoryId: string;
  categoryName: string;
  categoryIncludesMoney?: boolean;
};

type ServicesResponse = {
  success: boolean;
  data: { services: PublicService[] };
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
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    let cancelled = false;
    api<ServicesResponse>("/services", { auth: false })
      .then((res) => {
        if (!cancelled) setServices(res.data.services);
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <img
                src="/logo.png"
                alt="PaintBrush logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="font-display font-bold text-2xl">
                PaintBrush
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

          <div className="md:col-span-6">
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="columns-2 sm:columns-3 lg:columns-4 gap-x-6 text-primary-foreground/70 text-sm [&>li]:mb-2 [&>li]:break-inside-avoid">
              {services.length === 0 ? (
                <li>
                  <Link to="/services">Browse all</Link>
                </li>
              ) : (
                services.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/booking"
                      state={{
                        prefill: {
                          category: {
                            id: s.categoryId,
                            name: s.categoryName,
                            description: "",
                            image: "",
                            includesMoney: s.categoryIncludesMoney ?? true,
                          },
                          workType: s.workType,
                          service: {
                            id: s.id,
                            name: s.name,
                            cost: s.cost,
                            description: s.description,
                            image: s.image,
                            workType: s.workType,
                            categoryId: s.categoryId,
                            categoryName: s.categoryName,
                            categoryIncludesMoney:
                              s.categoryIncludesMoney ?? true,
                          },
                        },
                      }}
                      className="block truncate"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              {quickLinks.map((q) => (
                <li key={q.to}>
                  <Link to={q.to}>{q.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} PaintBrush. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/help">Privacy</Link>
            <Link to="/help">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
