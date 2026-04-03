// app/linked-list/rotate-list/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { generateTrace, RotateListStep } from "@/components/linked-list/rotate-list/generateTrace";
import LinkedListTrack from "@/components/linked-list/rotate-list/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/rotate-list/MicroscopeView";
import TracePanel from "@/components/linked-list/rotate-list/TracePanel";
import CodePanel from "@/components/linked-list/rotate-list/CodePanel";
import Controls from "@/components/linked-list/rotate-list/Controls";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nodes", label: "Node values (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,4,5", defaultValue: "1,2,3,4,5" },
  { key: "k", label: "Rotate by k positions", type: "number", placeholder: "e.g. 2", defaultValue: "2" },
];

const presetExamples: PresetExample[] = [
  { name: "Example 1: [1..5], k=2", values: { nodes: "1,2,3,4,5", k: "2" } },
  { name: "Example 2: [0,1,2], k=4", values: { nodes: "0,1,2", k: "4" } },
];

export default function Page() {
  const [trace, setTrace] = useState<RotateListStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const handleRun = useCallback((values: Record<string, string>) => {
    const arr = values.nodes.split(",").map((v) => Number(v.trim())).filter((n) => !isNaN(n));
    const k = parseInt(values.k) || 2;
    if (arr.length === 0) return;
    const steps = generateTrace(arr, k);
    setTrace(steps);
    setCursor(0);
    sounds.click();
  }, []);

  useEffect(() => {
    const steps = generateTrace([1, 2, 3, 4, 5], 2);
    setTrace(steps);
    setCursor(0);
  }, []);

  const step = trace[cursor];
  const canPrev = cursor > 0;
  const canNext = trace.length > 0 && cursor < trace.length - 1;
  const isDone = cursor === trace.length - 1 && trace.length > 0;

  return (
    <div className="min-h-screen grid-pattern text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton href="/linked-list" label="Linked List" />

        <h1 className="text-3xl font-extrabold mt-4">
          <span className="text-cyan-400 text-glow-cyan">Rotate</span> List
        </h1>

        <InputPanel fields={inputFields} presets={presetExamples} onRun={handleRun} accentColor="#22d3ee" />

        <Controls
          prev={() => { setCursor((c) => Math.max(0, c - 1)); sounds.tick(); }}
          next={() => { setCursor((c) => Math.min(trace.length - 1, c + 1)); sounds.tick(); }}
          reset={() => { setCursor(0); sounds.reset(); }}
          canPrev={canPrev}
          canNext={canNext}
          mode={mode}
          setMode={setMode}
        />

        {step && (
          <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
            <div className="space-y-4">
              <LinkedListTrack step={step} />
              <MicroscopeView step={step} mode={mode} />
            </div>
            <div className="space-y-4">
              <TracePanel step={step} />
              <CodePanel step={step} />
            </div>
          </div>
        )}

        <OutputPanel
          result={isDone ? `Rotation complete` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(n)"
          visible={isDone}
        />
      </div>
    </div>
  );
}
