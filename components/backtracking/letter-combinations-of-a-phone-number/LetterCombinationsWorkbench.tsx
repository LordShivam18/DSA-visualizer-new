import DigitKeypad from "./DigitKeypad";
import LegendPill from "../shared/LegendPill";
import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import ResultCloud from "../shared/ResultCloud";
import StatCard from "../shared/StatCard";
import type { LetterCombinationsTraceStep } from "./generateTrace";

export default function LetterCombinationsWorkbench({
  step,
}: {
  step: LetterCombinationsTraceStep;
}) {
  const activePartial =
    step.state.results.length === 0
      ? null
      : step.state.results[step.state.results.length - 1];

  return (
    <PanelShell
      title="Phone Branching Studio"
      subtitle="Each recursion level chooses one letter for one digit, then hands the next slot to the next call."
      accent="cyan"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Digits" value={step.state.digits || "none"} tone="violet" />
        <StatCard
          label="Current Depth"
          value={step.pointers.digitIndex ?? "done"}
          tone="cyan"
        />
        <StatCard
          label="Choices Tried"
          value={step.state.exploredChoices}
          tone="amber"
        />
        <StatCard
          label="Combinations"
          value={step.state.completedCount}
          tone="emerald"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LegendPill label="Cyan: active digit" tone="cyan" />
        <LegendPill label="Purple: digit is in the input" tone="violet" />
        <LegendPill label="Yellow: active letter choice" tone="yellow" />
        <LegendPill label="Green: completed combination" tone="emerald" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-[1.25rem] border border-slate-800/80 bg-[#050916] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Digit Timeline
            </p>
            {step.state.phoneEntries.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                Enter digits from 2 to 9 to unlock the keypad search tree.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {step.state.phoneEntries.map((entry, index) => {
                  const isActive = step.pointers.activeDigit === entry.digit;
                  return (
                    <div
                      key={`${entry.digit}-${index}`}
                      className={`rounded-[1.1rem] border px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "border-cyan-400/60 bg-cyan-500/12 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.16)]"
                          : "border-slate-800/80 bg-slate-950/70 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">
                          Position {index}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs">
                          {entry.digit}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.letters.split("").map((letter) => {
                          const isActiveLetter =
                            isActive && step.pointers.activeLetter === letter;
                          return (
                            <span
                              key={letter}
                              className={`rounded-full border px-3 py-1 font-mono text-xs ${
                                isActiveLetter
                                  ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]"
                                  : "border-violet-400/35 bg-violet-500/10 text-violet-100"
                              }`}
                            >
                              {letter}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Live Combination Buffer
              </p>
              <div className="mt-4 flex min-h-[116px] flex-wrap gap-3 rounded-[1.15rem] border border-slate-800/80 bg-[#050916] p-4">
                {step.state.phoneEntries.length === 0 ? (
                  <span className="text-sm text-slate-500">
                    Waiting for valid phone digits.
                  </span>
                ) : (
                  step.state.phoneEntries.map((entry, index) => {
                    const value = step.state.partial[index] ?? "";
                    const isFilled = Boolean(value);
                    const isActive = step.pointers.digitIndex === index;

                    return (
                      <div
                        key={`${entry.digit}-slot-${index}`}
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold transition-all duration-300 ${
                          isActive
                            ? "border-cyan-400/70 bg-cyan-500/12 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
                            : isFilled
                            ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                            : "border-slate-800/80 bg-slate-950/70 text-slate-600"
                        }`}
                      >
                        {value || "_"}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-200">
                partial = {step.state.partial || '""'}
              </div>
            </div>

            <DigitKeypad
              entries={step.state.phoneEntries}
              activeDigit={step.pointers.activeDigit}
              activeLetter={step.pointers.activeLetter}
            />
          </div>
        </div>

        <div className="space-y-4">
          <RecursionStack
            title="Call Stack"
            emptyLabel="The recursion stack is empty right now."
            frames={step.state.stack.map((frame) => ({
              title:
                frame.digit === null
                  ? `depth ${frame.depth} complete`
                  : `depth ${frame.depth} / digit ${frame.digit}`,
              subtitle:
                frame.digit === null
                  ? `saved ${step.state.partial || "combination"}`
                  : `letters ${frame.letters} | partial "${frame.partial}"`,
              active: frame.status === "active",
              success: frame.status === "complete",
            }))}
          />

          <ResultCloud
            title="Completed Combinations"
            items={step.state.results}
            activeItem={activePartial}
            emptyLabel="Finished combinations will glow here once DFS reaches the base case."
            tone="emerald"
          />
        </div>
      </div>
    </PanelShell>
  );
}
