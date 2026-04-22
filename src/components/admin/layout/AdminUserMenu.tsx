import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminUserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground font-semibold text-sm ring-2 ring-accent/30 hover:ring-accent/60 transition"
          aria-label="Profile menu"
        >
          {initials(user.name) || <UserIcon className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="py-3">
          <div className="font-semibold text-sm text-foreground truncate">
            {user.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <UserIcon className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
