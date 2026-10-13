
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShoppingCart,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Registration will be connected after we confirm the users API schema.
      const response = await fetch("http://127.0.0.1:8000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        setError(
          response.status === 409
            ? "An account with these details may already exist."
            : `Account creation failed (${response.status}). The registration API may require different fields.`,
        );
        console.error("Registration response:", details);
        return;
      }

      window.location.href = "/login";
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
            Join the community
          </p>
          <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">
            Shopping made simple.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Create your IndKart account to discover new favourites and make
            everyday shopping easier.
          </p>
        </div>

        <p className="text-sm text-white/50">
          Everything India Shops. © 2026 IndKart
        </p>
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full border-[60px] border-[#4338CA]/30" />
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">
            <ArrowLeft size={17} />
            Back to shopping
          </Link>

          <Link href="/" className="mb-7 flex w-fit items-center gap-2 text-xl font-extrabold lg:hidden">
            <span className="rounded-lg bg-[var(--primary)] p-2 text-white">
              <ShoppingCart size={22} />
            </span>
            Ind<span className="-ml-2 text-[var(--primary)]">Kart</span>
          </Link>

          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            Get started
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            Join IndKart and discover your next favourite find.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                Full name
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <UserRound size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <Mail size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                Mobile number <span className="font-normal text-[var(--text-tertiary)]">(optional)</span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <Phone size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="10-digit mobile number"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15">
                <LockKeyhole size={19} className="shrink-0 text-[var(--text-tertiary)]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
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

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[var(--text-tertiary)]">
            <ShieldCheck size={16} />
            Your details are used to create your account.
          </div>

          <p className="mt-7 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
