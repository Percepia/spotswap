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
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-sm text-slate-400 hover:text-white">
          ← Back to Park Habibi
        </a>

        <section className="mt-10">
          <p className="text-sm font-medium text-emerald-400">
            Someone&apos;s leaving
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Share your parking spot
          </h1>

          <p className="mt-4 text-xl font-semibold leading-8 text-slate-200">
            Leaving soon? Let someone nearby know so they can arrive as you move
            out.
          </p>

          <p className="mt-2 text-lg font-semibold text-emerald-400">
            No more circling, habibi.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
          {posted && (
            <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              Your spot has been posted for {leavingIn}. Someone looking for
              parking can now see it.
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
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              Share Spot
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}