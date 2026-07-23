"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  car_model: string;
  car_color: string;
  plate_number: string;
};

type ParkingSpot = {
  id: number;
  area: string;
  landmark: string;
  leaving_in: string;
  note: string | null;
  location: string;
  status:
    | "available"
    | "reserved"
    | "arrived"
    | "spotted"
    | "leaving"
    | "completed"
    | "cancelled";
  leaver_id: string | null;
  looker_id: string | null;
  leaver_car_model: string;
  leaver_car_color: string;
  leaver_plate_number: string;
  looker_car_model: string | null;
  looker_car_color: string | null;
  looker_plate_number: string | null;
  created_at: string;
};

const visibleStatuses = ["available", "reserved", "arrived", "spotted", "leaving"];

export default function LookingPage() {
  const [userId, setUserId] = useState("");
  const userIdRef = useRef("");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startPage();

    const channel = supabase
      .channel("parking-spots-looking-live")
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

    const refreshTimer = setInterval(() => {
      loadAvailableSpots();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshTimer);
    };
  }, []);

  async function startPage() {
    setIsLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const currentUserId = session.user.id;
    setUserId(currentUserId);
    userIdRef.current = currentUserId;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUserId)
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

    await loadAvailableSpots(currentUserId);
    setIsLoading(false);
  }

  async function loadAvailableSpots(forUserId?: string) {
    const idToUse = forUserId || userIdRef.current;

    if (!idToUse) {
      return;
    }

    const { data, error } = await supabase
      .from("parking_spots")
      .select("*")
      .in("status", visibleStatuses)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    const cleaned = ((data || []) as ParkingSpot[]).filter((spot) => {
      const isOwnPostedSpot = spot.leaver_id === idToUse;
      const isAvailableForAnyone = spot.status === "available";
      const isMyReservation = spot.looker_id === idToUse;

      return !isOwnPostedSpot && (isAvailableForAnyone || isMyReservation);
    });

    setSpots(cleaned);
  }

  async function reserveSpot(spot: ParkingSpot) {
    if (!profile) {
      window.location.href = "/profile";
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("parking_spots")
      .update({
        status: "reserved",
        looker_id: userIdRef.current,
        looker_car_model: profile.car_model,
        looker_car_color: profile.car_color,
        looker_plate_number: profile.plate_number,
      })
      .eq("id", spot.id)
      .eq("status", "available");

    if (error) {
      setMessage(error.message);
      return;
    }

    localStorage.setItem("park_habibi_active_mode", "looker");
    await loadAvailableSpots();
  }

  async function markArrived(spotId: number) {
    setMessage("");

    const { error } = await supabase
      .from("parking_spots")
      .update({ status: "arrived" })
      .eq("id", spotId)
      .eq("looker_id", userIdRef.current);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadAvailableSpots();
  }

  async function cancelReservation(spotId: number) {
    setMessage("");

    const { error } = await supabase
      .from("parking_spots")
      .update({
        status: "available",
        looker_id: null,
        looker_car_model: null,
        looker_car_color: null,
        looker_plate_number: null,
      })
      .eq("id", spotId)
      .eq("looker_id", userIdRef.current);

    if (error) {
      setMessage(error.message);
      return;
    }

    localStorage.removeItem("park_habibi_active_mode");
    await loadAvailableSpots();
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("park_habibi_profile");
    localStorage.removeItem("park_habibi_active_mode");
    window.location.href = "/";
  }

  function isMyReservation(spot: ParkingSpot) {
    return spot.looker_id === userIdRef.current;
  }

  function getStatusText(status: ParkingSpot["status"]) {
    if (status === "available") return "Available";
    if (status === "reserved") return "Reserved";
    if (status === "arrived") return "Waiting for leaver to spot you";
    if (status === "spotted") return "Leaver spotted you";
    if (status === "leaving") return "Leaver is leaving now";
    if (status === "completed") return "Completed";
    return "Cancelled";
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950">
            P
          </div>
          <p className="text-sm text-slate-400">Finding live handovers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate min-h-screen">
        <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[160px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              P
            </div>

            <div>
              <p className="text-lg font-bold leading-none">Park Habibi</p>
              <p className="mt-1 text-xs text-slate-500">Looking for parking</p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/mode"
              className="rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Mode
            </a>

            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Looker mode
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Find a live
              <span className="block text-emerald-400">parking handover.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              See real handovers only. Exact landmark and car details unlock
              after you reserve.
            </p>

            {profile && (
              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm font-bold text-slate-300">Your car</p>
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

          <div className="mt-10">
            {spots.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/30">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl">
                  🅿️
                </div>
                <h2 className="text-2xl font-black">No live handovers yet</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  Real parking handovers will appear here when someone nearby
                  posts that they are leaving.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {spots.map((spot) => {
                  const mine = isMyReservation(spot);

                  return (
                    <div
                      key={spot.id}
                      className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-2xl font-black text-white">
                            {spot.area}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            Leaving: {spot.leaving_in}
                          </p>
                        </div>

                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                          {getStatusText(spot.status)}
                        </div>
                      </div>

                      {!mine && spot.status === "available" && (
                        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                          <p className="text-sm font-bold text-slate-300">
                            Details locked
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            Exact landmark, car model, color, plate number, and
                            note unlock after you reserve this handover.
                          </p>
                        </div>
                      )}

                      {mine && (
                        <div className="mt-5 space-y-4">
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                            <p className="text-sm font-bold text-emerald-300">
                              Reserved by you
                            </p>
                            <p className="mt-2 text-sm text-emerald-100/80">
                              Exact landmark: {spot.landmark}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                            <p className="text-sm font-bold text-slate-300">
                              Leaver car
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                              {spot.leaver_car_color} {spot.leaver_car_model} ·
                              Plate {spot.leaver_plate_number}
                            </p>

                            {spot.note && (
                              <p className="mt-3 text-sm leading-6 text-slate-500">
                                Note: {spot.note}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {spot.status === "available" && !mine && (
                          <button
                            type="button"
                            onClick={() => reserveSpot(spot)}
                            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 sm:col-span-2"
                          >
                            Reserve Handover
                          </button>
                        )}

                        {mine && spot.status === "reserved" && (
                          <button
                            type="button"
                            onClick={() => markArrived(spot.id)}
                            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                          >
                            I’m here
                          </button>
                        )}

                        {mine && spot.status === "arrived" && (
                          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-400">
                            Waiting for leaver to press “Spotted them”
                          </div>
                        )}

                        {mine && spot.status === "spotted" && (
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
                            Leaver spotted you. Stay ready.
                          </div>
                        )}

                        {mine && spot.status === "leaving" && (
                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
                            Leaver is leaving now. Move in safely.
                          </div>
                        )}

                        {mine &&
                          (spot.status === "reserved" ||
                            spot.status === "arrived") && (
                            <button
                              type="button"
                              onClick={() => cancelReservation(spot.id)}
                              className="rounded-2xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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