import Link from "next/link";

import BackButton from "../../components/ui/BackButton";
import { getProblemCardsByCategory } from "@/lib/academy/problemRegistry";


const problems = getProblemCardsByCategory("binary-search");

const difficultyStyles = {
  easy: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  hard: "border-rose-400/30 bg-rose-500/10 text-rose-200",
} as const;

export default function BinarySearchTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Binary Search / Ordered Windows / Invariants
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-rose-400 [text-shadow:0_0_18px_rgba(244,63,94,0.55)]">
              Binary Search
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            These visualizers teach the real reason binary search works: every
            step preserves an invariant about where the answer can still live,
            whether the structure is a flat array, a rotated array, duplicate
            boundaries, a matrix, or a partition across two arrays.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.url}
                href={problem.url}
                className="group rounded-[1.3rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:border-rose-400/35 hover:bg-slate-950/70 hover:shadow-[0_0_28px_rgba(244,63,94,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-rose-200">
                        {problem.name}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          difficultyStyles[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      {problem.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-rose-300">
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
