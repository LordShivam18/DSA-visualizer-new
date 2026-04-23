import Link from "next/link";

import BackButton from "../../components/ui/BackButton";

const problems = [
  {
    name: "Kth Largest Element in an Array",
    url: "/heap/kth-largest-element-in-an-array",
    difficulty: "medium",
    description:
      "Keep a size-k min-heap so only the k largest values survive while smaller extras get pushed back out.",
  },
  {
    name: "IPO",
    url: "/heap/ipo",
    difficulty: "hard",
    description:
      "Sweep projects by capital requirement, load affordable options into a max-heap, and always fund the richest next move.",
  },
  {
    name: "Find K Pairs with Smallest Sums",
    url: "/heap/find-k-pairs-with-smallest-sums",
    difficulty: "medium",
    description:
      "Seed the first column of pair candidates, then keep expanding the cheapest frontier from a min-heap.",
  },
  {
    name: "Find Median from Data Stream",
    url: "/heap/find-median-from-data-stream",
    difficulty: "hard",
    description:
      "Balance a max-heap and a min-heap so the middle of the stream is always available in constant time.",
  },
] as const;

const difficultyStyles = {
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  hard: "border-rose-400/30 bg-rose-500/10 text-rose-200",
} as const;

export default function HeapTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Heap / Priority Queue / Greedy Selection
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-blue-300 [text-shadow:0_0_18px_rgba(96,165,250,0.55)]">
              Heap
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            These visualizers focus on ranked frontier management: which value,
            project, pair, or half of the stream deserves to stay at the top
            of a priority queue right now.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.url}
                href={problem.url}
                className="group rounded-[1.3rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:border-blue-300/35 hover:bg-slate-950/70 hover:shadow-[0_0_28px_rgba(96,165,250,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-blue-100">
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

                  <div className="flex items-center gap-3 text-sm text-slate-500 transition-colors group-hover:text-blue-200">
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
