import Link from "next/link";

const howItWorks = [
  {
    icon: "📍",
    title: "Share a parking handover",
    description:
      "A driver leaving a parking space shares the approximate area and expected leaving time.",
  },
  {
    icon: "🔎",
    title: "Find a nearby opportunity",
    description:
      "Drivers looking for parking can view available handovers near their destination.",
  },
  {
    icon: "🔒",
    title: "Reserve securely",
    description:
      "The exact location and vehicle details are revealed only after the handover is reserved.",
  },
];

const benefits = [
  {
    icon: "⏱️",
    title: "Save time",
    description:
      "Spend less time repeatedly driving around the same buildings looking for parking.",
  },
  {
    icon: "⛽",
    title: "Save fuel",
    description:
      "Reduce unnecessary driving and the fuel wasted while searching for an available space.",
  },
  {
    icon: "🛡️",
    title: "Privacy protected",
    description:
      "Exact parking and vehicle details remain private until another driver reserves the handover.",
  },
  {
    icon: "🤝",
    title: "Drivers helping drivers",
    description:
      "Park Habibi creates a simple way for drivers leaving to help drivers arriving.",
  },
];

const areas = [
  "Shabia",
  "Mohammed Bin Zayed City",
  "Mussafah",
  "Abu Dhabi",
];

const faqItems = [
  {
    question: "What is Park Habibi?",
    answer:
      "Park Habibi is a live parking handover platform that connects drivers leaving parking spaces with drivers looking for parking in Abu Dhabi.",
  },
  {
    question: "How does Park Habibi work?",
    answer:
      "A driver leaving a parking space shares the approximate area and leaving time. Another driver can reserve the handover and then receive the exact location and vehicle details.",
  },
  {
    question: "Is Park Habibi free?",
    answer:
      "Yes. Park Habibi is currently free for drivers sharing and finding live parking handovers.",
  },
  {
    question: "Does Park Habibi sell parking spaces?",
    answer:
      "No. Park Habibi does not sell, rent, own, reserve, or guarantee public parking spaces. It only helps drivers coordinate a voluntary parking handover.",
  },
  {
    question: "How is my location protected?",
    answer:
      "Before reservation, other users only see an approximate location. The exact parking location and vehicle details are revealed after a reservation is confirmed.",
  },
  {
    question: "Where is Park Habibi available?",
    answer:
      "Park Habibi is starting in Shabia and surrounding areas of Abu Dhabi, including Mohammed Bin Zayed City and Mussafah.",
  },
];

export default function Home() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-180px] top-[220px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              P
            </div>

            <div>
              <p className="text-lg font-bold leading-none">Park Habibi</p>
              <p className="mt-1 text-xs text-slate-500">
                Live parking handovers
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Log in
            </Link>

            <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 sm:inline-flex">
              Abu Dhabi Beta
            </span>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Starting in Shabia, Abu Dhabi
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Find parking in Abu Dhabi{" "}
              <span className="text-emerald-400">without circling.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Park Habibi connects drivers leaving parking spaces with drivers
              looking for one through secure, live parking handovers.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Save time, fuel, and frustration while keeping your exact location
              private until a handover is reserved.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-center text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Find Parking
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-center text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900"
              >
                Share My Spot
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ Free during beta</span>
              <span>✓ Privacy protected</span>
              <span>✓ Built for Abu Dhabi</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/75 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Parking near you
                  </p>
                  <p className="mt-1 text-xl font-black">Live handovers</p>
                </div>

                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  LIVE
                </div>
              </div>

              <div className="relative mt-6 h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:36px_36px]" />

                <div className="absolute left-[22%] top-[28%]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-500 text-lg font-black text-slate-950 shadow-xl shadow-emerald-500/30">
                    P
                  </div>
                </div>

                <div className="absolute right-[20%] top-[20%]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-400 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/30">
                    P
                  </div>
                </div>

                <div className="absolute bottom-[20%] left-[48%]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-500 text-base font-black text-slate-950 shadow-xl shadow-emerald-500/30">
                    P
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">Shabia handover</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Approximate location shown
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950">
                      Reserve
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Exact location and vehicle details unlock only after reservation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 text-center sm:grid-cols-3 sm:px-6 lg:px-10">
          <div>
            <p className="text-2xl font-black text-emerald-400">Live</p>
            <p className="mt-1 text-sm text-slate-500">
              Real-time parking handovers
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-emerald-400">Private</p>
            <p className="mt-1 text-sm text-slate-500">
              Exact details hidden before reservation
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-emerald-400">Local</p>
            <p className="mt-1 text-sm text-slate-500">
              Created for Abu Dhabi drivers
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Parking handovers made simple
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            Park Habibi helps two drivers coordinate at the right place and the
            right time without exposing private details publicly.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7 transition hover:-translate-y-1 hover:border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-500/10 p-3 text-2xl">
                  {item.icon}
                </div>

                <span className="text-sm font-black text-slate-700">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                Why Park Habibi?
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Less searching. More moving.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
                Finding parking in Abu Dhabi can mean driving around the same
                area repeatedly. Park Habibi helps drivers coordinate before a
                space becomes available.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                Areas we serve
              </p>

              <h2 className="mt-4 text-3xl font-black">
                Starting where parking is hardest
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Park Habibi is launching in Shabia and nearby Abu Dhabi areas,
                with expansion planned as the driver community grows.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 font-semibold text-slate-300"
                >
                  <span className="mr-3 text-emerald-400">●</span>
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/30">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-6 lg:py-28">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
              Frequently asked questions
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need to know
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.question}
                  <span className="text-xl text-emerald-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-black sm:text-4xl">
            Stop circling, habibi.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Join drivers helping each other find parking through secure, live
            parking handovers in Abu Dhabi.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Find Parking
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-emerald-500/30 px-8 py-4 font-bold text-white transition hover:bg-emerald-500/10"
            >
              Share My Spot
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
            Important
          </p>

          <p className="mx-auto mt-3 max-w-4xl text-sm leading-7 text-yellow-100/75">
            Park Habibi helps drivers coordinate voluntary parking handovers.
            Users are not buying, selling, renting, owning, or guaranteed public
            parking spaces. Availability remains subject to local parking rules
            and real-world conditions.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-black text-slate-950">
                  P
                </div>
                <p className="font-bold">Park Habibi</p>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Secure live parking handovers for drivers in Abu Dhabi.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <Link href="/login" className="hover:text-emerald-400">
                Log in
              </Link>
              <Link href="/privacy" className="hover:text-emerald-400">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-emerald-400">
                Terms
              </Link>
              <a
                href="mailto:hello@parkhabibi.com"
                className="hover:text-emerald-400"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Park Habibi. Built with love by Torque.
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}