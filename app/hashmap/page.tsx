import Link from "next/link";

import BackButton from "../../components/ui/BackButton";

const problems = [
  {
    name: "Ransom Note",
    url: "/hashmap/ransom-note",
    difficulty: "easy",
    description:
      "Build a character frequency bank from the magazine and spend those counts while the ransom note asks for letters.",
  },
  {
    name: "Isomorphic Strings",
    url: "/hashmap/isomorphic-strings",
    difficulty: "easy",
    description:
      "Maintain two maps so every source character points to exactly one target character and vice versa.",
  },
  {
    name: "Word Pattern",
    url: "/hashmap/word-pattern",
    difficulty: "easy",
    description:
      "Lift the same bijection idea from characters to whole words and validate the sentence pattern step by step.",
  },
  {
    name: "Valid Anagram",
    url: "/hashmap/valid-anagram",
    difficulty: "easy",
    description:
      "Track the frequency difference between two strings and watch every bucket cancel back toward zero.",
  },
  {
    name: "Group Anagrams",
    url: "/hashmap/group-anagrams",
    difficulty: "medium",
    description:
      "Normalize each word into a sorted signature and use that signature as the hash-map key for its bucket.",
  },
  {
    name: "Two Sum",
    url: "/hashmap/two-sum",
    difficulty: "easy",
    description:
      "Compute the missing complement for the current value and ask the hash map whether it was seen earlier.",
  },
  {
    name: "Happy Number",
    url: "/hashmap/happy-number",
    difficulty: "easy",
    description:
      "Use a hash set to detect whether the digit-square process reaches 1 or falls into a cycle.",
  },
  {
    name: "Contains Duplicate II",
    url: "/hashmap/contains-duplicate-ii",
    difficulty: "easy",
    description:
      "Store the latest index for each value, then compare duplicate gaps against k in constant time.",
  },
  {
    name: "Longest Consecutive Sequence",
    url: "/hashmap/longest-consecutive-sequence",
    difficulty: "medium",
    description:
      "Deduplicate into a set, skip non-starts, and expand only predecessor-free runs for linear performance.",
  },
] as const;

export default function HashmapTopicsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <BackButton href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Hashmap / Frequency Counting / Hash Set Reasoning
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">Hashmap</span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            This category teaches why hash-based lookup is powerful: some
            problems become frequency ledgers, some become bijections, some
            become complement search, and some become cycle or membership
            reasoning.
          </p>
        </header>

        <section className="glass-card overflow-hidden p-6">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.url}
                href={problem.url}
                className="group rounded-[1.3rem] border border-slate-800/80 bg-slate-950/55 p-5 transition-all duration-300 hover:border-cyan-400/35 hover:bg-slate-950/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                        {problem.name}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          problem.difficulty === "easy"
                            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                            : "border-yellow-400/30 bg-yellow-500/10 text-yellow-200"
                        }`}
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
