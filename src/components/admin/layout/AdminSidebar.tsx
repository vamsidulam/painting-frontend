import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  ListOrdered,
  PaintBucket,
  LogOut,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: false },
  { to: "/admin/orders", label: "Orders", icon: ListOrdered, end: false },
  { to: "/admin/usermanagement", label: "User Management", icon: Users, end: false },
  { to: "/admin/servicemanagement", label: "Services", icon: Briefcase, end: false },
  { to: "/admin/projectmanagement", label: "Projects", icon: FolderKanban, end: false },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-sidebar text-sidebar-foreground flex-col p-6 h-full">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
          <PaintBucket className="h-5 w-5 text-accent-foreground" />
        </div>
        <span className="font-display font-bold text-xl">
          Brush<span className="text-accent">ly</span>
        </span>
      </Link>

      <nav className="mt-10 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-sidebar-accent/40 border border-sidebar-accent/60">
          <div className="h-10 w-10 shrink-0 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
            {user ? initials(user.name) : <UserIcon className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">
              {user?.name ?? "Guest"}
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email ?? "—"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
