"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ParkingLocationPicker, {
  type ParkingCoordinates,
} from "@/components/ParkingLocationPicker";
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

export default function LeavingPage() {
  const userIdRef = useRef("");

  const [profile, setProfile] = useState<Profile | null>(null);

  const [area, setArea] = useState("Shabia");
  const [landmark, setLandmark] = useState("");
  const [leavingIn, setLeavingIn] = useState("Now");
  const [note, setNote] = useState("");

  const [parkingCoordinates, setParkingCoordinates] =
    useState<ParkingCoordinates | null>(null);

  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [busySpotId, setBusySpotId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleLocationChange = useCallback(
    (coordinates: ParkingCoordinates) => {
      setParkingCoordinates(coordinates);
    },
    []
  );

  useEffect(() => {
    startPage();

    const channel = supabase
      .channel("secure-parking-spots-leaving-live")
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

    const refreshTimer = window.setInterval(() => {
      loadMySpots();
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

    await loadMySpots();
    setIsLoading(false);
  }

  async function loadMySpots() {
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

    const mySpots = ((data || []) as ParkingSpot[]).filter(
      (spot) => spot.is_my_handover
    );

    setSpots(mySpots);
  }

  async function postSpot() {
    if (!profile) {
      window.location.href = "/profile";
      return;
    }

    if (!area.trim()) {
      alert("Please enter the area.");
      return;
    }

    if (!parkingCoordinates) {
      alert("Please select your exact parking location on the map.");
      return;
    }

    if (!landmark.trim()) {
      alert("Please enter the exact landmark.");
      return;
    }

    if (!profile.car_model.trim()) {
      alert("Please add your car model in your profile.");
      return;
    }

    if (!profile.car_color.trim()) {
      alert("Please add your car colour in your profile.");
      return;
    }

    if (!profile.plate_number.trim()) {
      alert("Please add your plate number in your profile.");
      return;
    }

    setIsPosting(true);
    setMessage("");

    const { data, error } = await supabase.rpc(
      "create_parking_handover_secure",
      {
        p_area: area.trim(),
        p_landmark: landmark.trim(),
        p_leaving_in: leavingIn,
        p_note: note.trim() || "",
        p_exact_latitude: parkingCoordinates.latitude,
        p_exact_longitude: parkingCoordinates.longitude,
        p_leaver_car_model: profile.car_model,
        p_leaver_car_color: profile.car_color,
        p_leaver_plate_number: profile.plate_number,
      }
    );

    if (error) {
      setMessage(error.message);
      setIsPosting(false);
      return;
    }

    setLandmark("");
    setLeavingIn("Now");
    setNote("");
    setParkingCoordinates(null);

    localStorage.setItem("park_habibi_active_mode", "leaver");

    await loadMySpots();

    setMessage(
      `Your parking handover is now live${
        data ? ` · Handover #${data}` : ""
      }.`
    );

    setIsPosting(false);
  }

  async function updateSpotStatus(
    spotId: number,
    nextStatus: "spotted" | "leaving" | "completed" | "cancelled"
  ) {
    setBusySpotId(spotId);
    setMessage("");

    const { error } = await supabase.rpc(
      "update_leaver_parking_status_secure",
      {
        p_spot_id: spotId,
        p_next_status: nextStatus,
      }
    );

    if (error) {
      setMessage(error.message);
      setBusySpotId(null);
      await loadMySpots();
      return;
    }

    await loadMySpots();

    if (nextStatus === "spotted") {
      setMessage("You confirmed that you spotted the reserved driver.");
    }

    if (nextStatus === "leaving") {
      setMessage("The reserved driver has been told that you are leaving.");
    }

    if (nextStatus === "completed") {
      localStorage.removeItem("park_habibi_active_mode");
      setMessage("Parking handover completed.");
    }

    if (nextStatus === "cancelled") {
      localStorage.removeItem("park_habibi_active_mode");
      setMessage("Parking handover cancelled.");
    }

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
      return "Waiting for someone to reserve";
    }

    if (status === "reserved") {
      return "Reserved · Wait for the driver";
    }

    if (status === "arrived") {
      return "Driver says they are here";
    }

    if (status === "spotted") {
      return "You spotted the driver";
    }

    if (status === "leaving") {
      return "You are leaving now";
    }

    if (status === "completed") {
      return "Completed";
    }

    return "Cancelled";
  }

  function openExactLocation(spot: ParkingSpot) {
    if (spot.latitude === null || spot.longitude === null) {
      return;
    }

    const destination = `${spot.latitude},${spot.longitude}`;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        destination
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950">
            P
          </div>

          <p className="text-sm text-slate-400">
            Loading your handovers...
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

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
          <a href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              P
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-none">
                Park Habibi
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                Leaving a spot
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

        <section className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Leaver mode
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Post your
              <span className="block text-emerald-400">
                parking handover.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Share when you are leaving. Before reservation, drivers
              receive only an approximate location. Your exact pin,
              landmark and vehicle details stay private until someone
              reserves.
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

            <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-sm font-bold text-emerald-300">
                Privacy protected
              </p>

              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                The server creates the approximate map pin. An
                unreserved driver cannot retrieve your exact
                coordinates through browser network requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadMySpots()}
              className="mt-5 rounded-2xl border border-slate-800 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Refresh updates
            </button>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
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
                    placeholder="Example: Shabia 10"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <ParkingLocationPicker
                  value={parkingCoordinates}
                  onChange={handleLocationChange}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Exact landmark
                  </label>

                  <input
                    type="text"
                    value={landmark}
                    onChange={(event) =>
                      setLandmark(event.target.value)
                    }
                    placeholder="Example: Near Lulu entrance, behind the mosque"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This is stored privately and shown only to the
                    driver who reserves your handover.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Leaving time
                  </label>

                  <select
                    value={leavingIn}
                    onChange={(event) =>
                      setLeavingIn(event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                  >
                    <option value="Now">Now</option>
                    <option value="In 5 minutes">
                      In 5 minutes
                    </option>
                    <option value="In 10 minutes">
                      In 10 minutes
                    </option>
                    <option value="In 15 minutes">
                      In 15 minutes
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Note
                  </label>

                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional instructions for the reserved driver"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    The note is also hidden until reservation.
                  </p>
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
                  {isPosting
                    ? "Posting securely..."
                    : "Post Live Handover"}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Active
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Your handovers
                  </h2>
                </div>

                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {spots.length} live
                </div>
              </div>

              {spots.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm leading-6 text-slate-400">
                  No active handover yet. Post one when you are ready
                  to leave.
                </div>
              ) : (
                <div className="space-y-4">
                  {spots.map((spot) => {
                    const isBusy = busySpotId === spot.spot_id;

                    return (
                      <div
                        key={spot.spot_id}
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
                              Landmark:{" "}
                              {spot.landmark ||
                                "No landmark provided"}
                            </p>
                          </div>

                          <div className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                            {getStatusText(spot.status)}
                          </div>
                        </div>

                        {spot.note && (
                          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                            <p className="text-sm font-bold text-slate-300">
                              Your note
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {spot.note}
                            </p>
                          </div>
                        )}

                        {spot.looker_car_model && (
                          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                            <p className="text-sm font-bold text-emerald-300">
                              Reserved driver
                            </p>

                            <p className="mt-2 text-sm text-emerald-100/80">
                              {spot.looker_car_color || "Unknown"}{" "}
                              {spot.looker_car_model} · Plate{" "}
                              {spot.looker_plate_number ||
                                "not provided"}
                            </p>
                          </div>
                        )}

                        {spot.status === "available" && (
                          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                            <p className="text-sm leading-6 text-amber-100/70">
                              Drivers can currently see only the
                              approximate area and leaving time.
                            </p>
                          </div>
                        )}

                        {spot.latitude !== null &&
                          spot.longitude !== null && (
                            <button
                              type="button"
                              onClick={() =>
                                openExactLocation(spot)
                              }
                              className="mt-4 w-full rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-400/20"
                            >
                              View your exact pin
                            </button>
                          )}

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {spot.status === "arrived" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateSpotStatus(
                                  spot.spot_id,
                                  "spotted"
                                )
                              }
                              disabled={isBusy}
                              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy
                                ? "Updating..."
                                : "Spotted them"}
                            </button>
                          )}

                          {spot.status === "spotted" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateSpotStatus(
                                  spot.spot_id,
                                  "leaving"
                                )
                              }
                              disabled={isBusy}
                              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy
                                ? "Updating..."
                                : "I’m leaving now"}
                            </button>
                          )}

                          {spot.status === "leaving" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateSpotStatus(
                                  spot.spot_id,
                                  "completed"
                                )
                              }
                              disabled={isBusy}
                              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isBusy
                                ? "Updating..."
                                : "Complete handover"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              updateSpotStatus(
                                spot.spot_id,
                                "cancelled"
                              )
                            }
                            disabled={isBusy}
                            className="rounded-2xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy ? "Updating..." : "Cancel"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="relative mx-auto max-w-6xl border-t border-slate-800 px-6 py-8 text-sm text-slate-500 lg:px-10">
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