"use client";

import Link from "next/link";

import { useProgressTracker } from "./hooks/useProgressTracker";

export default function AcademyTopNav({
  currentProblemId,
  inverted = false,
}: {
  currentProblemId?: string;
  inverted?: boolean;
}) {
  const { learner, solvedProblems, totalProblems } = useProgressTracker(currentProblemId);
  const chromeClassName = inverted
    ? "border-white/10 bg-white/6 text-slate-100"
    : "border-white/70 bg-white/80 text-slate-900";
  const mutedTextClassName = inverted ? "text-slate-300" : "text-slate-600";
  const navLinkClassName = inverted
    ? "border-white/10 bg-white/8 text-slate-100 hover:bg-white/14"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  const badgeClassName = inverted
    ? "border-amber-300/40 bg-amber-400/15 text-amber-200"
    : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div
      className={`flex flex-col gap-4 rounded-[1.5rem] border px-5 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl md:flex-row md:items-center md:justify-between ${chromeClassName}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Guided DSA Academy
          </Link>
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] md:text-[10px] ${badgeClassName}`}
          >
            Guided Learning Flow
          </span>
        </div>
        <p className={`mt-2 text-sm ${mutedTextClassName}`}>
          {learner.streakDays}-day streak · {solvedProblems}/{totalProblems} lessons
          solved · {learner.totalStudyMinutes.toFixed(0)} guided minutes logged
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { href: "/", label: "Home" },
          { href: "/topics", label: "Topics" },
          { href: "/dashboard", label: "Dashboard" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${navLinkClassName}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
