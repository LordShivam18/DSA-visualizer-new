// app/linked-list/remove-duplicates-ii/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { generateTrace, RemoveDupIIStep } from "@/components/linked-list/remove-duplicates-ii/generateTrace";
import LinkedListTrack from "@/components/linked-list/remove-duplicates-ii/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/remove-duplicates-ii/MicroscopeView";
import TracePanel from "@/components/linked-list/remove-duplicates-ii/TracePanel";
import CodePanel from "@/components/linked-list/remove-duplicates-ii/CodePanel";
import Controls from "@/components/linked-list/remove-duplicates-ii/Controls";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nodes", label: "Sorted list (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,3,4,4,5", defaultValue: "1,2,3,3,4,4,5" },
];

const presetExamples: PresetExample[] = [
  { name: "Example 1: [1,2,3,3,4,4,5]", values: { nodes: "1,2,3,3,4,4,5" } },
  { name: "Example 2: [1,1,1,2,3]", values: { nodes: "1,1,1,2,3" } },
];

export default function Page() {
  const [trace, setTrace] = useState<RemoveDupIIStep[]>([]);
  const [cursor, setCursor] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    const arr = values.nodes.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (arr.length === 0) return;
    const steps = generateTrace(arr);
    setTrace(steps);
    setCursor(0);
    sounds.click();
  }, []);

  useEffect(() => {
    const steps = generateTrace([1, 2, 3, 3, 4, 4, 5]);
    setTrace(steps);
    setCursor(0);
  }, []);

  const current = trace[cursor];
  const canPrev = cursor > 0;
  const canNext = trace.length > 0 && cursor < trace.length - 1;
  const isDone = cursor === trace.length - 1 && trace.length > 0;

  return (
    <div className="min-h-screen grid-pattern text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton href="/linked-list" label="Linked List" />

        <header className="space-y-2 mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Remove <span className="text-cyan-400 text-glow-cyan">Duplicates</span> II
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Keep only values appearing exactly once in a sorted linked list.
          </p>
        </header>

        <InputPanel fields={inputFields} presets={presetExamples} onRun={handleRun} accentColor="#22d3ee" />

        <Controls
          onPrev={() => { setCursor((c) => Math.max(0, c - 1)); sounds.tick(); }}
          onNext={() => { setCursor((c) => Math.min(trace.length - 1, c + 1)); sounds.tick(); }}
          onReset={() => { setCursor(0); sounds.reset(); }}
          canPrev={canPrev}
          canNext={canNext}
        />

        {current && (
          <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
            <div className="space-y-4">
              <LinkedListTrack step={current} />
              <MicroscopeView step={current} />
            </div>
            <div className="space-y-4">
              <TracePanel step={current} />
              <CodePanel step={current} />
            </div>
          </div>
        )}

        <OutputPanel
          result={isDone && current ? `Completed — duplicates removed` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(n)"
          visible={isDone}
        />
      </div>
    </div>
  );
}
