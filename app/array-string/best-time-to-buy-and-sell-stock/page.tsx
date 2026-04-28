"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock/CodePanel";
import MicroscopeView from "../../../components/array-string/best-time-to-buy-and-sell-stock/MicroscopeView";
import StockProfitVisualizer from "../../../components/array-string/best-time-to-buy-and-sell-stock/StockProfitVisualizer";
import TracePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/best-time-to-buy-and-sell-stock/generateTrace";
import { lightPanelClassName } from "../../../components/array-string/shared/ui";

const defaultInputs = {
  prices: "[7,1,5,3,6,4]",
};

const presets = [
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
  return (
    <TraceLessonPage
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Profit"
      title="Best Time to Buy and Sell Stock"
      difficulty="Easy"
      description="Scan prices once, keep the cheapest buy day seen so far, and evaluate every later day as a possible sell."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "prices", label: "prices", placeholder: "[7,1,5,3,6,4]" },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      renderVisualization={({ step }) => <StockProfitVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
      renderOutput={({ step }) => (
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
      )}
    />
  );
}
