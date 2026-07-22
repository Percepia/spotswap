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
    const savedSpotsText = localStorage.getItem("spotswap_spots");
    const savedSpots: ParkingSpot[] = savedSpotsText
      ? JSON.parse(savedSpotsText)
      : [];

    setSpots(savedSpots);
  }, []);

  function clearTestSpots() {
    localStorage.removeItem("spotswap_spots");
    setSpots([]);
    setReservedSpotId(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-slate-400 hover:text-white">
          ← Back to home
        </a>

        <section className="mt-10">
          <p className="text-sm font-medium text-emerald-400">
            I&apos;m looking
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Find a spot opening near you
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            See nearby drivers who are about to leave and coordinate a parking
            handover.
          </p>
        </section>

        {reservedSpotId && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            Spot reserved. Drive to the location and wait for the driver to
            leave.
          </div>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <div>
              <p className="text-5xl">🗺️</p>
              <h2 className="mt-4 text-xl font-bold">Live map coming soon</h2>
              <p className="mt-2 text-slate-400">
                This area will show real parking handovers around Shabia.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                <p className="text-sm font-semibold text-slate-300">
                  MVP status
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Posted spots now save inside your browser. Next step is
                  database, so everyone can see the same live spots.
                </p>
              </div>

              <button
                onClick={clearTestSpots}
                className="mt-5 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
              >
                Clear test spots
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {spots.length === 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center">
                <p className="text-4xl">🅿️</p>
                <h2 className="mt-4 text-xl font-bold">No spots yet</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Go to the Leaving page, post a spot, then come back here.
                </p>

                <a
                  href="/leaving"
                  className="mt-5 inline-block rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  Post a test spot
                </a>
              </div>
            )}

            {spots.map((spot) => {
              const isReserved = reservedSpotId === spot.id;

              return (
                <div
                  key={spot.id}
                  className={`rounded-3xl border p-5 transition ${
                    isReserved
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{spot.area}</p>
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
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    {isReserved ? "Reserved" : "Reserve handover"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}