// app/math/plus-one/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Controls from "@/components/math/plus-one/Controls";
import ArrayViz from "@/components/math/plus-one/ArrayViz";
import TracePanel from "@/components/math/plus-one/TracePanel";
import CodePanel from "@/components/math/plus-one/CodePanel";
import { generateTrace, PlusOneStep } from "@/components/math/plus-one/generateTrace";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "digits", label: "Digits (comma-separated)", type: "array", placeholder: "e.g. 9,9,9", defaultValue: "9,9,9" },
];

const presetExamples: PresetExample[] = [
  { name: "Example 1: [9,9,9]", values: { digits: "9,9,9" } },
  { name: "Example 2: [1,2,3]", values: { digits: "1,2,3" } },
];

export default function Page() {
  const [trace, setTrace] = useState<PlusOneStep[]>([]);
  const [cursor, setCursor] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    const digits = values.digits.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (digits.length === 0) return;
    const steps = generateTrace(digits);
    setTrace(steps);
    setCursor(0);
    sounds.click();
  }, []);

  useEffect(() => {
    const steps = generateTrace([9, 9, 9]);
    setTrace(steps);
    setCursor(0);
  }, []);

  const stepForward = () => { setCursor((c) => Math.min(c + 1, trace.length - 1)); sounds.tick(); };
  const stepBack = () => { setCursor((c) => Math.max(c - 1, 0)); sounds.tick(); };
  const isDone = cursor === trace.length - 1 && trace.length > 0;

  return (
    <div className="min-h-screen p-6 text-slate-100 grid-pattern">
      <div className="max-w-5xl mx-auto space-y-6">
        <BackButton href="/topics" label="Topics" />

        <h1 className="text-3xl font-extrabold mt-4">
          <span className="text-emerald-400" style={{ textShadow: "0 0 18px rgba(52,211,153,0.8)" }}>Plus One</span> — Visualizer
        </h1>

        <InputPanel fields={inputFields} presets={presetExamples} onRun={handleRun} accentColor="#34d399" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          <div className="space-y-6">
            <Controls stepBack={stepBack} stepForward={stepForward} />
            <ArrayViz trace={trace} cursor={cursor} />
          </div>
          <div className="space-y-6">
            <TracePanel trace={trace} cursor={cursor} />
            <div className="glass-card p-4">
              <CodePanel trace={trace} cursor={cursor} />
            </div>
          </div>
        </div>

        <OutputPanel
          result={isDone && trace[cursor] ? `Result: [${trace[cursor].digits?.join(", ") || "done"}]` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(n)"
          visible={isDone}
        />
      </div>
    </div>
  );
}
