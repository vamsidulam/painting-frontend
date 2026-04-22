export function AdminFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border px-4 md:px-8 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>© {year} Brushly. All rights reserved.</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Support
        </a>
      </div>
    </footer>
  );
}
