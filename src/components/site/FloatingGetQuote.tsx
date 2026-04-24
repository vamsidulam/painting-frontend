import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export function FloatingGetQuote() {
  return (
    <Link
      to="/booking"
      aria-label="Get a free quote"
      className="fixed bottom-5 right-24 z-50 inline-flex items-center gap-2 h-14 pl-4 pr-5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-300"
    >
      <FileText className="h-5 w-5" />
      Get a quote
    </Link>
  );
}
