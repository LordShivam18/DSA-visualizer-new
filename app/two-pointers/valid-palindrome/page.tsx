"use client";

import { startTransition, useState } from "react";

import ModeToggle from "@/components/stack/ModeToggle";
import CodePanel from "@/components/two-pointers/valid-palindrome/CodePanel";
import MicroscopeView from "@/components/two-pointers/valid-palindrome/MicroscopeView";
import PalindromeBox from "@/components/two-pointers/valid-palindrome/PalindromeBox";
import {
  generatePalindromeTrace,
  normalizePalindromeInput,
} from "@/components/two-pointers/valid-palindrome/generateTrace";
import BackButton from "@/components/ui/BackButton";
import InputPanel, {
  InputField,
  PresetExample,
} from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import { sounds } from "@/components/ui/SoundManager";

const defaultInput = "A man, a plan, a canal: Panama";

const inputFields: InputField[] = [
  {
    key: "str",
    label: "String to check",
    type: "text",
    placeholder: "e.g. A man, a plan, a canal: Panama",
    defaultValue: defaultInput,
  },
];

const presets: PresetExample[] = [
  {
    name: "Classic Panama",
    values: { str: "A man, a plan, a canal: Panama" },
  },
  {
    name: "Race A Car",
    values: { str: "race a car" },
  },
  {
    name: "No Lemon",
    values: { str: "No lemon, no melon" },
  },
];

type Mode = "beginner" | "expert";

export default function ValidPalindromePage() {
  const [rawInput, setRawInput] = useState(defaultInput);
  const [trace, setTrace] = useState(() => generatePalindromeTrace(defaultInput));
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<Mode>("beginner");

  const step = trace[cursor];
  const cleaned = normalizePalindromeInput(rawInput);
  const isLastStep = cursor === trace.length - 1;
  const explanation =
    mode === "beginner"
      ? step.explanationBeginner
      : step.explanationExpert;

  function handleRun(values: Record<string, string>) {
    const nextRaw = values.str ?? "";
    const nextTrace = generatePalindromeTrace(nextRaw);

    startTransition(() => {
      setRawInput(nextRaw);
      setTrace(nextTrace);
      setCursor(0);
    });

    sounds.click();
  }

  function handleStep() {
    if (isLastStep) {
      return;
    }

    const nextCursor = Math.min(cursor + 1, trace.length - 1);
    const nextStep = trace[nextCursor];
    setCursor(nextCursor);

    if (nextStep.result === true) {
      sounds.success();
      return;
    }

    if (nextStep.result === false) {
      sounds.error();
      return;
    }

    sounds.tick();
  }

  function handleReset() {
    setCursor(0);
    sounds.reset();
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.92),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/two-pointers" label="Two Pointers" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Two Pointers / Live Simulation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Valid{" "}
            <span className="text-cyan-400 text-glow-cyan">Palindrome</span>
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Watch the cleaned string come alive, then follow the left and right
            pointers as each mirrored comparison either validates the palindrome
            or exposes the first mismatch.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <InputPanel
            fields={inputFields}
            presets={presets}
            onRun={handleRun}
            accentColor="#22d3ee"
          />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5">
          <ModeToggle mode={mode} onChange={setMode} />

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-1.5 text-slate-300">
              Raw length:{" "}
              <span className="font-mono text-slate-50">{rawInput.length}</span>
            </span>
            <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-1.5 text-slate-300">
              Cleaned length:{" "}
              <span className="font-mono text-cyan-200">{cleaned.length}</span>
            </span>
            <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-1.5 text-slate-300">
              Step:{" "}
              <span className="font-mono text-slate-50">
                {cursor}/{Math.max(trace.length - 1, 0)}
              </span>
            </span>
            <span
              className={`rounded-full border px-4 py-1.5 ${
                step.result === true
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  : step.result === false
                  ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                  : "border-slate-700/80 bg-slate-950/70 text-slate-300"
              }`}
            >
              Status: {step.statusLabel}
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <PalindromeBox step={step} />
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-5 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          {explanation}
        </div>

        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
          <MicroscopeView step={step} mode={mode} />
          <CodePanel step={step} />
        </section>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleStep}
            disabled={isLastStep}
            className="btn-neon btn-neon-cyan px-7 py-2"
          >
            {isLastStep ? "Complete" : "Step Forward"}
          </button>
          <button onClick={handleReset} className="btn-neon btn-ghost px-7 py-2">
            Reset
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <OutputPanel
            result={
              step.result === true
                ? `"${rawInput}" is a valid palindrome after normalization`
                : step.result === false
                ? `"${rawInput}" is not a valid palindrome after normalization`
                : null
            }
            success={step.result}
            stepCount={cursor}
            complexity="O(n)"
            visible={step.result !== null}
          />
        </div>
      </div>
    </div>
  );
}
