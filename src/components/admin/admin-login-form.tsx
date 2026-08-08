"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { signInAdminWithPassword } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function authCallbackUrl(nextPath: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function clearFeedback() {
    setMessage(null);
    setError(null);
  }

  function withSupabase(
    run: (
      supabase: NonNullable<ReturnType<typeof createBrowserSupabaseClient>>,
    ) => Promise<void>,
  ) {
    clearFeedback();
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setError("Supabase is not configured.");
        return;
      }
      await run(supabase);
    });
  }

  function onPasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearFeedback();

    startTransition(async () => {
      const result = await signInAdminWithPassword(email, password);

      if (!result.ok) {
        if (result.error === "config") {
          setError("Supabase is not configured.");
        } else if (result.error === "forbidden") {
          setError("That email is not on the admin allowlist.");
        } else {
          setError(result.message ?? "Invalid email or password.");
        }
        return;
      }

      router.replace(nextPath);
      router.refresh();
    });
  }

  function onMagicLink() {
    withSupabase(async (supabase) => {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl(nextPath),
          shouldCreateUser: true,
        },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setMessage("Check your email for the magic link.");
    });
  }

  function onGoogle() {
    withSupabase(async (supabase) => {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authCallbackUrl(nextPath),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@nothing.digital"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={pending}
          onClick={onGoogle}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={pending || !email.trim()}
          onClick={onMagicLink}
        >
          Email me a magic link
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
