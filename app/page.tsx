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

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:min-h-[calc(100vh-92px)] lg:px-10 lg:pb-20">
          <div className="max-w-3xl animate-fade-up">
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