"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { signInPortalWithPassword } from "@/app/portal/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function authCallbackUrl() {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent("/portal")}`;
}

export function PortalLoginForm() {
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

  function onPasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    clearFeedback();

    startTransition(async () => {
      const result = await signInPortalWithPassword(email, password);
      if (!result.ok) {
        if (result.error === "config") {
          setError("Supabase is not configured.");
        } else if (result.error === "forbidden") {
          setError("No client account matches that email.");
        } else {
          setError(result.message ?? "Invalid email or password.");
        }
        return;
      }
      router.replace("/portal");
      router.refresh();
    });
  }

  function onMagicLink() {
    clearFeedback();
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setError("Supabase is not configured.");
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl(),
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

  return (
    <div className="space-y-6">
      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="portal-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="portal-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="portal-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="portal-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          Sign in
        </Button>
      </form>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={pending || !email.trim()}
        onClick={onMagicLink}
      >
        Email magic link
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
