import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, PaintBucket } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {label:"Home",to:'/'},
  { label: "Services", to: "/services" },
  // { label: "How it Works", to: "/#how" },
  // { label: "Projects", to: "/#projects" },
  // { label: "Dashboard", to: "/dashboard" },
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
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all glass shadow-lg shadow-primary/10 ring-1 ring-black/5`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <PaintBucket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Brush<span className="text-accent">ly</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* <Link to="/booking">
              <Button variant="ghost" className="rounded-xl">Get Quote</Button>
            </Link> */}
            <Link to="/booking">
              <Button style={{cursor:'pointer'}} className="  rounded-xl gradient-accent text-accent-foreground shadow-accent-glow hover:opacity-95">
                Book Now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 shadow-soft animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-muted text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
              <Link to="/booking" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-xl gradient-accent text-accent-foreground mt-2">
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
