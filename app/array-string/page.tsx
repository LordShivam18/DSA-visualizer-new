import Link from "next/link";

import LightBackLink from "../../components/array-string/shared/LightBackLink";
import { arrayStringProblems } from "../../components/array-string/shared/problemMeta";

export default function ArrayStringTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6fbff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_22%),linear-gradient(180deg,#f8fcff_0%,#eef7ff_54%,#f6fbff_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <LightBackLink href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Array / String / Greedy / In-Place Patterns
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Array / String
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            This light-theme category focuses on compact in-place array
            transformations, greedy frontiers, greedy profit scans, threshold
            reasoning, and dense-array plus hashmap design.
          </p>
        </header>

        <section className="rounded-[1.75rem] border border-white/70 bg-white/88 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl">
          <div className="grid gap-4">
            {arrayStringProblems.map((problem) => (
              <Link
                key={problem.slug}
                href={`/array-string/${problem.slug}`}
                className="group rounded-[1.35rem] border border-slate-200 bg-slate-50/85 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-[0_16px_36px_rgba(34,211,238,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-900 transition-colors group-hover:text-cyan-700">
                        {problem.title}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          problem.difficulty === "Easy"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : problem.difficulty === "Medium"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                      {problem.description}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {problem.taxonomy}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-cyan-700">
                    <span>Open visualizer</span>
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
