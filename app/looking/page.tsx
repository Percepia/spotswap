"use client";

import { useEffect, useState } from "react";

type ParkingSpot = {
  id: number;
  area: string;
  landmark: string;
  leavingIn: string;
  note: string;
  location: string;
  createdAt: string;
};

export default function LookingPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [reservedSpotId, setReservedSpotId] = useState<number | null>(null);

  useEffect(() => {
    const savedSpotsText = localStorage.getItem("park_habibi_spots");
    const savedSpots: ParkingSpot[] = savedSpotsText
      ? JSON.parse(savedSpotsText)
      : [];

    setSpots(savedSpots);
  }, []);

  function clearTestSpots() {
    localStorage.removeItem("park_habibi_spots");
    setSpots([]);
    setReservedSpotId(null);
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

        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-8 lg:px-10">
          <div className="animate-fade-up">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Want to park?
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              Find a spot before
              <span className="block text-emerald-400">it&apos;s gone.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-slate-200">
              Someone&apos;s leaving. You&apos;re arriving. Coordinate a smooth
              parking handover nearby.
            </p>
          </div>

          {reservedSpotId && (
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              Spot reserved. Head to the location and wait for the driver to
              move out.
            </div>
          )}

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="animate-fade-up rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Live area
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Shabia map</h2>
                </div>

                <button
                  onClick={clearTestSpots}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
                >
                  Clear test spots
                </button>
              </div>

              <div className="relative mt-6 min-h-[430px] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute left-[-80px] top-[-80px] h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-[-80px] right-[-80px] h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative flex min-h-[380px] items-center justify-center text-center">
                  <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 text-4xl">
                      🗺️
                    </div>
                    <h2 className="mt-5 text-2xl font-black">
                      Live map coming soon
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                      This area will show real parking handovers around Shabia
                      once we connect the database and map.
                    </p>

                    <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left">
                      <p className="text-sm font-semibold text-slate-300">
                        MVP status
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Posted spots currently save inside your browser. Next
                        step is a real backend so everyone can see the same live
                        spots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-up-delayed space-y-4">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                      Nearby handovers
                    </p>
                    <h2 className="mt-2 text-xl font-black">
                      Available spots
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                    {spots.length}
                  </div>
                </div>
              </div>

              {spots.length === 0 && (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-4xl">
                    🅿️
                  </div>
                  <h2 className="mt-5 text-xl font-black">No spots yet</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    No one is leaving right now. Share a test spot first.
                  </p>

                  <a
                    href="/leaving"
                    className="mt-5 inline-block rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    Share a test spot
                  </a>
                </div>
              )}

              {spots.map((spot) => {
                const isReserved = reservedSpotId === spot.id;

                return (
                  <div
                    key={spot.id}
                    className={`rounded-[2rem] border p-5 shadow-2xl shadow-black/20 transition ${
                      isReserved
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900/70 hover:-translate-y-1 hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black">{spot.area}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {spot.landmark}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                        {spot.leavingIn}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-slate-950 p-3">
                        <p className="text-slate-500">Location</p>
                        <p className="mt-1 font-semibold">{spot.location}</p>
                      </div>

                      <div className="rounded-2xl bg-slate-950 p-3">
                        <p className="text-slate-500">Status</p>
                        <p className="mt-1 font-semibold">Available now</p>
                      </div>
                    </div>

                    {spot.note && (
                      <div className="mt-3 rounded-2xl bg-slate-950 p-3 text-sm">
                        <p className="text-slate-500">Note</p>
                        <p className="mt-1 text-slate-300">{spot.note}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setReservedSpotId(spot.id)}
                      disabled={isReserved}
                      className={`mt-4 w-full rounded-2xl px-4 py-3 font-bold transition ${
                        isReserved
                          ? "cursor-not-allowed bg-slate-800 text-slate-500"
                          : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                      }`}
                    >
                      {isReserved ? "Reserved" : "Reserve handover"}
                    </button>
                  </div>
                );
              })}

              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
                <p className="text-sm font-bold text-amber-300">
                  Safety and parking rules
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-100/70">
                  Park Habibi only helps drivers coordinate timing and
                  communication. Users are not buying, selling, or owning public
                  parking spaces. Always follow local parking rules and drive
                  safely.
                </p>
              </div>
            </div>
          </section>
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