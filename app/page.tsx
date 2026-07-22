export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
          Starting in Shabia, Abu Dhabi
        </div>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          SpotSwap
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-300">
          Find someone leaving a parking spot near you and coordinate a smooth
          handover before anyone else takes it.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-4 sm:max-w-md sm:flex-row">
          <a
            href="/leaving"
            className="flex-1 rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            🚗 I&apos;m Leaving
          </a>

          <a
            href="/looking"
            className="flex-1 rounded-2xl border border-slate-700 px-6 py-4 font-semibold text-white transition hover:bg-slate-900"
          >
            🔍 I&apos;m Looking
          </a>
        </div>

        <div className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="mt-1 text-sm text-slate-400">Drivers online</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="mt-1 text-sm text-slate-400">Spots available</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="mt-1 text-sm text-slate-400">Swaps today</p>
          </div>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Built for busy parking areas, starting with Shabia.
        </p>
      </section>
    </main>
  );
}