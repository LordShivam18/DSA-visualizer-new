"use client";

import Link from "next/link";

import { academyProblemCatalog, topicCatalog } from "@/lib/academy/catalog";

import { lightPanelClassName } from "../array-string/shared/ui";
import AdaptiveRecommendationRail from "./AdaptiveRecommendationRail";
import AcademyTopNav from "./AcademyTopNav";
import { useProgressTracker } from "./hooks/useProgressTracker";

function formatMinutes(milliseconds: number) {
  return Math.max(1, Math.round(milliseconds / 60000));
}

export default function AcademyDashboard() {
  const {
    learner,
    recommendations,
    recentSessions,
    weakTopics,
    solvedProblems,
    totalProblems,
    averageAccuracy,
  } = useProgressTracker();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf0] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent_20%),linear-gradient(180deg,#fffaf2_0%,#fff4e7_48%,#fffaf7_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(180,83,9,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(180,83,9,0.05)_1px,transparent_1px)] bg-[size:52px_52px] opacity-50" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
        <AcademyTopNav />

        <header className={`${lightPanelClassName} overflow-hidden p-6 md:p-8`}>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                Learner Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Production-ready study analytics for a paid DSA platform
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                This dashboard turns isolated visualizer sessions into a trackable
                learning product: completion rates, weak-topic detection, recent
                interview rounds, and adaptive next-step recommendations.
              </p>
            </div>

            <Link
              href="/array-string/best-time-to-buy-and-sell-stock-ii"
              className="rounded-[1.15rem] border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-cyan-200"
            >
              Resume flagship lesson
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              {
                label: "Solved Problems",
                value: `${solvedProblems}/${totalProblems}`,
                detail: "Completion coverage across the academy catalog",
              },
              {
                label: "Average Accuracy",
                value: `${averageAccuracy}%`,
                detail: "Blended across prediction, practice, and interview sessions",
              },
              {
                label: "Study Streak",
                value: `${learner.streakDays} days`,
                detail: "Daily engagement is persisted in learner state",
              },
              {
                label: "Guided Minutes",
                value: `${learner.totalStudyMinutes.toFixed(0)}`,
                detail: "Backend-ready time tracking for retention and billing logic",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.2rem] border border-slate-200 bg-slate-50/80 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <section className="space-y-5">
            <section className={`${lightPanelClassName} p-5`}>
              <div className="flex items-center gap-3">
                <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Topic Breakdown
                  </h2>
                  <p className="text-sm text-slate-500">
                    Low mastery and hint-heavy sessions automatically surface weak tracks.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {topicCatalog.map((topic) => {
                  const topicProgress = weakTopics.find(
                    (item) => item.topicId === topic.id
                  );
                  const mastery = topicProgress?.mastery ?? 0;
                  const accuracy = topicProgress?.accuracy ?? 0;

                  return (
                    <div
                      key={topic.id}
                      className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {topic.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{topic.summary}</p>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <div>Mastery {mastery}%</div>
                          <div>Accuracy {Math.round(accuracy)}%</div>
                        </div>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full border border-slate-200 bg-white">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-cyan-500"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={`${lightPanelClassName} p-5`}>
              <div className="flex items-center gap-3">
                <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Sessions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Every evaluated attempt is persisted with mode-specific analytics.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {recentSessions.length === 0 ? (
                  <div className="rounded-[1.15rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No sessions logged yet. Start the flagship lesson to generate learner analytics.
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {session.problemTitle}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {session.mode} · {new Date(session.endedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <div>{session.evaluation.finalScore}/100 final score</div>
                          <div>{formatMinutes(session.durationMs)} min</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            label: "Accuracy",
                            value: `${session.evaluation.accuracy}%`,
                          },
                          {
                            label: "Efficiency",
                            value: `${session.evaluation.efficiencyScore}%`,
                          },
                          {
                            label: "Confidence",
                            value: `${session.evaluation.confidenceScore}%`,
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-[1rem] border border-white/80 bg-white px-3 py-3"
                          >
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              {item.label}
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </section>

          <aside className="space-y-5">
            <AdaptiveRecommendationRail items={recommendations} />

            <section className={`${lightPanelClassName} p-5`}>
              <div className="flex items-center gap-3">
                <span className="h-4 w-1.5 rounded-full bg-amber-400" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Catalog Coverage
                  </h2>
                  <p className="text-sm text-slate-500">
                    The academy model is reusable across all existing lessons.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {academyProblemCatalog.slice(0, 6).map((problem) => (
                  <Link
                    key={problem.problemId}
                    href={problem.route}
                    className="block rounded-[1rem] border border-slate-200 bg-slate-50/80 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {problem.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {problem.topicLabel} · {problem.difficulty}
                        </p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {problem.estimatedMinutes}m
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
