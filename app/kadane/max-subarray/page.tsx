"use client";

import React, { useEffect, useState } from "react";

import Controls from "@/components/kadane/Controls";
import ArrayViz from "@/components/kadane/ArrayViz";
import ChartViz from "@/components/kadane/ChartViz";
import TracePanel from "@/components/kadane/TracePanel";
import CodePanel from "@/components/kadane/CodePanel";

import { generateTrace } from "@/components/kadane/generateTrace";
import { TraceStep } from "@/components/kadane/generateTrace";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

export default function Page() {
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  // Generate trace on load
  useEffect(() => {
    const steps = generateTrace();
    setTrace(steps);
    setCursor(0);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (!playing) return;

    const id = setInterval(() => {
      setCursor((c) => {
        const next = Math.min(c + 1, trace.length - 1);
        if (next === trace.length - 1) setPlaying(false);
        return next;
      });
    }, 450);

    return () => clearInterval(id);
  }, [playing, trace.length]);

  // Step buttons
  const stepForward = () =>
    setCursor((c) => Math.min(c + 1, trace.length - 1));

  const stepBack = () => setCursor((c) => Math.max(c - 1, 0));

  const reset = () => setCursor(0);

  return (
    <div className="min-h-screen p-6 grid-pattern text-slate-100">
      <div className="max-w-6xl mx-auto mb-4"><BackButton href="/topics" label="Topics" /></div>
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">
          Maximum Subarray (Kadane) — Visualizer
        </h1>
        <p className="text-slate-400 mt-1">
          Cyan glow on active indices, bars + running sum chart, code line-highlighting.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* LEFT SIDE — VIZ + TRACE  */}
        <section className="space-y-4">
          <div className="bg-[#050817] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="px-4 py-2 rounded-xl border border-cyan-500 bg-cyan-500/8"
                >
                  {playing ? "Pause" : "Play"}
                </button>

                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-md border border-slate-600"
                >
                  Reset
                </button>

                <div className="ml-4">
                  <label className="text-sm text-slate-400 mr-2">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "beginner" | "expert")
                    }
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <Controls stepBack={stepBack} stepForward={stepForward} />
            </div>

            {/* Array bars */}
            <ArrayViz trace={trace} cursor={cursor} />

            <div className="mt-6">
              <ChartViz trace={trace} cursor={cursor} />
            </div>
          </div>

          {/* Trace panel */}
          <div className="bg-[#041022] border border-slate-800 rounded-2xl p-4">
            <TracePanel trace={trace} cursor={cursor} />
          </div>
        </section>

        {/* RIGHT SIDE — CODE */}
        <aside className="space-y-4">
          <div className="bg-[#051025] border border-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Code</h3>
            <CodePanel trace={trace} cursor={cursor} />
          </div>
        </aside>
      </main>

      <div className="max-w-6xl mx-auto mt-6">
        <OutputPanel result={cursor === trace.length - 1 && trace.length > 0 ? `Max subarray sum found` : null}
          success={cursor === trace.length - 1 && trace.length > 0 ? true : null} stepCount={cursor + 1}
          complexity="O(n)" visible={cursor === trace.length - 1 && trace.length > 0} />
      </div>
    </div>
  );
}
