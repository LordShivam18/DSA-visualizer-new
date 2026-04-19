"use client";

import { useState } from "react";

import CodePanel from "@/components/binary-tree/invert-tree/CodePanel";
import Controls from "@/components/binary-tree/invert-tree/Controls";
import TracePanel from "@/components/binary-tree/invert-tree/TracePanel";
import TreeCanvas from "@/components/binary-tree/invert-tree/TreeCanvas";
import {
  generateInvertTrace,
  type Trace,
} from "@/components/binary-tree/invert-tree/generateTrace";

export default function Page() {
  const [trace] = useState<Trace[]>(() => generateInvertTrace());
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const canStep = trace.length > 0 && cursor < trace.length - 1;

  function stepForward() {
    if (!canStep) {
      return;
    }

    setCursor((current) => Math.min(current + 1, trace.length - 1));
  }

  function reset() {
    setCursor(0);
  }

  return (
    <div className="min-h-screen bg-[#0d1117] p-8 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Controls
            cursor={cursor}
            mode={mode}
            setMode={setMode}
            canStep={canStep}
            onStep={stepForward}
            onReset={reset}
          />

          <div className="rounded-xl bg-[#161b22] p-4 shadow-md">
            <TreeCanvas trace={trace} cursor={cursor} />
          </div>

          <div className="rounded-xl bg-[#161b22] p-4 shadow-md">
            <TracePanel trace={trace} cursor={cursor} />
          </div>
        </div>

        <div className="rounded-xl bg-[#161b22] p-4 shadow-md">
          <CodePanel trace={trace} cursor={cursor} mode={mode} />
        </div>
      </div>
    </div>
  );
}
