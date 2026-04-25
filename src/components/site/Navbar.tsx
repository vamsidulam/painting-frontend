import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, PaintBucket } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Reviews", to: "/reviews" },
  { label: "About", to: "/about" },
  { label: "Help", to: "/help" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all glass shadow-lg shadow-primary/10 ring-1 ring-black/5">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-9 w-9 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src="logo.png" className="h-9 w-9 object-contain" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Paint<span className="text-accent">Brush</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-muted/60 border border-border/60 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-background hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link to="/booking">
              <Button className="rounded-xl gradient-accent text-accent-foreground shadow-accent-glow hover:opacity-95 cursor-pointer">
                Book Now
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 shadow-soft animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground/80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/booking" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-xl gradient-accent text-accent-foreground mt-3">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
