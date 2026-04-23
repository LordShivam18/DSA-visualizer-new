import Link from "next/link";

import BackButton from "../../components/ui/BackButton";

const problems = [
  {
    name: "Letter Combinations of a Phone Number",
    url: "/backtracking/letter-combinations-of-a-phone-number",
    difficulty: "medium",
    description:
      "Expand each digit into its mapped letters and watch DFS stitch one letter per position into complete phone words.",
  },
  {
    name: "Combinations",
    url: "/backtracking/combinations",
    difficulty: "medium",
    description:
      "Grow a size-k subset in increasing order so backtracking never produces duplicates or out-of-order picks.",
  },
  {
    name: "Permutations",
    url: "/backtracking/permutations",
    difficulty: "medium",
    description:
      "Place unused numbers into the next slot until every position is filled and one full arrangement is complete.",
  },
  {
    name: "Combination Sum",
    url: "/backtracking/combination-sum",
    difficulty: "medium",
    description:
      "Reuse the current candidate as long as the remaining target stays non-negative, then backtrack when a branch overshoots.",
  },
  {
    name: "N-Queens II",
    url: "/backtracking/n-queens-ii",
    difficulty: "hard",
    description:
      "Place one queen per row while columns and diagonals act like live constraints that prune unsafe branches instantly.",
  },
  {
    name: "Generate Parentheses",
    url: "/backtracking/generate-parentheses",
    difficulty: "medium",
    description:
      "Build valid strings one bracket at a time while the open-close balance prevents broken prefixes from surviving.",
  },
  {
    name: "Word Search",
    url: "/backtracking/word-search",
    difficulty: "medium",
    description:
      "Try every matching start cell, walk four directions, and backtrack the path whenever the next character cannot be extended.",
  },
] as const;

const difficultyStyles = {
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  hard: "border-rose-400/30 bg-rose-500/10 text-rose-200",
} as const;

export default function BacktrackingTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Backtracking / Recursive Search / Constraint Pruning
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-emerald-300 [text-shadow:0_0_18px_rgba(52,211,153,0.55)]">
              Backtracking
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            These visualizers focus on reversible decisions: choose, recurse,
            inspect the branch, and then undo the move so the search can try the
            next possibility without carrying stale state forward.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.url}
                href={problem.url}
                className="group rounded-[1.3rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:border-emerald-300/35 hover:bg-slate-950/70 hover:shadow-[0_0_28px_rgba(52,211,153,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-emerald-100">
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

                  <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-emerald-200">
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
