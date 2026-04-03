"use client";

import { useState, useCallback } from "react";
import Node3D from "@/components/kgroup/Node3D";
import ModeToggle from "@/components/kgroup/ModeToggle";
import MicroscopeView from "@/components/kgroup/MicroscopeView";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nodes", label: "Node values (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,4,5,6", defaultValue: "1,2,3,4,5,6" },
  { key: "k", label: "Group size (k)", type: "number", placeholder: "e.g. 3", defaultValue: "3" },
];

const presets: PresetExample[] = [
  { name: "Example 1: [1..6], k=3", values: { nodes: "1,2,3,4,5,6", k: "3" } },
  { name: "Example 2: [1..5], k=2", values: { nodes: "1,2,3,4,5", k: "2" } },
];

type Stage = "scan" | "reverse-loop" | "apply-reverse" | "connect" | "done";
type Mode = "beginner" | "expert";

export default function ReverseKGroup() {
  const [originalNodes, setOriginalNodes] = useState([1, 2, 3, 4, 5, 6]);
  const [K, setK] = useState(3);
  const [nodes, setNodes] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("scan");
  const [loopStep, setLoopStep] = useState(0);
  const [mode, setMode] = useState<Mode>("beginner");
  const [stepCount, setStepCount] = useState(0);

  const totalGroups = Math.floor(nodes.length / K);
  const hasMoreGroups = groupIndex < totalGroups;
  const start = groupIndex * K;
  const end = start + K;
  const currentChunk = nodes.slice(start, end);
  const chunkLen = currentChunk.length;

  const algorithmPhase: "scan" | "reverse" | "connect" | "done" =
    stage === "done" ? "done" : stage === "scan" ? "scan" : stage === "reverse-loop" ? "reverse" : "connect";

  const handleRun = useCallback((values: Record<string, string>) => {
    const nodeVals = values.nodes.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    const k = parseInt(values.k) || 2;
    if (nodeVals.length === 0) return;
    setOriginalNodes([...nodeVals]);
    setK(k);
    setNodes([...nodeVals]);
    setGroupIndex(0); setStage("scan"); setLoopStep(0); setStepCount(0);
    sounds.click();
  }, []);

  function handleStep() {
    if (stage === "done") return;
    setStepCount((c) => c + 1);

    if (!hasMoreGroups) { setStage("done"); sounds.success(); return; }

    switch (stage) {
      case "scan": setStage("reverse-loop"); setLoopStep(0); sounds.tick(); break;
      case "reverse-loop":
        if (loopStep + 1 < chunkLen) { setLoopStep((s) => s + 1); sounds.tick(); }
        else { setStage("apply-reverse"); sounds.push(); }
        break;
      case "apply-reverse":
        setNodes((prev) => {
          const copy = [...prev];
          const reversed = copy.slice(start, end).reverse();
          copy.splice(start, K, ...reversed);
          return copy;
        });
        setStage("connect"); sounds.pop();
        break;
      case "connect":
        if (groupIndex + 1 < totalGroups) {
          setGroupIndex((g) => g + 1); setStage("scan"); setLoopStep(0); sounds.tick();
        } else { setStage("done"); sounds.success(); }
        break;
    }
  }

  function handleReset() {
    setNodes([...originalNodes]); setGroupIndex(0); setStage("scan"); setLoopStep(0); setStepCount(0); sounds.reset();
  }

  function getExplanation() {
    if (stage === "done") return "All blocks of size k have been reversed. Any leftover nodes remain in their original order.";
    if (stage === "scan") return `We scan ahead k = ${K} nodes starting at position ${start + 1} to make sure a full block exists.`;
    if (stage === "reverse-loop") return `Inside this k-sized block, we run the classic prev–curr–next loop. Flipping one arrow at a time.`;
    if (stage === "apply-reverse") return "Applying the reversal result back to the main row.";
    return "Stitching the reversed block back and moving to the next group.";
  }

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-8">
      <div className="w-full max-w-3xl"><BackButton href="/linked-list" label="Linked List" /></div>

      <header className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">
          Reverse Nodes in <span className="text-cyan-400 text-glow-cyan">k</span>-Group
        </h1>
        <p className="text-sm text-slate-400">Visual + pointer-level explanation for k = {K}</p>
      </header>

      <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#22d3ee" />

      <ModeToggle mode={mode} onChange={setMode} />

      {/* Info badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-300">k = {K}</div>
        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-xs text-cyan-300">
          Group {Math.min(groupIndex + 1, totalGroups)} of {totalGroups} · {stage === "scan" ? "Selecting" : stage === "reverse-loop" ? "Reversing" : stage === "apply-reverse" ? "Applying" : stage === "connect" ? "Connecting" : "Done"}
        </div>
      </div>

      {/* 3D node row */}
      <div className="relative mt-2">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="flex items-center gap-6 px-6 pt-4">
          {nodes.map((value, index) => {
            const isInGroup = index >= start && index < end && stage !== "done";
            const isReversing = stage === "apply-reverse" && isInGroup;
            const mid = (nodes.length - 1) / 2;
            const offset = (index - mid) * 6;
            return (
              <div key={index} className="relative transition-all duration-500" style={{ transform: `translateY(${offset}px)` }}>
                <Node3D value={value} isInGroup={!!isInGroup} isReversing={!!isReversing} />
                {index < nodes.length - 1 && (
                  <div className="absolute top-1/2 -right-6 -translate-y-1/2 text-slate-500 text-2xl select-none">→</div>
                )}
              </div>
            );
          })}
        </div>
        {stage !== "done" && (
          <div className="absolute -bottom-8 h-6 rounded-3xl border border-cyan-500/60 bg-cyan-500/10 transition-all duration-500 ease-out"
            style={{ left: `${start * 72 + 12}px`, width: `${K * 72 - 24}px` }} />
        )}
      </div>

      {/* Explanation */}
      <div className="glass-card px-6 py-4 max-w-3xl text-center text-sm text-slate-200">{getExplanation()}</div>

      {/* Beginner panels */}
      {mode === "beginner" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mt-2">
          <div className="glass-card p-4 text-xs md:text-sm">
            <h2 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4 rounded-full bg-emerald-400" /> Pointer intuition
            </h2>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">Group range</span><span>pos {start + 1}–{end} of {nodes.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Group size</span><span>{currentChunk.length}</span></div>
            </div>
          </div>
          <MicroscopeView chunk={currentChunk} loopStep={loopStep} stage={stage} />
          <div className="glass-card p-4 text-[11px] md:text-xs font-mono text-slate-300">
            <h2 className="text-slate-200 font-semibold mb-3 flex items-center gap-2 font-sans">
              <span className="inline-block w-1.5 h-4 rounded-full bg-indigo-400" /> Code
            </h2>
            <pre className="space-y-1">
              <code className={algorithmPhase === "scan" ? "bg-slate-800/80 rounded px-1 block" : "block"}>
{`// 1. Find kth node
kth = moveForward(groupPrev, k);`}
              </code>
              <code className={algorithmPhase === "reverse" ? "bg-slate-800/80 rounded px-1 block" : "block"}>
{`// 2. Reverse the block
prev = kthNext; curr = start;
while (curr != kthNext) { ... }`}
              </code>
              <code className={algorithmPhase === "connect" ? "bg-slate-800/80 rounded px-1 block" : "block"}>
{`// 3. Stitch back
groupPrev->next = kth;
groupPrev = temp;`}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button onClick={handleStep} disabled={stage === "done"} className="btn-neon btn-neon-cyan px-7 py-2">
          {stage === "done" ? "Done ✅" : "Step →"}
        </button>
        <button onClick={handleReset} className="btn-neon btn-ghost px-7 py-2">Reset</button>
      </div>

      <OutputPanel result={stage === "done" ? `Result: [${nodes.join(" → ")}]` : null}
        success={stage === "done" ? true : null} stepCount={stepCount} complexity="O(n)" visible={stage === "done"} />
    </div>
  );
}
