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

const activeStatuses = ["available", "reserved", "arrived", "spotted", "leaving"];

export default function LeavingPage() {
  const [userId, setUserId] = useState("");
  const userIdRef = useRef("");

  const [profile, setProfile] = useState<Profile | null>(null);

  const [area, setArea] = useState("Shabia");
  const [landmark, setLandmark] = useState("");
  const [leavingIn, setLeavingIn] = useState("Now");
  const [note, setNote] = useState("");

  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startPage();

    const channel = supabase
      .channel("parking-spots-leaving-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "parking_spots",
        },
        () => {
          loadMySpots();
        }
      )
      .subscribe();

    const refreshTimer = setInterval(() => {
      loadMySpots();
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

    await loadMySpots(currentUserId);
    setIsLoading(false);
  }

  async function loadMySpots(forUserId?: string) {
    const idToUse = forUserId || userIdRef.current;

    if (!idToUse) {
      return;
    }

    const { data, error } = await supabase
      .from("parking_spots")
      .select("*")
      .eq("leaver_id", idToUse)
      .in("status", activeStatuses)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSpots((data || []) as ParkingSpot[]);
  }

  async function postSpot() {
    if (!profile) {
      window.location.href = "/profile";
      return;
    }

    if (!landmark.trim()) {
      alert("Please enter the exact landmark.");
      return;
    }

    setIsPosting(true);
    setMessage("");

    const { error } = await supabase.from("parking_spots").insert({
      area: area.trim(),
      landmark: landmark.trim(),
      leaving_in: leavingIn,
      note: note.trim() || null,
      location: "Shabia, Abu Dhabi",
      status: "available",
      leaver_id: userIdRef.current,
      leaver_car_model: profile.car_model,
      leaver_car_color: profile.car_color,
      leaver_plate_number: profile.plate_number,
    });

    if (error) {
      setMessage(error.message);
      setIsPosting(false);
      return;
    }

    setLandmark("");
    setLeavingIn("Now");
    setNote("");
    localStorage.setItem("park_habibi_active_mode", "leaver");

    await loadMySpots();
    setMessage("Your parking handover is now live.");
    setIsPosting(false);
  }

  async function updateSpotStatus(
    spotId: number,
    nextStatus: ParkingSpot["status"]
  ) {
    setMessage("");

    const { error } = await supabase
      .from("parking_spots")
      .update({ status: nextStatus })
      .eq("id", spotId)
      .eq("leaver_id", userIdRef.current);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadMySpots();

    if (nextStatus === "completed" || nextStatus === "cancelled") {
      localStorage.removeItem("park_habibi_active_mode");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("park_habibi_profile");
    localStorage.removeItem("park_habibi_active_mode");
    window.location.href = "/";
  }

  function getStatusText(status: ParkingSpot["status"]) {
    if (status === "available") return "Waiting for someone to reserve";
    if (status === "reserved") return "Reserved. Wait for the driver";
    if (status === "arrived") return "Driver says they are here";
    if (status === "spotted") return "You spotted them";
    if (status === "leaving") return "You are leaving now";
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
          <p className="text-sm text-slate-400">Loading your handovers...</p>
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
              <p className="mt-1 text-xs text-slate-500">Leaving a spot</p>
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

        <section className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Leaver mode
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Post your
              <span className="block text-emerald-400">parking handover.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Share when you are leaving. A looking driver can reserve the
              handover and coordinate with your car details after reservation.
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
              onClick={() => loadMySpots()}
              className="mt-5 rounded-2xl border border-slate-800 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Refresh updates
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                New handover
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Exact landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(event) => setLandmark(event.target.value)}
                    placeholder="Example: Near Lulu entrance, behind mosque..."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    This is shown only after someone reserves your handover.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Leaving time
                  </label>
                  <select
                    value={leavingIn}
                    onChange={(event) => setLeavingIn(event.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  >
                    <option>Now</option>
                    <option>In 5 minutes</option>
                    <option>In 10 minutes</option>
                    <option>In 15 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional note for the reserved driver"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                {message && (
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
                    {message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={postSpot}
                  disabled={isPosting}
                  className={`w-full rounded-2xl px-6 py-4 font-bold transition ${
                    isPosting
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                  }`}
                >
                  {isPosting ? "Posting..." : "Post Live Handover"}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Active
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Your handovers</h2>
                </div>

                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Live
                </div>
              </div>

              {spots.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
                  No active handover yet. Post one when you are ready to leave.
                </div>
              ) : (
                <div className="space-y-4">
                  {spots.map((spot) => (
                    <div
                      key={spot.id}
                      className="rounded-3xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-black text-white">
                            {spot.area}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Leaving: {spot.leaving_in}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Landmark: {spot.landmark}
                          </p>
                        </div>

                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                          {getStatusText(spot.status)}
                        </div>
                      </div>

                      {spot.looker_car_model && (
                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-sm font-bold text-slate-300">
                            Reserved driver
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            {spot.looker_car_color} {spot.looker_car_model} ·
                            Plate {spot.looker_plate_number}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {spot.status === "arrived" && (
                          <button
                            type="button"
                            onClick={() => updateSpotStatus(spot.id, "spotted")}
                            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                          >
                            Spotted them
                          </button>
                        )}

                        {spot.status === "spotted" && (
                          <button
                            type="button"
                            onClick={() => updateSpotStatus(spot.id, "leaving")}
                            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                          >
                            I’m leaving now
                          </button>
                        )}

                        {spot.status === "leaving" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateSpotStatus(spot.id, "completed")
                            }
                            className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                          >
                            Complete handover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => updateSpotStatus(spot.id, "cancelled")}
                          className="rounded-2xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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