"use client";

import { useEffect, useState } from "react";

const onboardingSteps = [
  "This is the problem. We'll solve it together.",
  "Watch how the algorithm moves step-by-step.",
  "Try predicting what happens next.",
];

export default function LessonOnboardingOverlay({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timers = [
      window.setTimeout(() => setActiveStep(1), 1400),
      window.setTimeout(() => setActiveStep(2), 2800),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end p-4 sm:p-6">
      <div className="w-full rounded-[1.6rem] border border-slate-200/80 bg-white/94 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Guided start
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              The lesson will get out of the way after your first move.
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="pointer-events-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-cyan-200 hover:text-cyan-700"
          >
            Start
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {onboardingSteps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <div
                key={step}
                className={`rounded-[1.15rem] border px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "border-cyan-200 bg-cyan-50 text-cyan-900"
                    : isComplete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-slate-50/90 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/80 bg-white/90 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6">{step}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
