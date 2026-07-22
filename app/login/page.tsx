"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signUp() {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
    emailRedirectTo: `${window.location.origin}/profile`,
  },
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created. If Supabase asks for confirmation, check your email. Otherwise, click Login."
    );
  }

  async function signIn() {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate min-h-screen">
        <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[160px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              P
            </div>

            <div>
              <p className="text-lg font-bold leading-none">Park Habibi</p>
              <p className="mt-1 text-xs text-slate-500">
                Live parking handovers
              </p>
            </div>
          </a>

          <a
            href="/"
            className="rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            Home
          </a>
        </header>

        <section className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="animate-fade-up">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Driver login
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Enter as a
              <span className="block text-emerald-400">driver.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Login keeps handovers safer. Only the leaver can control their
              posted spot, and only the reserved looker can confirm arrival.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm font-bold text-slate-300">
                Privacy-first identity
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No public names. No profile pictures. Your account protects the
                handover flow. Your car details are used only for identification
                during a confirmed handover.
              </p>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
              <p className="text-sm font-bold text-amber-300">MVP note</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/70">
                We are using email login for now because mobile OTP requires
                paid SMS provider setup. Phone login can be added later.
              </p>
            </div>
          </div>

          <div className="animate-fade-up-delayed rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Account
              </p>
              <h2 className="mt-2 text-2xl font-black">Login or sign up</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create an account with email and password.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>

              {message && (
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={signIn}
                disabled={isLoading}
                className={`w-full rounded-2xl px-6 py-4 font-bold transition ${
                  isLoading
                    ? "cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                }`}
              >
                {isLoading ? "Working..." : "Login"}
              </button>

              <button
                type="button"
                onClick={signUp}
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-400"
              >
                Create account
              </button>
            </div>
          </div>
        </section>

        <footer className="relative mx-auto max-w-6xl border-t border-slate-800 px-6 py-8 text-sm text-slate-500 lg:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-slate-300">Park Habibi</p>
            <p>No more circling, habibi. Starting in Shabia, Abu Dhabi.</p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Created with love by{" "}
            <span className="font-semibold text-slate-400">Torque</span>{" "}
            <span className="text-red-500">❤️</span>
          </p>
        </footer>
      </div>
    </main>
  );
}