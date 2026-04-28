import Link from "next/link";

import BackButton from "../../components/ui/BackButton";
import { getProblemCardsByCategory } from "@/lib/academy/problemRegistry";


const problems = getProblemCardsByCategory("graph-bfs");

const diffColors = {
  easy: {
    badge: "badge-easy",
    glow: "hover:shadow-[0_0_25px_rgba(52,211,153,0.15)]",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  medium: {
    badge: "badge-medium",
    glow: "hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
  },
  hard: {
    badge: "badge-hard",
    glow: "hover:shadow-[0_0_25px_rgba(251,113,133,0.15)]",
    border: "border-rose-500/20 hover:border-rose-500/40",
  },
};

export default function GraphBFSTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Graph BFS / Shortest Path / Layered Search
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 [text-shadow:0_0_18px_rgba(34,211,238,0.55)]">
              Graph BFS
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            These visualizers show breadth-first search when the graph is not a
            plain adjacency list: board jumps, genetic mutation states, and
            word transformations all become layered shortest-path stories.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => {
              const colors = diffColors[problem.difficulty];

              return (
                <Link
                  key={problem.url}
                  href={problem.url}
                  className={`group rounded-[1.3rem] border bg-slate-950/55 p-5 transition-all duration-300 hover:bg-slate-950/70 ${colors.border} ${colors.glow}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                          {problem.name}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${colors.badge}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                        {problem.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-cyan-300">
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
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
