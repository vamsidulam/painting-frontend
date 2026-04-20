import { PaintBucket, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <PaintBucket className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-2xl">
                Brush<span className="text-accent-glow">ly</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-primary-foreground/70 leading-relaxed">
              Premium painting services on-demand. Trusted professionals, transparent pricing,
              and finishes that turn heads.
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
              <li><Link to="/services" className="hover:text-accent">Interior</Link></li>
              <li><Link to="/services" className="hover:text-accent">Exterior</Link></li>
              <li><Link to="/services" className="hover:text-accent">Commercial</Link></li>
              <li><Link to="/services" className="hover:text-accent">Wall Repair</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/70 text-sm">
              <li><a href="#" className="hover:text-accent">About</a></li>
              <li><a href="#" className="hover:text-accent">Careers</a></li>
              <li><a href="#" className="hover:text-accent">Press</a></li>
              <li><a href="#" className="hover:text-accent">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Brushly. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
