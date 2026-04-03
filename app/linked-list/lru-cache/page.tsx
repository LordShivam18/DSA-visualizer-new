"use client";

import { useEffect, useState } from "react";
import { generateTrace, LRUStep } from "@/components/linked-list/lru-cache/generateTrace";
import CacheTrack from "@/components/linked-list/lru-cache/CacheTrack";
import HashMapViz from "@/components/linked-list/lru-cache/HashMapViz";
import MicroscopeView from "@/components/linked-list/lru-cache/MicroscopeView";
import TracePanel from "@/components/linked-list/lru-cache/TracePanel";
import CodePanel from "@/components/linked-list/lru-cache/CodePanel";
import Controls from "@/components/linked-list/lru-cache/Controls";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

export default function Page() {
  const [capacity, setCapacity] = useState(2);
  const [opsInput, setOpsInput] = useState("put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)");
  const [trace, setTrace] = useState<LRUStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  function parseOps(str: string) {
    const ops: { type: string; key: number; value?: number }[] = [];
    const regex = /(put|get)\((\d+)(?:,\s*(\d+))?\)/gi;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const type = match[1].toLowerCase();
      const key = parseInt(match[2]);
      const value = match[3] ? parseInt(match[3]) : undefined;
      ops.push({ type, key, value });
    }
    return ops;
  }

  function regenerate() {
    const ops = parseOps(opsInput);
    if (ops.length === 0) return;
    setTrace(generateTrace(capacity, ops as any));
    setCursor(0);
    sounds.click();
  }

  useEffect(() => {
    const ops = [
      { type: "put", key: 1, value: 1 },
      { type: "put", key: 2, value: 2 },
      { type: "get", key: 1 },
      { type: "put", key: 3, value: 3 },
      { type: "get", key: 2 },
      { type: "put", key: 4, value: 4 },
      { type: "get", key: 1 },
      { type: "get", key: 3 },
      { type: "get", key: 4 },
    ] as any;
    setTrace(generateTrace(2, ops));
  }, []);

  const step = trace[cursor];
  const isDone = cursor === trace.length - 1 && trace.length > 0;

  return (
    <div className="min-h-screen grid-pattern text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton href="/linked-list" label="Linked List" />

        <h1 className="text-3xl font-extrabold mt-4">
          <span className="text-amber-400" style={{ textShadow: "0 0 18px rgba(251,191,36,0.8)" }}>LRU Cache</span> — Visualizer
        </h1>

        {/* Custom input for LRU */}
        <div className="glass-card p-5 w-full max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 rounded-full bg-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Input</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                className="input-field w-24 block mt-1" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Operations</label>
              <input value={opsInput} onChange={(e) => setOpsInput(e.target.value)}
                className="input-field block mt-1"
                placeholder='put(1,1), get(1), put(2,2)' />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={regenerate} className="btn-neon btn-neon-cyan px-6 py-2">▶ Run</button>
            <button onClick={() => { setOpsInput("put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4)"); setCapacity(2); }}
              className="btn-neon btn-ghost px-4 py-2 text-xs">Example 1</button>
            <button onClick={() => { setOpsInput("put(1,10), put(2,20), put(3,30), get(1), put(4,40), get(2)"); setCapacity(3); }}
              className="btn-neon btn-ghost px-4 py-2 text-xs">Example 2</button>
          </div>
        </div>

        {step && (
          <>
            <Controls
              prev={() => { setCursor((c) => Math.max(0, c - 1)); sounds.tick(); }}
              next={() => { setCursor((c) => Math.min(trace.length - 1, c + 1)); sounds.tick(); }}
              reset={() => { setCursor(0); sounds.reset(); }}
              canPrev={cursor > 0}
              canNext={cursor < trace.length - 1}
              mode={mode}
              setMode={setMode}
            />

            <HashMapViz keys={step.mapKeys} activeKey={step.activeKey} />
            <CacheTrack step={step} />
            <MicroscopeView step={step} mode={mode} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TracePanel step={step} />
              <CodePanel step={step} />
            </div>
          </>
        )}

        <OutputPanel
          result={isDone ? `LRU Cache simulation complete (${trace.length} operations)` : null}
          success={isDone ? true : null}
          stepCount={cursor + 1}
          complexity="O(1) per operation"
          visible={isDone}
        />
      </div>
    </div>
  );
}
