function VerticalCar() {
  return (
    <div className="relative h-36 w-16">
      <div className="absolute left-1/2 top-0 h-36 w-16 -translate-x-1/2 rounded-[1.4rem] bg-slate-100 shadow-xl">
        <div className="absolute left-2 top-5 h-8 w-12 rounded-lg bg-slate-300" />
        <div className="absolute left-2 bottom-5 h-8 w-12 rounded-lg bg-slate-300" />

        <div className="absolute -left-2 top-7 h-5 w-5 rounded-full border-4 border-slate-800 bg-slate-700" />
        <div className="absolute -right-2 top-7 h-5 w-5 rounded-full border-4 border-slate-800 bg-slate-700" />
        <div className="absolute -left-2 bottom-7 h-5 w-5 rounded-full border-4 border-slate-800 bg-slate-700" />
        <div className="absolute -right-2 bottom-7 h-5 w-5 rounded-full border-4 border-slate-800 bg-slate-700" />
      </div>
    </div>
  );
}

function HorizontalCar() {
  return (
    <div className="relative h-20 w-40 animate-car-nudge">
      <div className="absolute left-0 top-5 h-12 w-40 rounded-[1.3rem] bg-emerald-500 shadow-xl shadow-emerald-500/20">
        <div className="absolute left-7 top-3 h-6 w-9 rounded-lg bg-emerald-200/70" />
        <div className="absolute right-7 top-3 h-6 w-9 rounded-lg bg-emerald-200/70" />

        <div className="absolute left-3 top-8 h-5 w-5 rounded-full border-4 border-slate-900 bg-slate-800" />
        <div className="absolute right-3 top-8 h-5 w-5 rounded-full border-4 border-slate-900 bg-slate-800" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute left-[-160px] top-[-160px] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[160px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
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

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Login
            </a>

            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Beta
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-8 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[1fr_0.95fr] lg:px-10 lg:pb-20">
          <div className="animate-fade-up">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              Starting in Shabia, Abu Dhabi
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              No more circling,
              <span className="block text-emerald-400">habibi.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-xl font-semibold text-white">
              Someone&apos;s leaving. You&apos;re arriving.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Find someone leaving a parking spot near you and coordinate a
              smooth handover before anyone else takes it.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/login"
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-center text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                🚗 I&apos;m Leaving
              </a>

              <a
                href="/login"
                className="rounded-2xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-center text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                🔎 I&apos;m Looking
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-3xl font-black text-emerald-400">0</p>
                <p className="mt-2 text-sm text-slate-400">Drivers online</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-3xl font-black text-emerald-400">0</p>
                <p className="mt-2 text-sm text-slate-400">Spots available</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-3xl font-black text-emerald-400">0</p>
                <p className="mt-2 text-sm text-slate-400">Handovers</p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-sm font-semibold text-slate-300">
                Built for real parking chaos.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Park Habibi starts in Shabia, where finding parking at the
                wrong time can mean endless rounds around the same buildings.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl animate-fade-up-delayed">
            <div className="absolute inset-0 rounded-[3rem] bg-emerald-500/10 blur-3xl" />

            <div className="relative animate-float overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Park Habibi Live
                  </p>
                  <p className="mt-2 text-xl font-bold">Shabia handover</p>
                </div>

                <div className="animate-soft-pulse rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                  5 min
                </div>
              </div>

              <div className="relative h-[480px] overflow-hidden rounded-[2.4rem] border border-slate-800 bg-slate-950 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(16,185,129,0.24),transparent_34%)]" />

                <div className="absolute left-8 top-8 z-20">
                  <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                    Leaving
                  </div>

                  <div className="relative flex h-60 w-36 flex-col items-center rounded-[1.8rem] border border-dashed border-slate-600 bg-slate-900/60 p-4 shadow-xl">
                    <div className="absolute inset-3 rounded-[1.3rem] border border-slate-800" />

                    <VerticalCar />

                    <div className="mt-auto text-center">
                      <p className="text-sm font-bold text-white">White SUV</p>
                      <p className="mt-1 text-xs text-slate-400">Near Lulu</p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-12 top-36 z-20">
                  <div className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                    Arriving
                  </div>

                  <div className="rounded-[1.8rem] border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-xl backdrop-blur">
                    <HorizontalCar />

                    <div className="mt-2">
                      <p className="text-sm font-bold text-white">
                        Green sedan
                      </p>
                      <p className="mt-1 text-xs text-slate-400">250m away</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-24 left-8 right-8 h-24 rounded-[2rem] border border-slate-800 bg-slate-900/80">
                  <div className="absolute left-6 right-6 top-1/2 h-[2px] -translate-y-1/2 bg-[repeating-linear-gradient(to_right,rgba(148,163,184,0.5)_0,rgba(148,163,184,0.5)_28px,transparent_28px,transparent_48px)]" />
                </div>

                <div className="absolute bottom-32 right-8 z-0">
                  <div className="h-36 w-3 rounded-full bg-slate-500" />
                  <div className="absolute -right-8 top-8 h-2 w-14 rounded-full bg-slate-500" />
                  <div className="absolute -right-12 top-5 h-10 w-10 animate-lamp-glow rounded-b-2xl rounded-t-md border border-emerald-300/40 bg-emerald-300/20 shadow-[0_0_70px_rgba(16,185,129,0.45)]" />
                  <div className="absolute -right-24 -top-8 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
                  <div className="absolute -right-16 top-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
                </div>

                <div className="absolute bottom-7 left-1/2 z-30 w-[78%] -translate-x-1/2 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 font-bold">
                        Smooth handover in progress
                      </p>
                    </div>

                    <div className="h-3 w-3 animate-status-dot rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-2xl">📍</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Post location
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-2xl">⏱️</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Wait 5 mins
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:-translate-y-1 hover:border-emerald-500/30">
                <p className="text-2xl">🤝</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Handover
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Parking handovers made simple
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-emerald-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🔐
              </div>
              <h2 className="mt-5 text-xl font-bold">Login first</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create a driver account so handovers are safer and controlled.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-emerald-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🚗
              </div>
              <h2 className="mt-5 text-xl font-bold">Choose your mode</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select whether you&apos;re leaving a spot or looking for one
                right now.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-emerald-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🤝
              </div>
              <h2 className="mt-5 text-xl font-bold">Confirm handover</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Details unlock after reservation, then both drivers confirm the
                handover.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
              Important
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Park Habibi helps drivers coordinate parking handovers. Users are
              not buying, selling, or owning public parking spaces. The platform
              is built around timing, communication, and convenience.
            </p>
          </div>
        </section>

        <footer className="mx-auto max-w-7xl border-t border-slate-800 px-6 py-8 text-sm text-slate-500 lg:px-10">
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