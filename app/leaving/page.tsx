"use client";

import { useState } from "react";

type ParkingSpot = {
  id: number;
  area: string;
  landmark: string;
  leavingIn: string;
  note: string;
  location: string;
  createdAt: string;
};

export default function LeavingPage() {
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [note, setNote] = useState("");
  const [leavingIn, setLeavingIn] = useState("5 min");
  const [locationStatus, setLocationStatus] = useState("");
  const [hasLocation, setHasLocation] = useState(false);
  const [posted, setPosted] = useState(false);

  function useMyLocation() {
    setPosted(false);
    setLocationStatus("Getting your location...");

    if (!navigator.geolocation) {
      setHasLocation(false);
      setLocationStatus("Location is not supported on this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setHasLocation(true);
        setLocationStatus("Location captured successfully.");
      },
      () => {
        setHasLocation(false);
        setLocationStatus(
          "Could not get location. You can use a test location while we build."
        );
      }
    );
  }

  function useTestLocation() {
    setPosted(false);
    setHasLocation(true);
    setLocationStatus("Test location selected: Shabia, Abu Dhabi.");
  }

  function postSpot() {
    if (!area.trim()) {
      alert("Please enter the area.");
      return;
    }

    if (!landmark.trim()) {
      alert("Please enter a nearby building or landmark.");
      return;
    }

    if (!hasLocation) {
      setLocationStatus("Please select a location before posting your spot.");
      return;
    }

    const newSpot: ParkingSpot = {
      id: Date.now(),
      area,
      landmark,
      leavingIn,
      note,
      location: "Shabia, Abu Dhabi",
      createdAt: new Date().toISOString(),
    };

    const existingSpotsText = localStorage.getItem("park_habibi_spots");
    const existingSpots: ParkingSpot[] = existingSpotsText
      ? JSON.parse(existingSpotsText)
      : [];

    const updatedSpots = [newSpot, ...existingSpots];

    localStorage.setItem("park_habibi_spots", JSON.stringify(updatedSpots));

    setPosted(true);
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

        <section className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="animate-fade-up">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Someone&apos;s leaving
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Share your
              <span className="block text-emerald-400">parking spot.</span>
            </h1>

            <p className="mt-5 text-xl font-semibold leading-8 text-slate-200">
              Leaving soon? Let someone nearby know so they can arrive as you
              move out.
            </p>

            <p className="mt-3 text-lg font-semibold text-emerald-400">
              No more circling, habibi.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm font-bold text-slate-300">
                How this works
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-black text-emerald-400">
                    1
                  </div>
                  <p className="text-sm leading-6 text-slate-400">
                    Add your area and nearby landmark.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-black text-emerald-400">
                    2
                  </div>
                  <p className="text-sm leading-6 text-slate-400">
                    Choose when you&apos;re leaving.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-black text-emerald-400">
                    3
                  </div>
                  <p className="text-sm leading-6 text-slate-400">
                    Someone nearby reserves the handover and arrives before you
                    move out.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
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

          <div className="animate-fade-up-delayed">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Handover details
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Post your spot</h2>
                </div>

                <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                  Beta
                </div>
              </div>

              {posted && (
                <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  Your spot has been posted for {leavingIn}. Someone looking
                  for parking can now see it.
                </div>
              )}

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(event) => {
                      setArea(event.target.value);
                      setPosted(false);
                    }}
                    placeholder="Example: Shabia 10"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Nearby building or landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(event) => {
                      setLandmark(event.target.value);
                      setPosted(false);
                    }}
                    placeholder="Example: Near Lulu / Building 43"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Location
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-white transition hover:border-emerald-500 hover:text-emerald-400"
                    >
                      📍 Use my location
                    </button>

                    <button
                      type="button"
                      onClick={useTestLocation}
                      className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-white transition hover:border-emerald-500 hover:text-emerald-400"
                    >
                      🧪 Use test location
                    </button>
                  </div>

                  {locationStatus && (
                    <p
                      className={`mt-2 text-sm ${
                        hasLocation ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {locationStatus}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Leaving in
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {["2 min", "5 min", "10 min"].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setLeavingIn(time);
                          setPosted(false);
                        }}
                        className={`rounded-2xl border px-4 py-3 font-semibold transition ${
                          leavingIn === time
                            ? "border-emerald-500 bg-emerald-500 text-slate-950"
                            : "border-slate-700 bg-slate-950 text-white hover:border-emerald-500 hover:text-emerald-400"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(event) => {
                      setNote(event.target.value);
                      setPosted(false);
                    }}
                    placeholder="Example: White Pajero, front side of building"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={postSpot}
                  className={`w-full rounded-2xl px-6 py-4 font-bold transition ${
                    hasLocation
                      ? "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
                  }`}
                >
                  Share Spot
                </button>
              </form>
            </section>
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