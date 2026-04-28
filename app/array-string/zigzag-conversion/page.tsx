"use client";

import CodePanel from "../../../components/array-string/zigzag-conversion/CodePanel";
import Controls from "../../../components/array-string/zigzag-conversion/Controls";
import MicroscopeView from "../../../components/array-string/zigzag-conversion/MicroscopeView";
import TracePanel from "../../../components/array-string/zigzag-conversion/TracePanel";
import ZigzagConversionVisualizer from "../../../components/array-string/zigzag-conversion/ZigzagConversionVisualizer";
import {
  generateTrace,
} from "../../../components/array-string/zigzag-conversion/generateTrace";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";
import DarkTraceProblemPage from "@/components/academy/DarkTraceProblemPage";

const defaultInputs = {
  s: "PAYPALISHIRING",
  numRows: "3",
};

const presets = [
  {
    name: "Example 1",
    summary: '=> "PAHNAPLSIIGYIR"',
    values: { s: "PAYPALISHIRING", numRows: "3" },
  },
  {
    name: "Example 2",
    summary: '=> "PINALSIGYAHRPI"',
    values: { s: "PAYPALISHIRING", numRows: "4" },
  },
  {
    name: "Straight row",
    summary: '=> "ABC"',
    values: { s: "ABC", numRows: "1" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.s, values.numRows);
}

export default function ZigzagConversionPage() {
  return (
    <DarkTraceProblemPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Simulation / Zigzag Routing",
        title: "Zigzag Conversion",
        difficulty: "Medium",
        description: "Route characters through a bouncing row pointer, then read the row buffers back in order to form the zigzag-converted string.",
        complexity: "O(n) time / O(n) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "s",
          label: "String",
          placeholder: "PAYPALISHIRING",
        },
        {
          key: "numRows",
          label: "numRows",
          placeholder: "3",
        },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={ZigzagConversionVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
      renderOutput={({ step }) => (
        <div
          className={`${darkPanelClassName} p-5 ${
            step.done ? "border-emerald-400/30 bg-emerald-500/5" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Output</h3>
              <p className="text-sm text-slate-400">
                The string obtained after zigzag routing and row concatenation.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            zigzag = {step.state.finalResult ?? step.state.result}
          </div>
        </div>
      )}
    />
  );
}
