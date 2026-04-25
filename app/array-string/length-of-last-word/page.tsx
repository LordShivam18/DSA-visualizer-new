"use client";

import CodePanel from "../../../components/array-string/length-of-last-word/CodePanel";
import Controls from "../../../components/array-string/length-of-last-word/Controls";
import LengthOfLastWordVisualizer from "../../../components/array-string/length-of-last-word/LengthOfLastWordVisualizer";
import MicroscopeView from "../../../components/array-string/length-of-last-word/MicroscopeView";
import TracePanel from "../../../components/array-string/length-of-last-word/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/length-of-last-word/generateTrace";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";
import DarkTraceProblemPage from "@/components/academy/DarkTraceProblemPage";

const defaultInputs = {
  s: "Hello World",
};

const presets = [
  { name: "Example 1", summary: "=> 5", values: { s: "Hello World" } },
  { name: "Example 2", summary: "=> 4", values: { s: "   fly me   to   the moon  " } },
  { name: "Example 3", summary: "=> 6", values: { s: "luffy is still joyboy" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.s);
}

export default function LengthOfLastWordPage() {
  return (
    <DarkTraceProblemPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Reverse Scan / Whitespace",
        title: "Length of Last Word",
        difficulty: "Easy",
        description: "Return the length of the last word in a string by scanning from the end, trimming spaces, and counting the final non-space stretch.",
        complexity: "O(n) time / O(1) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "s",
          label: "Sentence",
          placeholder: "Hello World",
        },
      ]}
      presets={presets}
      buildTrace={buildTrace}
      Controls={Controls}
      Visualization={LengthOfLastWordVisualizer}
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
                The number of characters in the final word.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-base text-cyan-200">
            length = {step.state.result ?? step.state.length}
          </div>
        </div>
      )}
    />
  );
}
