"use client";

import { useEffect, useRef, useState } from "react";
import ParkingSpotsMap, {
  type ParkingMapSpot,
} from "@/components/ParkingSpotsMap";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  car_model: string;
  car_color: string;
  plate_number: string;
};

type ParkingSpotStatus =
  | "available"
  | "reserved"
  | "arrived"
  | "spotted"
  | "leaving"
  | "completed"
  | "cancelled";

type ParkingSpot = {
  spot_id: number;
  area: string;
  leaving_in: string;
  location: string | null;
  status: ParkingSpotStatus;
  latitude: number | null;
  longitude: number | null;
  exact_location_unlocked: boolean;
  landmark: string | null;
  note: string | null;
  leaver_car_model: string | null;
  leaver_car_color: string | null;
  leaver_plate_number: string | null;
  looker_car_model: string | null;
  looker_car_color: string | null;
  looker_plate_number: string | null;
  is_my_handover: boolean;
  is_my_reservation: boolean;
  created_at: string;
};

export default function LookingPage() {
  const userIdRef = useRef("");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [busySpotId, setBusySpotId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startPage();

    const channel = supabase
      .channel("secure-parking-spots-looking-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "parking_spots",
        },
        () => {
          loadAvailableSpots();
        }
      )
      .subscribe();

    const refreshTimer = window.setInterval(() => {
      loadAvailableSpots();
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(refreshTimer);
    };
  }, []);

  async function startPage() {
    setIsLoading(true);
    setMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setMessage(sessionError.message);
      setIsLoading(false);
      return;
    }

    if (!session) {
      window.location.href = "/login";
      return;
    }

    userIdRef.current = session.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, car_model, car_color, plate_number")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profileError) {
      alert("Could not load your car profile: " + profileError.message);
      window.location.href = "/login";
      return;
    }

    if (!profileData) {
      window.location.href = "/profile";
      return;
    }

    const savedProfile = profileData as Profile;

    setProfile(savedProfile);

    localStorage.setItem(
      "park_habibi_profile",
      JSON.stringify({
        carModel: savedProfile.car_model,
        carColor: savedProfile.car_color,
        plateNumber: savedProfile.plate_number,
      })
    );

    await loadAvailableSpots();
    setIsLoading(false);
  }

  async function loadAvailableSpots() {
    if (!userIdRef.current) {
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_visible_parking_spots_secure"
    );

    if (error) {
      setMessage(error.message);
      return;
    }

    const loadedSpots = ((data || []) as ParkingSpot[]).filter(
      (spot) => !spot.is_my_handover
    );

    setSpots(loadedSpots);

    setSelectedSpotId((currentSelectedId) => {
      if (
        currentSelectedId &&
        loadedSpots.some((spot) => spot.spot_id === currentSelectedId)
      ) {
        return currentSelectedId;
      }

      return loadedSpots[0]?.spot_id ?? null;
    });
  }

  async function reserveSpot(spot: ParkingSpot) {
    if (!profile) {
      window.location.href = "/profile";
      return;
    }

    setBusySpotId(spot.spot_id);
    setMessage("");

    const { error } = await supabase.rpc(
      "reserve_parking_spot_secure",
      {
        p_spot_id: spot.spot_id,
        p_looker_car_model: profile.car_model,
        p_looker_car_color: profile.car_color,
        p_looker_plate_number: profile.plate_number,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusySpotId(null);
      await loadAvailableSpots();
      return;
    }

    localStorage.setItem("park_habibi_active_mode", "looker");

    await loadAvailableSpots();

    setSelectedSpotId(spot.spot_id);
    setMessage(
      "Handover reserved. The exact pin and private details are now unlocked."
    );

    setBusySpotId(null);
  }

  async function markArrived(spotId: number) {
    setBusySpotId(spotId);
    setMessage("");

    const { error } = await supabase.rpc(
      "mark_parking_arrived_secure",
      {
        p_spot_id: spotId,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusySpotId(null);
      return;
    }

    await loadAvailableSpots();

    setMessage("The leaver has been notified that you are here.");
    setBusySpotId(null);
  }

  async function cancelReservation(spotId: number) {
    setBusySpotId(spotId);
    setMessage("");

    const { error } = await supabase.rpc(
      "cancel_parking_reservation_secure",
      {
        p_spot_id: spotId,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusySpotId(null);
      return;
    }

    localStorage.removeItem("park_habibi_active_mode");

    await loadAvailableSpots();

    setMessage("Your reservation has been cancelled.");
    setBusySpotId(null);
  }

  async function logout() {
    await supabase.auth.signOut();

    localStorage.removeItem("park_habibi_profile");
    localStorage.removeItem("park_habibi_active_mode");

    window.location.href = "/";
  }

  function getStatusText(status: ParkingSpotStatus) {
    if (status === "available") {
      return "Available";
    }

    if (status === "reserved") {
      return "Reserved by you";
    }

    if (status === "arrived") {
      return "Waiting for leaver to spot you";
    }

    if (status === "spotted") {
      return "Leaver spotted you";
    }

    if (status === "leaving") {
      return "Leaver is leaving now";
    }

    if (status === "completed") {
      return "Completed";
    }

    return "Cancelled";
  }

  function openNavigation(spot: ParkingSpot) {
    if (
      !spot.exact_location_unlocked ||
      spot.latitude === null ||
      spot.longitude === null
    ) {
      return;
    }

    const destination = `${spot.latitude},${spot.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const selectedSpot =
    spots.find((spot) => spot.spot_id === selectedSpotId) ?? null;

  const mapSpots: ParkingMapSpot[] = spots
    .filter(
      (spot) =>
        spot.latitude !== null &&
        spot.longitude !== null &&
        Number.isFinite(spot.latitude) &&
        Number.isFinite(spot.longitude)
    )
    .map((spot) => ({
      id: spot.spot_id,
      area: spot.area,
      leavingIn: spot.leaving_in,
      latitude: spot.latitude as number,
      longitude: spot.longitude as number,
      exactLocationUnlocked: spot.exact_location_unlocked,
    }));

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950">
            P
          </div>

          <p className="text-sm text-slate-400">
            Finding live handovers...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate min-h-screen">
        <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[160px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              P
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-none">
                Park Habibi
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                Looking for parking
              </p>
            </div>
          </a>

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href="/mode"
              className="rounded-full border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 sm:px-4 sm:text-sm"
            >
              Mode
            </a>

            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300 sm:px-4 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Looker mode
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Find a live
              <span className="block text-emerald-400">
                parking handover.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Browse approximate locations safely. The exact pin,
              landmark and leaver vehicle details unlock only after
              you reserve.
            </p>

            {profile && (
              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm font-bold text-slate-300">
                  Your car
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {profile.car_color} {profile.car_model} · Plate{" "}
                  {profile.plate_number}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => loadAvailableSpots()}
              className="mt-5 rounded-2xl border border-slate-800 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Refresh updates
            </button>
          </div>

          {message && (
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <ParkingSpotsMap
              spots={mapSpots}
              selectedSpotId={selectedSpotId}
              onSelectSpot={setSelectedSpotId}
            />

            <div className="min-w-0">
              {spots.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/30">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl">
                    🅿️
                  </div>

                  <h2 className="text-2xl font-black">
                    No live handovers yet
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Real parking handovers will appear here when
                    someone nearby posts that they are leaving.
                  </p>
                </div>
              ) : selectedSpot ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                        Selected handover
                      </p>

                      <h2 className="mt-2 text-3xl font-black text-white">
                        {selectedSpot.area}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        Leaving: {selectedSpot.leaving_in}
                      </p>
                    </div>

                    <div className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      {getStatusText(selectedSpot.status)}
                    </div>
                  </div>

                  {!selectedSpot.exact_location_unlocked && (
                    <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                      <p className="text-sm font-bold text-amber-300">
                        Approximate location
                      </p>

                      <p className="mt-2 text-sm leading-6 text-amber-100/70">
                        This pin is deliberately offset from the
                        real parking position. The browser has not
                        received the exact coordinates.
                      </p>
                    </div>
                  )}

                  {selectedSpot.exact_location_unlocked && (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <p className="text-sm font-bold text-emerald-300">
                          Exact location unlocked
                        </p>

                        <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                          Landmark:{" "}
                          {selectedSpot.landmark ||
                            "No landmark was provided"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="text-sm font-bold text-slate-300">
                          Leaver car
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {selectedSpot.leaver_car_color || "Unknown"}{" "}
                          {selectedSpot.leaver_car_model ||
                            "vehicle"}{" "}
                          · Plate{" "}
                          {selectedSpot.leaver_plate_number ||
                            "not provided"}
                        </p>

                        {selectedSpot.note && (
                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            Note: {selectedSpot.note}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openNavigation(selectedSpot)}
                        className="w-full rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-400/20"
                      >
                        Open exact location in Google Maps
                      </button>
                    </div>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {selectedSpot.status === "available" &&
                      !selectedSpot.is_my_reservation && (
                        <button
                          type="button"
                          onClick={() => reserveSpot(selectedSpot)}
                          disabled={
                            busySpotId === selectedSpot.spot_id
                          }
                          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
                        >
                          {busySpotId === selectedSpot.spot_id
                            ? "Reserving..."
                            : "Reserve Handover"}
                        </button>
                      )}

                    {selectedSpot.is_my_reservation &&
                      selectedSpot.status === "reserved" && (
                        <button
                          type="button"
                          onClick={() =>
                            markArrived(selectedSpot.spot_id)
                          }
                          disabled={
                            busySpotId === selectedSpot.spot_id
                          }
                          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busySpotId === selectedSpot.spot_id
                            ? "Updating..."
                            : "I’m here"}
                        </button>
                      )}

                    {selectedSpot.is_my_reservation &&
                      selectedSpot.status === "arrived" && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-400">
                          Waiting for leaver to press “Spotted them”
                        </div>
                      )}

                    {selectedSpot.is_my_reservation &&
                      selectedSpot.status === "spotted" && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 sm:col-span-2">
                          Leaver spotted you. Stay ready.
                        </div>
                      )}

                    {selectedSpot.is_my_reservation &&
                      selectedSpot.status === "leaving" && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 sm:col-span-2">
                          Leaver is leaving now. Move in safely.
                        </div>
                      )}

                    {selectedSpot.is_my_reservation &&
                      (selectedSpot.status === "reserved" ||
                        selectedSpot.status === "arrived") && (
                        <button
                          type="button"
                          onClick={() =>
                            cancelReservation(selectedSpot.spot_id)
                          }
                          disabled={
                            busySpotId === selectedSpot.spot_id
                          }
                          className="rounded-2xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busySpotId === selectedSpot.spot_id
                            ? "Updating..."
                            : "Cancel"}
                        </button>
                      )}
                  </div>
                </div>
              ) : null}

              {spots.length > 1 && (
                <div className="mt-5 space-y-3">
                  <p className="px-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    All live handovers
                  </p>

                  {spots.map((spot) => {
                    const isSelected =
                      selectedSpotId === spot.spot_id;

                    return (
                      <button
                        key={spot.spot_id}
                        type="button"
                        onClick={() =>
                          setSelectedSpotId(spot.spot_id)
                        }
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">
                              {spot.area}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Leaving: {spot.leaving_in}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                              spot.exact_location_unlocked
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {spot.exact_location_unlocked
                              ? "Exact"
                              : "Approximate"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="relative mx-auto max-w-7xl border-t border-slate-800 px-6 py-8 text-sm text-slate-500 lg:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-slate-300">
              Park Habibi
            </p>

            <p>
              No more circling, habibi. Starting in Shabia,
              Abu Dhabi.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Created with love by{" "}
            <span className="font-semibold text-slate-400">
              Torque
            </span>{" "}
            <span className="text-red-500">❤️</span>
          </p>
        </footer>
      </div>
    </main>
  );
}