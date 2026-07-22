"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CarProfile = {
  carModel: string;
  carColor: string;
  plateNumber: string;
};

type ActiveLock = "none" | "leaver" | "looker";

export default function ModePage() {
  const [profile, setProfile] = useState<CarProfile | null>(null);
  const [activeLock, setActiveLock] = useState<ActiveLock>("none");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAndMode();
  }, []);

  async function checkUserAndMode() {
    setIsLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const savedProfileText = localStorage.getItem("park_habibi_profile");
    const savedProfile: CarProfile | null = savedProfileText
      ? JSON.parse(savedProfileText)
      : null;

    if (!savedProfile) {
      setProfile(null);
      setActiveLock("none");
      setIsLoading(false);
      return;
    }

    setProfile(savedProfile);

    const activeStatuses = [
      "available",
      "reserved",
      "arrived",
      "spotted",
      "leaving",
    ];

    const { data: leaverSpots, error: leaverError } = await supabase
      .from("parking_spots")
      .select("id")
      .eq("leaver_car_model", savedProfile.carModel)
      .eq("leaver_plate_number", savedProfile.plateNumber)
      .in("status", activeStatuses)
      .limit(1);

    if (leaverError) {
      alert("Could not check leaver handovers: " + leaverError.message);
      setIsLoading(false);
      return;
    }

    if (leaverSpots && leaverSpots.length > 0) {
      localStorage.setItem("park_habibi_active_mode", "leaver");
      setActiveLock("leaver");
      setIsLoading(false);
      return;
    }

    const { data: lookerSpots, error: lookerError } = await supabase
      .from("parking_spots")
      .select("id")
      .eq("looker_car_model", savedProfile.carModel)
      .eq("looker_plate_number", savedProfile.plateNumber)
      .in("status", activeStatuses)
      .limit(1);

    if (lookerError) {
      alert("Could not check looker handovers: " + lookerError.message);
      setIsLoading(false);
      return;
    }

    if (lookerSpots && lookerSpots.length > 0) {
      localStorage.setItem("park_habibi_active_mode", "looker");
      setActiveLock("looker");
      setIsLoading(false);
      return;
    }

    localStorage.removeItem("park_habibi_active_mode");
    setActiveLock("none");
    setIsLoading(false);
  }

  function chooseMode(mode: "leaver" | "looker") {
    localStorage.setItem("park_habibi_active_mode", mode);

    if (mode === "leaver") {
      window.location.href = "/leaving";
      return;
    }

    window.location.href = "/looking";
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("park_habibi_active_mode");
    window.location.href = "/";
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

          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </header>

        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Choose mode
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              What are you doing
              <span className="block text-emerald-400">right now?</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              You can switch between looking and leaving, but only after your
              current handover is completed or cancelled.
            </p>
          </div>

          {isLoading && (
            <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-400">
              Checking your active handovers...
            </div>
          )}

          {!isLoading && !profile && (
            <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6 text-center">
              <p className="text-lg font-black text-amber-300">
                Car details needed
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-100/70">
                Before choosing a mode, add your car model, color, and plate
                number from either the Leaving or Looking page.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="/leaving"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Add as Leaver
                </a>

                <a
                  href="/looking"
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-400"
                >
                  Add as Looker
                </a>
              </div>
            </div>
          )}

          {!isLoading && profile && activeLock === "leaver" && (
            <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <p className="text-lg font-black text-emerald-300">
                You have an active leaving handover
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                Complete or cancel your posted handover before switching to
                looking mode.
              </p>

              <a
                href="/leaving"
                className="mt-5 inline-block rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Continue Leaving
              </a>
            </div>
          )}

          {!isLoading && profile && activeLock === "looker" && (
            <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <p className="text-lg font-black text-emerald-300">
                You have an active looking handover
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                Complete or cancel your current reservation before switching to
                leaving mode.
              </p>

              <a
                href="/looking"
                className="mt-5 inline-block rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Continue Looking
              </a>
            </div>
          )}

          {!isLoading && profile && activeLock === "none" && (
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseMode("leaver")}
                className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-7 text-left shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-emerald-500/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                  🚗
                </div>
                <h2 className="mt-6 text-2xl font-black">I&apos;m Leaving</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Post your spot, wait for someone to reserve it, confirm when
                  they arrive, then move out safely.
                </p>
              </button>

              <button
                type="button"
                onClick={() => chooseMode("looker")}
                className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-7 text-left shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-emerald-500/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                  🔎
                </div>
                <h2 className="mt-6 text-2xl font-black">I&apos;m Looking</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Reserve a nearby handover first. Exact spot and car details
                  unlock only after reservation.
                </p>
              </button>
            </div>
          )}
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