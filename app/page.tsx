"use client";

import Link from "next/link";

import AcademyTopNav from "@/components/academy/AcademyTopNav";
import { useProgressTracker } from "@/components/academy/hooks/useProgressTracker";
import ParticleBackground from "@/components/ui/ParticleBackground";

const valuePillars = [
  {
    title: "Why + Narrative",
    body: "Each step now teaches the invariant, contrasts the tempting alternative, and stages focus, explanation, and animation in sequence.",
  },
  {
    title: "Mistake Detection",
    body: "Incorrect next-step reasoning is diagnosed in context so learners repair the exact mental move that failed.",
  },
  {
    title: "Replay + Path",
    body: "Random cases, edge cases, and guided next problems keep one lesson turning into a daily learning loop.",
  },
];

export default function Home() {
  const { learner, solvedProblems, totalProblems, averageAccuracy, recommendations } =
    useProgressTracker();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09111f] text-slate-100">
      <ParticleBackground density={55} speed={0.28} color="59, 130, 246" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_22%),linear-gradient(180deg,#07101d_0%,#0b1527_48%,#09111f_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:58px_58px] opacity-45" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6">
        <AcademyTopNav inverted />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-[0_24px_80px_rgba(2,8,23,0.45)] backdrop-blur-xl md:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">
              Guided DSA Learning Platform
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Turn every trace into a daily guided DSA habit
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The visualizer foundation is still here, but the learning layer now
              pushes for depth and retention: dynamic why panels, mistake-aware
              prediction checkpoints, pattern recognition, replay variations, and
              next-step guidance on top of the same trace engine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/array-string/best-time-to-buy-and-sell-stock-ii"
                className="rounded-[1rem] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_36px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5"
              >
                Launch flagship lesson
              </Link>
              <Link
                href="/dashboard"
                className="rounded-[1rem] border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/12"
              >
                View learner dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Solved",
                  value: `${solvedProblems}/${totalProblems}`,
                  detail: "tracked lessons",
                },
                {
                  label: "Accuracy",
                  value: `${averageAccuracy}%`,
                  detail: "blended score",
                },
                {
                  label: "Streak",
                  value: `${learner.streakDays} days`,
                  detail: "persistent study habit",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-[2rem] border border-orange-300/20 bg-orange-400/10 p-6 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-orange-200/80">
                What keeps learners coming back
              </p>
              <div className="mt-5 space-y-3">
                {valuePillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {pillar.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">
                Adaptive next step
              </p>
              {recommendations[0] ? (
                <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-4">
                  <p className="text-lg font-semibold text-white">
                    {recommendations[0].title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {recommendations[0].reason}
                  </p>
                  <Link
                    href={recommendations[0].route}
                    className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-400/16"
                  >
                    Continue learning
                  </Link>
                </div>
              ) : (
                <div className="mt-5 rounded-[1.2rem] border border-dashed border-white/12 bg-white/4 px-4 py-5 text-sm text-slate-400">
                  Recommendations appear after your first scored session.
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
              Learning System
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Reusable lesson intelligence panels wired into the shared LessonShell",
                "Pattern coaching, mistake feedback, and guided next-step recommendations from the registry",
                "Replay variations that turn one trace into edge-case and random-case transfer reps",
                "Narrative step flow that stages focus, explanation, and animation instead of passive playback",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.15rem] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-6 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-7 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
              Current flagship
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              Best Time to Buy and Sell Stock II
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The stock-II lesson now demonstrates the full guided loop: why
              coaching, mistake-aware prediction, replay variations, pattern cues,
              and adaptive next-step guidance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/array-string/best-time-to-buy-and-sell-stock-ii"
                className="rounded-full border border-white/12 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/12"
              >
                Launch flagship lesson
              </Link>
              <Link
                href="/topics"
                className="rounded-full border border-white/12 bg-white/4 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10"
              >
                Browse all topics
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
