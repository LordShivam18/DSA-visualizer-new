import Link from "next/link";

import MatrixBackLink from "../../components/matrix/shared/MatrixBackLink";
import { matrixProblems } from "../../components/matrix/shared/problemMeta";

const headingStyle = {
  fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
} as const;

export default function MatrixTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f1e8] text-stone-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_top_right,rgba(142,184,207,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(216,165,90,0.16),transparent_26%),linear-gradient(180deg,#fbf6ef_0%,#f5eee4_52%,#f1e7da_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(161,138,108,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(161,138,108,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute -left-20 top-28 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute -right-24 bottom-6 h-96 w-96 rounded-full bg-[#d8c19d]/25 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <MatrixBackLink href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-500">
            Grids / Simulation / In-place transforms / Constraint systems
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl" style={headingStyle}>
            <span className="bg-gradient-to-r from-[#8a6433] via-[#6487a2] to-[#5f8d78] bg-clip-text text-transparent">
              Matrix
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
            Explore grid algorithms in a brighter studio-style workspace with
            clean boards, structured traces, and the same interactive learning
            controls used across the rest of the visualizer.
          </p>
        </header>

        <section className="rounded-[2rem] border border-[#eadcc8] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,241,0.88))] p-6 shadow-[0_24px_80px_rgba(120,94,56,0.12)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Curated Problem Set
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900" style={headingStyle}>
                Five matrix essentials, one cohesive interface
              </h2>
            </div>
            <div className="rounded-full border border-[#eadcc8] bg-[#fffaf5] px-4 py-2 text-sm text-stone-600">
              {matrixProblems.length} problems
            </div>
          </div>

          <div className="grid gap-4">
            {matrixProblems.map((problem, index) => (
              <Link
                key={problem.slug}
                href={`/matrix/${problem.slug}`}
                className="group rounded-[1.5rem] border border-[#eadcc8] bg-white/88 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d7be98] hover:shadow-[0_22px_60px_rgba(120,94,56,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#eadcc8] bg-[#fffaf5] text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-stone-900 transition-colors group-hover:text-[#6c8aa1]">
                          {problem.title}
                        </h2>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                        {problem.description}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-500">
                        {problem.taxonomy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-stone-500 transition-colors group-hover:text-[#8a6433]">
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
