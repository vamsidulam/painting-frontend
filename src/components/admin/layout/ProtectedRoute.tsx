import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
