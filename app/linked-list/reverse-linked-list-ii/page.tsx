"use client";

import { useEffect, useState, useCallback } from "react";
import { generateTrace, ReverseIIStep } from "@/components/linked-list/reverse-linked-list-ii/generateTrace";
import LinkedListTrack from "@/components/linked-list/reverse-linked-list-ii/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/reverse-linked-list-ii/MicroscopeView";
import TracePanel from "@/components/linked-list/reverse-linked-list-ii/TracePanel";
import CodePanel from "@/components/linked-list/reverse-linked-list-ii/CodePanel";
import Controls from "@/components/linked-list/reverse-linked-list-ii/Controls";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nodes", label: "Node values (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,4,5", defaultValue: "1,2,3,4,5" },
  { key: "left", label: "Left position", type: "number", placeholder: "e.g. 2", defaultValue: "2" },
  { key: "right", label: "Right position", type: "number", placeholder: "e.g. 4", defaultValue: "4" },
];

const presetExamples: PresetExample[] = [
  { name: "Example 1: [1..5], L=2, R=4", values: { nodes: "1,2,3,4,5", left: "2", right: "4" } },
  { name: "Example 2: [1..7], L=3, R=6", values: { nodes: "1,2,3,4,5,6,7", left: "3", right: "6" } },
];

export default function Page() {
  const [trace, setTrace] = useState<ReverseIIStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const handleRun = useCallback((values: Record<string, string>) => {
    const arr = values.nodes.split(",").map((v) => Number(v.trim())).filter((n) => !isNaN(n));
    const left = parseInt(values.left) || 2;
    const right = parseInt(values.right) || 4;
    if (arr.length === 0) return;
    const steps = generateTrace(arr, left, right);
    setTrace(steps);
    setCursor(0);
    sounds.click();
  }, []);

  useEffect(() => {
    const steps = generateTrace([1, 2, 3, 4, 5], 2, 4);
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
          Reverse Linked List <span className="text-violet-400 text-glow-violet">II</span>
        </h1>

        <InputPanel fields={inputFields} presets={presetExamples} onRun={handleRun} accentColor="#a78bfa" />

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
          result={isDone ? `Reversed positions L→R successfully` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(n)"
          visible={isDone}
        />
      </div>
    </div>
  );
}
