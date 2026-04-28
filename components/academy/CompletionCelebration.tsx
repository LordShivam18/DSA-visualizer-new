"use client";

import StreakBadge from "./StreakBadge";

export default function CompletionCelebration({
  open,
  streakDays,
}: {
  open: boolean;
  streakDays: number;
}) {
  if (!open) {
    return null;
  }

  return (
    <section className="lesson-celebration-shell w-full max-w-sm rounded-[1.5rem] border border-emerald-200 bg-white/96 p-4 text-slate-900 shadow-[0_30px_80px_rgba(16,185,129,0.16)] backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="lesson-celebration-orb flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-300 to-emerald-500 text-2xl font-semibold text-white shadow-[0_0_0_10px_rgba(16,185,129,0.08)]">
          <span className="lesson-celebration-check">✓</span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Lesson complete
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">
            You closed the loop on this problem.
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nice work. The reasoning path is fresh right now, so this is the best
            moment to carry it into the next rep.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StreakBadge
          days={Math.max(streakDays, 0)}
          tone="celebration"
          compact
        />
        <p className="text-sm leading-6 text-slate-600">
          Come back tomorrow to keep your streak alive 🔥
        </p>
      </div>
    </section>
  );
}
