import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  PaintBucket,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type VerifiedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type VerifyResponse = {
  success: boolean;
  data: { user: VerifiedUser; purpose: "invite" | "reset" };
};

type ResetResponse = { success: boolean; message: string };

type VerifyState =
  | { status: "loading" }
  | { status: "valid"; user: VerifiedUser; purpose: "invite" | "reset" }
  | { status: "invalid"; reason: string };

export default function SetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [verify, setVerify] = useState<VerifyState>({ status: "loading" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Set Password — Brushly";
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setVerify({ status: "invalid", reason: "This link is missing a token." });
      return;
    }

    (async () => {
      try {
        const res = await api<VerifyResponse>("/admin/auth/verify-invite", {
          method: "POST",
          auth: false,
          body: { token },
        });
        if (cancelled) return;
        setVerify({
          status: "valid",
          user: res.data.user,
          purpose: res.data.purpose,
        });
      } catch (err) {
        if (cancelled) return;
        setVerify({
          status: "invalid",
          reason:
            err instanceof Error
              ? err.message
              : "This link is invalid or has expired.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api<ResetResponse>("/admin/auth/resetpassword", {
        method: "POST",
        auth: false,
        body: { token, password },
      });
      setDone(true);
      setTimeout(() => navigate("/admin", { replace: true }), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setSubmitting(false);
    }
  };

  const heading =
    verify.status === "valid" && verify.purpose === "reset"
      ? "Reset your password"
      : "Set your password";

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <PaintBucket className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Brush<span className="text-primary">ly</span>
          </span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
          {done ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Password set
              </h1>
              <p className="text-sm text-muted-foreground">
                Redirecting you to sign in…
              </p>
            </div>
          ) : verify.status === "loading" ? (
            <div className="py-8 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Verifying your invitation…</p>
            </div>
          ) : verify.status === "invalid" ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-destructive/15 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Invalid or expired link
              </h1>
              <p className="text-sm text-muted-foreground">{verify.reason}</p>
              <p className="text-sm text-muted-foreground">
                Ask an admin to resend your invite, or request a new password
                reset from the sign-in page.
              </p>
              <Button asChild variant="outline" className="mt-2 rounded-xl">
                <Link to="/admin">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                {heading}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Hi{" "}
                <span className="font-semibold text-foreground">
                  {verify.user.name}
                </span>
                , choose a strong password for{" "}
                <span className="text-foreground">{verify.user.email}</span>.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 pr-10 h-11 rounded-xl"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 h-11 rounded-xl"
                      placeholder="Re-enter password"
                    />
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
                  {submitting ? "Saving..." : "Save password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
