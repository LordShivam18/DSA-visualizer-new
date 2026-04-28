import Link from "next/link";

import BackButton from "../../components/ui/BackButton";
import { getProblemCardsByCategory } from "@/lib/academy/problemRegistry";


const problems = getProblemCardsByCategory("sliding-window");

export default function SlidingWindowTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#020711] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.11),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.08),transparent_28%),linear-gradient(180deg,rgba(2,7,17,0.94),rgba(2,7,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Sliding Window / Dynamic Coverage / Pointer Choreography
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="bg-[linear-gradient(135deg,#34d399_0%,#22d3ee_45%,#fde68a_100%)] bg-clip-text text-transparent">
              Sliding Window
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This category focuses on dynamic windows that breathe: expanding,
            contracting, aligning to chunk boundaries, and preserving invariants
            while the window glides through the input.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.url}
                href={problem.url}
                className="group rounded-[1.3rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:border-emerald-400/35 hover:bg-slate-950/70 hover:shadow-[0_0_28px_rgba(52,211,153,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-emerald-200">
                        {problem.name}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          problem.difficulty === "medium"
                            ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-200"
                            : "border-rose-400/30 bg-rose-500/10 text-rose-200"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                      {problem.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-emerald-300">
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
