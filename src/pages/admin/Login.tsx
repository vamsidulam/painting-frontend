import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, PaintBucket, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, login, isReady } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "PaintBrush";
  }, []);

  useEffect(() => {
    if (isReady && user) navigate("/admin/dashboard", { replace: true });
  }, [isReady, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden bg-sidebar text-sidebar-foreground p-12 flex-col justify-between">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full gradient-accent opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="h-11 w-11 rounded-xl gradient-accent flex items-center justify-center">
            <PaintBucket className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-2xl">
            Brush<span className="text-accent">ly</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar-accent/40 text-xs font-semibold mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Admin Console
          </div>
          <h2 className="font-display font-bold text-4xl leading-tight">
            Run your painting business like a pro.
          </h2>
          <p className="mt-4 text-sidebar-foreground/70">
            Manage bookings, track revenue, and keep your crew moving — all
            from one beautifully simple dashboard.
          </p>
        </div>

        <div className="relative z-10 text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} PaintBrush. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <PaintBucket className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Brush<span className="text-accent">ly</span>
              </span>
            </Link>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your admin account to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@PaintBrush.com"
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
               
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl font-semibold"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Protected admin area. Unauthorized access is prohibited.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
