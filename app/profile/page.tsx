"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  car_model: string;
  car_color: string;
  plate_number: string;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  async function loadUserAndProfile() {
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

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUserId)
      .maybeSingle();

    if (error) {
      alert("Could not load profile: " + error.message);
      setIsLoading(false);
      return;
    }

    if (data) {
      const profile = data as Profile;

      setCarModel(profile.car_model);
      setCarColor(profile.car_color);
      setPlateNumber(profile.plate_number);
    }

    setIsLoading(false);
  }

  async function saveProfile() {
    if (!carModel.trim()) {
      alert("Please enter your car model.");
      return;
    }

    if (!carColor.trim()) {
      alert("Please enter your car color.");
      return;
    }

    if (!plateNumber.trim()) {
      alert("Please enter your plate number.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      car_model: carModel.trim(),
      car_color: carColor.trim(),
      plate_number: plateNumber.trim(),
    });

    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    localStorage.setItem(
      "park_habibi_profile",
      JSON.stringify({
        carModel: carModel.trim(),
        carColor: carColor.trim(),
        plateNumber: plateNumber.trim(),
      })
    );

    setMessage("Car profile saved.");
    window.location.href = "/mode";
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("park_habibi_profile");
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

        <section className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="animate-fade-up">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Car profile
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Tell us your
              <span className="block text-emerald-400">car.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              No names. No profile photos. Your car details help the other
              driver identify you during a confirmed handover.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-sm font-bold text-slate-300">
                What is shown?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your car model, color, and plate number are shown only when
                needed for the handover flow.
              </p>
            </div>
          </div>

          <div className="animate-fade-up-delayed rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Driver details
              </p>
              <h2 className="mt-2 text-2xl font-black">Your vehicle</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                These details are saved securely in Supabase.
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                Loading profile...
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Car model
                  </label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(event) => setCarModel(event.target.value)}
                    placeholder="Example: Pajero"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Car color
                  </label>
                  <input
                    type="text"
                    value={carColor}
                    onChange={(event) => setCarColor(event.target.value)}
                    placeholder="Example: White"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Plate number only
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(event) => setPlateNumber(event.target.value)}
                    placeholder="Example: 43827"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    No plate code needed for MVP.
                  </p>
                </div>

                {message && (
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
                    {message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={isSaving}
                  className={`w-full rounded-2xl px-6 py-4 font-bold transition ${
                    isSaving
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "bg-emerald-500 text-slate-950 hover:-translate-y-0.5 hover:bg-emerald-400"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save and Continue"}
                </button>
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