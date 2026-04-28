import Link from "next/link";

import DarkBackLink from "../../components/array-string/shared/DarkBackLink";
import { arrayStringProblems } from "../../components/array-string/shared/problemMeta";

export default function ArrayStringTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.1),transparent_22%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <DarkBackLink href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Array / String / Guided Learning Track
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">Array / String</span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Explore greedy scans, Roman numeral transforms, string packing,
            substring search, whitespace normalization, and other array/string
            patterns through guided lesson flows built on top of the original
            visualizer engine.
          </p>
        </header>

        <section className="glass-card rounded-[1.75rem] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Flagship Guided Lesson
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">
                Best Time to Buy and Sell Stock II
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                This lesson now includes dynamic why coaching, mistake detection,
                replay variations, pattern guidance, and adaptive next-step
                recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/array-string/best-time-to-buy-and-sell-stock-ii"
                className="rounded-[1rem] border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition-all hover:-translate-y-0.5 hover:bg-cyan-400/16"
              >
                Open guided lesson
              </Link>
              <Link
                href="/dashboard"
                className="rounded-[1rem] border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-slate-500"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-[1.75rem] p-6">
          <div className="grid gap-4">
            {arrayStringProblems.map((problem) => (
              <Link
                key={problem.slug}
                href={`/array-string/${problem.slug}`}
                className="group rounded-[1.35rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-slate-950/75 hover:shadow-[0_0_32px_rgba(34,211,238,0.1)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-50 transition-colors group-hover:text-cyan-300">
                        {problem.title}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          problem.difficulty === "Easy"
                            ? "badge-easy"
                            : problem.difficulty === "Medium"
                            ? "badge-medium"
                            : "badge-hard"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      {problem.description}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {problem.taxonomy}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-400 transition-colors group-hover:text-cyan-300">
                    <span>
                      {problem.slug === "best-time-to-buy-and-sell-stock-ii"
                        ? "Open guided lesson"
                        : "Open lesson"}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M6.75 4.5L11.25 9L6.75 13.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
