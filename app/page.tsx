import Link from "next/link";

import LandingArrayPointerDemo from "@/components/academy/LandingArrayPointerDemo";
import {
  getLandingStarterHref,
  getLandingStarterProblem,
  getLandingStarterReason,
} from "@/lib/academy/entryPoints";

const comparisonRows = [
  {
    traditional: "Watch solutions after the fact",
    guided: "Predict the next move before it appears",
  },
  {
    traditional: "Memorize patterns from finished code",
    guided: "Build reasoning from the invariant step-by-step",
  },
  {
    traditional: "Get no diagnosis when a guess is wrong",
    guided: "See why the wrong move failed and how to repair it",
  },
];

const featureHighlights = [
  "Predict the next step",
  "Learn from mistakes",
  "Understand why it works",
];

export default function Home() {
  const starterProblem = getLandingStarterProblem();
  const guidedStartHref = getLandingStarterHref("guided");
  const interactiveDemoHref = getLandingStarterHref("demo");
  const starterReason = getLandingStarterReason();

  return (
    <div className="min-h-screen bg-[#f8f4ec] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_22%),linear-gradient(180deg,#fffdf8_0%,#f6efe3_56%,#f8f4ec_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35" />

        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700"
            >
              Guided DSA Academy
            </Link>
            <span className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              No signup required
            </span>
          </div>

          <div className="max-w-4xl py-16 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Guided learning for interview prep
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Learn DSA by understanding every step - not memorizing solutions.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Interactive visualizations with prediction, mistake feedback, and
              guided learning.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={guidedStartHref}
                className="rounded-xl border border-cyan-200 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.24)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
              >
                Start Learning
              </Link>
              <Link
                href={interactiveDemoHref}
                className="rounded-xl border border-slate-200 bg-white/88 px-6 py-3 text-sm font-semibold text-slate-800 transition-all hover:border-slate-300 hover:bg-white"
              >
                Interactive Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Question first, reveal second",
                "Guided feedback on wrong moves",
                "A next problem ready when you finish",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-slate-200 bg-white/78 px-4 py-4 text-sm leading-6 text-slate-700 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="interactive-demo"
        className="border-b border-slate-200 bg-[#f5efe4]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Live demo
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Watch how the algorithm thinks.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              A beginner lesson should feel interactive immediately, so the preview
              below shows prediction mode and mistake detection on the very first
              array walk.
            </p>
          </div>

          <div className="mt-10">
            <LandingArrayPointerDemo />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Why this is different
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Traditional platforms train recall after the fact. This platform
              trains reasoning while the trace is still alive.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Traditional platforms
              </p>
              <div className="mt-5 space-y-3">
                {comparisonRows.map((row) => (
                  <div
                    key={row.traditional}
                    className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700"
                  >
                    {row.traditional}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-cyan-200 bg-cyan-50/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                This platform
              </p>
              <div className="mt-5 space-y-3">
                {comparisonRows.map((row) => (
                  <div
                    key={row.guided}
                    className="rounded-[1.1rem] border border-cyan-200 bg-white px-4 py-4 text-sm leading-6 text-slate-800"
                  >
                    {row.guided}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f8f4ec]">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Guided entry
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Start learning instantly. We guide you step-by-step.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-700">
            Your first problem is <span className="font-semibold">{starterProblem.title}</span>
            . {starterReason}
          </p>
          <Link
            href={guidedStartHref}
            className="mt-8 inline-flex rounded-xl border border-cyan-200 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.24)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            Start Learning
          </Link>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-4 md:grid-cols-3">
            {featureHighlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <p className="text-lg font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3ecdf]">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Ready to begin
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Start Learning
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700">
            No signup required. Start instantly.
          </p>
          <Link
            href={guidedStartHref}
            className="mt-8 inline-flex rounded-xl border border-cyan-200 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.24)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </div>
  );
}
