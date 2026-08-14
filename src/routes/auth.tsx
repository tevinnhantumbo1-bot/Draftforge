import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Ruler, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletAuthButtons } from "@/components/wallet-auth";
import { signUpWithEmail, signInWithEmail } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DraftForge AI" },
      {
        name: "description",
        content:
          "Sign in to submit AutoCAD design requests and track previews with MongoDB backend.",
      },
      { property: "og:title", content: "Sign in — DraftForge AI" },
      {
        property: "og:description",
        content: "Access your DraftForge design requests and previews.",
      },
    ],
  }),
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: AuthPage,
});

function safePath(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/workspace";
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const signUpFn = useServerFn(signUpWithEmail);
  const signInFn = useServerFn(signInWithEmail);

  useEffect(() => {
    // Check if user is already authenticated via MongoDB session token or wallet
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("df_auth_token");
      const walletUser = localStorage.getItem("df_wallet_user");
      if (token || walletUser) {
        navigate({ to: safePath(redirect) });
      }
    }
  }, [navigate, redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await signUpFn({
          data: {
            email,
            password,
            name: name || undefined,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          },
        });

        if (res?.token) {
          localStorage.setItem("df_auth_token", res.token);
          localStorage.setItem("df_auth_user", JSON.stringify(res.user));
          toast.success("Account created successfully!");
          navigate({ to: safePath(redirect) });
        }
      } else {
        const res = await signInFn({
          data: {
            email,
            password,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          },
        });

        if (res?.token) {
          localStorage.setItem("df_auth_token", res.token);
          localStorage.setItem("df_auth_user", JSON.stringify(res.user));
          toast.success("Signed in successfully!");
          navigate({ to: safePath(redirect) });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid-paper flex min-h-screen items-center justify-center px-5 py-16">
      <div className="panel w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-sm bg-[image:var(--gradient-amber)] text-primary-foreground">
            <Ruler className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">DraftForge</span>
        </Link>

        <h1 className="mt-8 text-2xl font-semibold">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connected to secure MongoDB database cluster.
        </p>

        <div className="mt-6">
          <WalletAuthButtons
            redirectTo={safePath(redirect)}
            layout="stack"
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="tech-label text-muted-foreground">or email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                maxLength={100}
                placeholder="Alex Morgan"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              minLength={6}
              maxLength={72}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            variant="hero"
            className="w-full"
            disabled={busy}
            type="submit"
          >
            {busy
              ? "Authenticating…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="size-3.5" />
            MongoDB Auth Active
          </span>
          <button
            type="button"
            className="hover:text-foreground underline underline-offset-2"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "No account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

