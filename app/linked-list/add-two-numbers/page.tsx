"use client";

import { useState, useCallback } from "react";
import AddNode from "@/components/linked-list/add-two-numbers/AddNode";
import AddArrow from "@/components/linked-list/add-two-numbers/AddArrow";
import AddPointer from "@/components/linked-list/add-two-numbers/AddPointer";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "l1", label: "List 1 (comma-separated, reversed digits)", type: "array", placeholder: "e.g. 2,4,3", defaultValue: "2,4,3" },
  { key: "l2", label: "List 2 (comma-separated, reversed digits)", type: "array", placeholder: "e.g. 5,6,4", defaultValue: "5,6,4" },
];

const presets: PresetExample[] = [
  { name: "Example 1: 342 + 465", values: { l1: "2,4,3", l2: "5,6,4" } },
  { name: "Example 2: 99 + 1", values: { l1: "9,9", l2: "1" } },
];

export default function AddTwoNumbers() {
  const [l1, setL1] = useState([2, 4, 3]);
  const [l2, setL2] = useState([5, 6, 4]);

  const [i1, setI1] = useState(0);
  const [i2, setI2] = useState(0);
  const [carry, setCarry] = useState(0);
  const [result, setResult] = useState<number[]>([]);
  const [explanation, setExplanation] = useState("Click Step to begin adding.");
  const [stepCount, setStepCount] = useState(0);

  const NODE_GAP = 90;
  const p1Pos = i1 * NODE_GAP;
  const p2Pos = i2 * NODE_GAP;

  const isDone = i1 >= l1.length && i2 >= l2.length && carry === 0 && result.length > 0;

  const handleRun = useCallback((values: Record<string, string>) => {
    const list1 = values.l1.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    const list2 = values.l2.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (list1.length === 0 || list2.length === 0) return;
    setL1(list1);
    setL2(list2);
    setI1(0); setI2(0); setCarry(0); setResult([]); setStepCount(0);
    setExplanation("Click Step to begin adding.");
    sounds.click();
  }, []);

  function step() {
    if (i1 >= l1.length && i2 >= l2.length && carry === 0) return;
    setStepCount((c) => c + 1);

    const x = i1 < l1.length ? l1[i1] : 0;
    const y = i2 < l2.length ? l2[i2] : 0;
    const sum = x + y + carry;
    const digit = sum % 10;
    const newCarry = Math.floor(sum / 10);

    setResult((prev) => [...prev, digit]);
    setExplanation(`${x} + ${y} + carry ${carry} = ${sum} → write ${digit}, carry ${newCarry}`);
    setCarry(newCarry);
    if (i1 < l1.length) setI1(i1 + 1);
    if (i2 < l2.length) setI2(i2 + 1);
    sounds.tick();
  }

  function reset() {
    setI1(0); setI2(0); setCarry(0); setResult([]); setStepCount(0);
    setExplanation("Click Step to begin adding."); sounds.reset();
  }

  const outputResult = isDone ? `Result: [${result.join(" → ")}]` : null;

  return (
    <div className="min-h-screen grid-pattern text-white px-6 py-14 flex flex-col items-center gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/linked-list" label="Linked List" /></div>

      <h1 className="text-5xl font-bold tracking-wide">
        <span className="text-cyan-400 text-glow-cyan">Add</span> Two Numbers
      </h1>

      <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#22d3ee" />

      {/* Visualization */}
      <div className="glass-card p-8">
        <div className="flex flex-col items-center" style={{ minWidth: "360px" }}>
          <div className="relative h-12 w-full mb-3">
            <AddPointer type="p1" position={p1Pos} />
            <AddPointer type="p2" position={p2Pos} />
          </div>

          {/* List 1 */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-cyan-300 mr-2 uppercase tracking-wider">L1</span>
            {l1.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <AddNode value={v} />
                {i < l1.length - 1 && <AddArrow />}
              </div>
            ))}
          </div>

          {/* List 2 */}
          <div className="flex items-center gap-3 opacity-75">
            <span className="text-xs text-violet-300 mr-2 uppercase tracking-wider">L2</span>
            {l2.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <AddNode value={v} />
                {i < l2.length - 1 && <AddArrow />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="glass-card px-6 py-3 text-center max-w-lg text-sm">{explanation}</div>

      {/* Carry indicator */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-slate-400">Carry:</span>
        <span className={`font-mono text-lg font-bold ${carry > 0 ? "text-amber-400" : "text-slate-500"}`}>{carry}</span>
      </div>

      {/* Result row */}
      {result.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-300 mr-2 uppercase tracking-wider">Result</span>
          {result.map((v, i) => <AddNode key={i} value={v} />)}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-6">
        <button onClick={step} disabled={isDone} className="btn-neon btn-neon-cyan px-8 py-3">
          {isDone ? "Done ✅" : "Step →"}
        </button>
        <button onClick={reset} className="btn-neon btn-ghost px-8 py-3">Reset</button>
      </div>

      <OutputPanel result={outputResult} success={isDone ? true : null} stepCount={stepCount} complexity="O(max(m,n))" visible={isDone} />
    </div>
  );
}
