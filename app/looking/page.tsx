"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CarProfile = {
  carModel: string;
  carColor: string;
  plateNumber: string;
};

type ParkingSpot = {
  id: number;
  area: string;
  landmark: string;
  leavingIn: string;
  note: string | null;
  location: string;
  createdAt: string;
  status:
    | "available"
    | "reserved"
    | "arrived"
    | "spotted"
    | "leaving"
    | "completed"
    | "cancelled";

  leaverCarModel: string;
  leaverCarColor: string;
  leaverPlateNumber: string;

  lookerCarModel?: string | null;
  lookerCarColor?: string | null;
  lookerPlateNumber?: string | null;
};

type SupabaseSpot = {
  id: number;
  area: string;
  landmark: string;
  leaving_in: string;
  note: string | null;
  location: string;
  created_at: string;
  status:
    | "available"
    | "reserved"
    | "arrived"
    | "spotted"
    | "leaving"
    | "completed"
    | "cancelled";

  leaver_car_model: string;
  leaver_car_color: string;
  leaver_plate_number: string;

  looker_car_model: string | null;
  looker_car_color: string | null;
  looker_plate_number: string | null;
};

function convertSpotFromDatabase(spot: SupabaseSpot): ParkingSpot {
  return {
    id: spot.id,
    area: spot.area,
    landmark: spot.landmark,
    leavingIn: spot.leaving_in,
    note: spot.note,
    location: spot.location,
    createdAt: spot.created_at,
    status: spot.status,

    leaverCarModel: spot.leaver_car_model,
    leaverCarColor: spot.leaver_car_color,
    leaverPlateNumber: spot.leaver_plate_number,

    lookerCarModel: spot.looker_car_model,
    lookerCarColor: spot.looker_car_color,
    lookerPlateNumber: spot.looker_plate_number,
  };
}

export default function LookingPage() {
  const [profile, setProfile] = useState<CarProfile | null>(null);
  const [setupCarModel, setSetupCarModel] = useState("");
  const [setupCarColor, setSetupCarColor] = useState("");
  const [setupPlateNumber, setSetupPlateNumber] = useState("");

  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
    loadSpots();
  }, []);

  function loadProfile() {
    const savedProfileText = localStorage.getItem("park_habibi_profile");
    const savedProfile: CarProfile | null = savedProfileText
      ? JSON.parse(savedProfileText)
      : null;

    setProfile(savedProfile);
  }

  async function loadSpots() {
    setIsLoadingSpots(true);

    const { data, error } = await supabase
      .from("parking_spots")
      .select("*")
      .neq("status", "completed")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Could not load spots: " + error.message);
      setIsLoadingSpots(false);
      return;
    }

    const convertedSpots = (data || []).map((spot) =>
      convertSpotFromDatabase(spot as SupabaseSpot)
    );

    setSpots(convertedSpots);
    setIsLoadingSpots(false);
  }

  function saveProfile() {
    if (!setupCarModel.trim()) {
      alert("Please enter your car model.");
      return;
    }

    if (!setupCarColor.trim()) {
      alert("Please enter your car color.");
      return;
    }

    if (!setupPlateNumber.trim()) {
      alert("Please enter your plate number.");
      return;
    }

    const newProfile: CarProfile = {
      carModel: setupCarModel,
      carColor: setupCarColor,
      plateNumber: setupPlateNumber,
    };

    localStorage.setItem("park_habibi_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
  }

  function resetProfile() {
    localStorage.removeItem("park_habibi_profile");
    setProfile(null);
    setSetupCarModel("");
    setSetupCarColor("");
    setSetupPlateNumber("");
  }

  async function clearCompletedAndCancelled() {
    const { error } = await supabase
      .from("parking_spots")
      .delete()
      .in("status", ["completed", "cancelled"]);

    if (error) {
      alert("Could not clear old spots: " + error.message);
      return;
    }

    await loadSpots();
  }

  async function reserveHandover(spot: ParkingSpot) {
    if (!profile) {
      alert("Please set up your car first.");
      return;
    }

    setIsUpdating(true);

    const { error } = await supabase
      .from("parking_spots")
      .update({
        status: "reserved",
        looker_car_model: profile.carModel,
        looker_car_color: profile.carColor,
        looker_plate_number: profile.plateNumber,
      })
      .eq("id", spot.id)
      .eq("status", "available");

    if (error) {
      alert("Could not reserve handover: " + error.message);
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    await loadSpots();
  }

  async function markArrived(spot: ParkingSpot) {
    setIsUpdating(true);

    const { error } = await supabase
      .from("parking_spots")
      .update({
        status: "arrived",
      })
      .eq("id", spot.id);

    if (error) {
      alert("Could not update arrival: " + error.message);
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    await loadSpots();
  }

  const activeSpots = spots.filter(
    (spot) => spot.status !== "completed" && spot.status !== "cancelled"
  );

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
              Reserve first. Exact spot and car details unlock only after you
              commit to the handover.
            </p>
          </div>

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
                  onClick={clearCompletedAndCancelled}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
                >
                  Clear old
                </button>
              </div>

              <div className="relative mt-6 min-h-[430px] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute left-[-80px] top-[-80px] h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-[-80px] right-[-80px] h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative flex min-h-[380px] items-center justify-center text-center">
                  <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 text-4xl">
                      🔒
                    </div>
                    <h2 className="mt-5 text-2xl font-black">
                      Details stay hidden
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                      Before reservation, you only see the general area and
                      leaving time. Exact landmark, note, car details, and plate
                      number unlock after reserving.
                    </p>

                    <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left">
                      <p className="text-sm font-semibold text-slate-300">
                        Backend status
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        This page now reads and updates live data from Supabase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-up-delayed space-y-4">
              {!profile && (
                <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                      First-time setup
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Tell us your car
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your car details are shared with the leaver only after you
                      reserve a handover.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Car model
                      </label>
                      <input
                        type="text"
                        value={setupCarModel}
                        onChange={(event) =>
                          setSetupCarModel(event.target.value)
                        }
                        placeholder="Example: Corolla"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Car color
                      </label>
                      <input
                        type="text"
                        value={setupCarColor}
                        onChange={(event) =>
                          setSetupCarColor(event.target.value)
                        }
                        placeholder="Example: Green"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Plate number only
                      </label>
                      <input
                        type="text"
                        value={setupPlateNumber}
                        onChange={(event) =>
                          setSetupPlateNumber(event.target.value)
                        }
                        placeholder="Example: 82911"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        No plate code needed for now.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={saveProfile}
                      className="w-full rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                    >
                      Save Car Details
                    </button>
                  </div>
                </section>
              )}

              {profile && (
                <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                        Your car
                      </p>
                      <h2 className="mt-2 text-xl font-black">
                        {profile.carColor} {profile.carModel}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Plate number: {profile.plateNumber}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetProfile}
                      className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-400 hover:text-red-300"
                    >
                      Change
                    </button>
                  </div>
                </section>
              )}

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

                  <button
                    type="button"
                    onClick={loadSpots}
                    className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:border-emerald-500 hover:text-emerald-400"
                  >
                    {isLoadingSpots ? "Loading..." : "Refresh"}
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400">
                  {activeSpots.length} active handover
                  {activeSpots.length === 1 ? "" : "s"}
                </div>
              </div>

              {activeSpots.length === 0 && (
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

              {activeSpots.map((spot) => {
                const isMyReservation =
                  profile &&
                  spot.lookerCarModel === profile.carModel &&
                  spot.lookerPlateNumber === profile.plateNumber;

                const isUnlocked =
                  isMyReservation &&
                  (spot.status === "reserved" ||
                    spot.status === "arrived" ||
                    spot.status === "spotted" ||
                    spot.status === "leaving");

                const canReserve = spot.status === "available";

                return (
                  <div
                    key={spot.id}
                    className={`rounded-[2rem] border p-5 shadow-2xl shadow-black/20 transition ${
                      isMyReservation
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900/70 hover:-translate-y-1 hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black">{spot.area}</p>

                        {!isUnlocked && (
                          <p className="mt-1 text-sm text-slate-400">
                            Details hidden until reservation
                          </p>
                        )}

                        {isUnlocked && (
                          <p className="mt-1 text-sm text-slate-400">
                            Handover details unlocked
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                        {spot.leavingIn}
                      </span>
                    </div>

                    {!isUnlocked && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Locked details
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Exact landmark, note, car details, and plate number
                          unlock only after reservation.
                        </p>
                      </div>
                    )}

                    {isUnlocked && (
                      <>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-950 p-3">
                            <p className="text-slate-500">Exact landmark</p>
                            <p className="mt-1 font-semibold">
                              {spot.landmark}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-950 p-3">
                            <p className="text-slate-500">Car</p>
                            <p className="mt-1 font-semibold">
                              {spot.leaverCarColor} {spot.leaverCarModel}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-950 p-3">
                            <p className="text-slate-500">Plate number</p>
                            <p className="mt-1 font-semibold">
                              {spot.leaverPlateNumber}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-950 p-3">
                            <p className="text-slate-500">Status</p>
                            <p className="mt-1 font-semibold">{spot.status}</p>
                          </div>
                        </div>

                        {spot.note && (
                          <div className="mt-3 rounded-2xl bg-slate-950 p-3 text-sm">
                            <p className="text-slate-500">Note</p>
                            <p className="mt-1 text-slate-300">{spot.note}</p>
                          </div>
                        )}
                      </>
                    )}

                    {canReserve && (
                      <button
                        onClick={() => reserveHandover(spot)}
                        disabled={isUpdating}
                        className={`mt-4 w-full rounded-2xl px-4 py-3 font-bold transition ${
                          isUpdating
                            ? "cursor-not-allowed bg-slate-800 text-slate-500"
                            : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                        }`}
                      >
                        {isUpdating ? "Working..." : "Reserve handover"}
                      </button>
                    )}

                    {isMyReservation && spot.status === "reserved" && (
                      <button
                        onClick={() => markArrived(spot)}
                        disabled={isUpdating}
                        className={`mt-4 w-full rounded-2xl px-4 py-3 font-bold transition ${
                          isUpdating
                            ? "cursor-not-allowed bg-slate-800 text-slate-500"
                            : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                        }`}
                      >
                        {isUpdating ? "Working..." : "I'm here"}
                      </button>
                    )}

                    {isMyReservation && spot.status === "arrived" && (
                      <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        Waiting for the leaver to spot you.
                      </div>
                    )}

                    {isMyReservation && spot.status === "spotted" && (
                      <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        Leaver spotted you. Mutual confirmation complete. Wait
                        safely while they move out.
                      </div>
                    )}

                    {isMyReservation && spot.status === "leaving" && (
                      <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        The leaver is moving out. Take the spot safely.
                      </div>
                    )}

                    {!canReserve && !isMyReservation && (
                      <button
                        disabled
                        className="mt-4 w-full cursor-not-allowed rounded-2xl bg-slate-800 px-4 py-3 font-bold text-slate-500"
                      >
                        Reserved by another driver
                      </button>
                    )}
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