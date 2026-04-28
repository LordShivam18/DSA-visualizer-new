"use client";

import type { ProgressiveLearningMode } from "@/lib/academy/progressiveDisclosure";
import { progressiveModeProfiles } from "@/lib/academy/progressiveDisclosure";

import { lightPanelClassName } from "../array-string/shared/ui";

export default function ProgressiveLearningModeToggle({
  value,
  onChange,
}: {
  value: ProgressiveLearningMode;
  onChange: (nextValue: ProgressiveLearningMode) => void;
}) {
  const modes = Object.keys(progressiveModeProfiles) as ProgressiveLearningMode[];

  return (
    <section className={`${lightPanelClassName} p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            UI Depth
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {progressiveModeProfiles[value].label}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {modes.map((mode) => {
          const profile = progressiveModeProfiles[mode];
          const selected = value === mode;

          return (
            <button
              key={mode}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(mode)}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                selected
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-[0_14px_28px_rgba(16,185,129,0.12)]"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span className="text-sm font-semibold">{profile.label}</span>
              <span className="mt-1 block text-xs leading-5 opacity-80">
                {profile.summary}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
