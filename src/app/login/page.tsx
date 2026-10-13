
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShoppingCart,
  Mail,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Connect this form to the FastAPI login endpoint next.
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        setError("Login failed. Check your details or the API request format.");
        return;
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("indkart-token", data.access_token);
        window.location.href = "/";
      } else {
        setError("The server did not return an access token.");
      }
    } catch {
      setError("Unable to connect to the server. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[var(--background)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#111426] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Link href="/" className="flex w-fit items-center gap-3 text-2xl font-extrabold">
          <span className="rounded-xl bg-[#4338CA] p-2">
            <ShoppingCart size={27} />
          </span>
          Ind<span className="-ml-3 text-[#FF9933]">Kart</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#FF9933]">
            Welcome back
          </p>
          <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">
            Your next favourite find is waiting.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Sign in to explore everyday essentials, discover great finds and
            continue your shopping journey with IndKart.
          </p>
        </div>

        <p className="text-sm text-white/50">
          Everything India Shops. © 2026 IndKart
        </p>
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full border-[60px] border-[#4338CA]/30" />
        <div className="pointer-events-none absolute right-12 top-1/3 h-40 w-40 rounded-full bg-[#FF9933]/10 blur-3xl" />
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">
            <ArrowLeft size={17} />
            Back to shopping
          </Link>

          <Link href="/" className="mb-8 flex w-fit items-center gap-2 text-xl font-extrabold lg:hidden">
            <span className="rounded-lg bg-[var(--primary)] p-2 text-white">
              <ShoppingCart size={22} />
            </span>
            Ind<span className="-ml-2 text-[var(--primary)]">Kart</span>
          </Link>

          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            Your account
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            Enter your details to sign in to your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <Mail size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <LockKeyhole size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to IndKart"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-tertiary)]">
            <ShieldCheck size={16} />
            Your account details should always remain secure.
          </div>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            New to IndKart?{" "}
            <Link href="/signup" className="font-bold text-[var(--primary)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
