import Link from "next/link";

import LightBackLink from "@/components/array-string/shared/LightBackLink";

import type { DpProblemMeta } from "./types";

export default function CategoryPage({
  title,
  eyebrow,
  description,
  problems,
}: {
  title: string;
  eyebrow: string;
  description: string;
  problems: DpProblemMeta[];
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcfdff_0%,#f4f8ff_44%,#f8f1ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(110,231,183,0.18),transparent_30%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full">
          <LightBackLink href="/topics" label="Topics" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>
        </header>

        <section className="rounded-[1.75rem] border border-white/72 bg-white/72 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Link
                key={problem.slug}
                href={problem.route}
                className="group rounded-[1.35rem] border border-slate-200 bg-white/78 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_46px_rgba(14,165,233,0.1)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-slate-900 transition-colors group-hover:text-sky-700">
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
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {problem.taxonomy}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors group-hover:text-sky-700">
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
