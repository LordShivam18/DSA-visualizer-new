"use client";

import { useState } from "react";

import CodePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock/CodePanel";
import Controls from "../../../components/array-string/best-time-to-buy-and-sell-stock/Controls";
import MicroscopeView from "../../../components/array-string/best-time-to-buy-and-sell-stock/MicroscopeView";
import StockProfitVisualizer from "../../../components/array-string/best-time-to-buy-and-sell-stock/StockProfitVisualizer";
import TracePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock/TracePanel";
import {
  generateTrace,
  type StockTraceStep,
} from "../../../components/array-string/best-time-to-buy-and-sell-stock/generateTrace";
import ProblemShell from "../../../components/array-string/shared/ProblemShell";
import type { PresetConfig } from "../../../components/array-string/shared/types";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  prices: "[7,1,5,3,6,4]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 5", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 0",
    values: { prices: "[7,6,4,3,1]" },
  },
  {
    name: "Late surge",
    summary: "Track new best sell",
    values: { prices: "[9,8,2,4,1,10]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.prices);
}

export default function StockPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<StockTraceStep[]>(() =>
    buildTrace(defaultInputs)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");
  const step = trace[Math.min(cursor, trace.length - 1)];

  function run(nextValues = inputs) {
    setInputs(nextValues);
    setTrace(buildTrace(nextValues));
    setCursor(0);
  }

  return (
    <ProblemShell
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Profit"
      title="Best Time to Buy and Sell Stock"
      difficulty="Easy"
      description="Scan prices once, keep the cheapest buy day seen so far, and evaluate every later day as a possible sell."
      complexity="O(n) time / O(1) extra space"
      inputFields={[
        { key: "prices", label: "prices", placeholder: "[7,1,5,3,6,4]" },
      ]}
      inputValues={inputs}
      onInputChange={(key, value) =>
        setInputs((current) => ({ ...current, [key]: value }))
      }
      onRun={() => run()}
      presets={presets}
      onPreset={(preset) => run(preset.values as typeof defaultInputs)}
      step={step}
      mode={mode}
      controls={
        <Controls
          stepIndex={cursor}
          totalSteps={trace.length}
          mode={mode}
          onModeChange={setMode}
          onPrev={() => setCursor((current) => Math.max(current - 1, 0))}
          onNext={() =>
            setCursor((current) => Math.min(current + 1, trace.length - 1))
          }
          onReset={() => setCursor(0)}
          canPrev={cursor > 0}
          canNext={cursor < trace.length - 1}
        />
      }
      visualization={<StockProfitVisualizer step={step} />}
      microscope={<MicroscopeView step={step} mode={mode} />}
      tracePanel={<TracePanel step={step} />}
      codePanel={<CodePanel step={step} />}
      output={
        <div
          className={`${lightPanelClassName} p-5 ${
            step.done ? "border-emerald-200 bg-emerald-50/60" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                Maximum profit from one buy and one sell.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            maxProfit = {step.state.result ?? step.state.maxProfit}
          </div>
        </div>
      }
    />
  );
}
