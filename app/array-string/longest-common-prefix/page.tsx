"use client";

import CodePanel from "../../../components/array-string/longest-common-prefix/CodePanel";
import Controls from "../../../components/array-string/longest-common-prefix/Controls";
import LongestCommonPrefixVisualizer from "../../../components/array-string/longest-common-prefix/LongestCommonPrefixVisualizer";
import MicroscopeView from "../../../components/array-string/longest-common-prefix/MicroscopeView";
import TracePanel from "../../../components/array-string/longest-common-prefix/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/longest-common-prefix/generateTrace";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";
import DarkTraceProblemPage from "@/components/academy/DarkTraceProblemPage";

const defaultInputs = {
  strs: '["flower","flow","flight"]',
};

const presets = [
  {
    name: "Example 1",
    summary: '=> "fl"',
    values: { strs: '["flower","flow","flight"]' },
  },
  {
    name: "Example 2",
    summary: '=> ""',
    values: { strs: '["dog","racecar","car"]' },
  },
  {
    name: "Shared full word",
    summary: '=> "in"',
    values: { strs: '["in","inside","inner"]' },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.strs);
}

export default function LongestCommonPrefixPage() {
  return (
    <DarkTraceProblemPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Prefix Scan / Column Comparison",
        title: "Longest Common Prefix",
        difficulty: "Easy",
        description: "Find the longest shared prefix across a list of strings by comparing one character column at a time.",
        complexity: "O(total compared chars) time / O(1) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "strs",
          label: "Words",
          placeholder: '["flower","flow","flight"]',
          multiline: true,
          rows: 4,
          help: "Use JSON arrays, comma-separated words, or newline-separated entries.",
        },
      ]}
      presets={presets}
      buildTrace={buildTrace}
      Controls={Controls}
      Visualization={LongestCommonPrefixVisualizer}
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
                The maximal prefix shared by every parsed word.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            prefix = {step.state.result ?? step.state.prefix}
          </div>
        </div>
      )}
    />
  );
}
