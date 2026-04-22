import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminUserMenu } from "./AdminUserMenu";

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-20 glass border-b border-border px-4 md:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
         
        </div>
      </div>
      <div className="flex items-center gap-3">
        
        <AdminUserMenu />
      </div>
    </header>
  );
}
