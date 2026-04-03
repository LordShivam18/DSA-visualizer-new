// app/linked-list/remove-nth/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { generateTrace, RemoveNthStep } from "@/components/linked-list/remove-nth/generateTrace";
import LinkedListTrack from "@/components/linked-list/remove-nth/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/remove-nth/MicroscopeView";
import TracePanel from "@/components/linked-list/remove-nth/TracePanel";
import CodePanel from "@/components/linked-list/remove-nth/CodePanel";
import Controls from "@/components/linked-list/remove-nth/Controls";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nodes", label: "Node values (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,4,5", defaultValue: "1,2,3,4,5" },
  { key: "n", label: "N (remove nth from end)", type: "number", placeholder: "e.g. 2", defaultValue: "2" },
];

const presets: PresetExample[] = [
  { name: "Example 1: [1..5], n=2", values: { nodes: "1,2,3,4,5", n: "2" } },
  { name: "Example 2: [1,2], n=1", values: { nodes: "1,2", n: "1" } },
];

export default function Page() {
  const [trace, setTrace] = useState<RemoveNthStep[]>([]);
  const [cursor, setCursor] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    const arr = values.nodes.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    const n = parseInt(values.n) || 2;
    if (arr.length === 0) return;
    const steps = generateTrace(arr, n);
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
  const isDone = cursor === trace.length - 1 && trace.length > 0;

  return (
    <div className="min-h-screen grid-pattern text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton href="/linked-list" label="Linked List" />

        <h1 className="text-3xl font-extrabold mt-4">
          Remove <span className="text-cyan-400 text-glow-cyan">Nth Node</span> From End
        </h1>

        <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#22d3ee" />

        <Controls
          prev={() => { setCursor((c) => Math.max(0, c - 1)); sounds.tick(); }}
          next={() => { setCursor((c) => Math.min(trace.length - 1, c + 1)); sounds.tick(); }}
          reset={() => { setCursor(0); sounds.reset(); }}
          canPrev={cursor > 0}
          canNext={cursor < trace.length - 1}
        />

        {step && (
          <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
            <div className="space-y-4">
              <LinkedListTrack step={step} />
              <MicroscopeView step={step} />
            </div>
            <div className="space-y-4">
              <TracePanel step={step} />
              <CodePanel step={step} />
            </div>
          </div>
        )}

        <OutputPanel
          result={isDone && step ? `Result: [${step.list?.join(", ") || "completed"}]` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(n)"
          visible={isDone}
        />
      </div>
    </div>
  );
}
