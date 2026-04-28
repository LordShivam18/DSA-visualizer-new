"use client";

import CodePanel from "../../../components/array-string/text-justification/CodePanel";
import Controls from "../../../components/array-string/text-justification/Controls";
import MicroscopeView from "../../../components/array-string/text-justification/MicroscopeView";
import TextJustificationVisualizer from "../../../components/array-string/text-justification/TextJustificationVisualizer";
import TracePanel from "../../../components/array-string/text-justification/TracePanel";
import {
  generateTrace,
} from "../../../components/array-string/text-justification/generateTrace";
import { darkPanelClassName } from "../../../components/array-string/shared/darkUi";
import DarkTraceProblemPage from "@/components/academy/DarkTraceProblemPage";

const defaultInputs = {
  words: '["This","is","an","example","of","text","justification."]',
  maxWidth: "16",
};

const presets = [
  {
    name: "Example 1",
    summary: "=> 3 lines",
    values: {
      words: '["This","is","an","example","of","text","justification."]',
      maxWidth: "16",
    },
  },
  {
    name: "Example 2",
    summary: "=> 3 lines",
    values: {
      words: '["What","must","be","acknowledgment","shall","be"]',
      maxWidth: "16",
    },
  },
  {
    name: "Wide line",
    summary: "=> 2 lines",
    values: {
      words: '["Listen","to","many,","speak","to","a","few."]',
      maxWidth: "18",
    },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.words, values.maxWidth);
}

export default function TextJustificationPage() {
  return (
    <DarkTraceProblemPage
      meta={{
        categoryHref: "/array-string",
        categoryLabel: "Array / String",
        taxonomy: "Array / String / Greedy Packing / Formatting",
        title: "Text Justification",
        difficulty: "Hard",
        description: "Greedily pack words into each line, distribute the remaining spaces across the gaps, and left-justify the final line.",
        complexity: "O(total chars) time / O(total output) extra space",
      }}
      defaultInputs={defaultInputs}
      inputFields={[
        {
          key: "words",
          label: "Words",
          placeholder: '["This","is","an","example","of","text","justification."]',
          multiline: true,
          rows: 5,
          help: "Use JSON arrays, comma-separated words, or newline-separated entries.",
        },
        {
          key: "maxWidth",
          label: "maxWidth",
          placeholder: "16",
        },
      ]}
      presets={presets}
      generateTrace={buildTrace}
      Controls={Controls}
      Visualization={TextJustificationVisualizer}
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
                The justified lines, shown with visible middots for spaces.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 px-4 py-4 font-mono text-sm text-cyan-200 whitespace-pre-wrap">
            {(step.state.result ?? step.state.builtLines)
              .map((line) => line.replace(/ /g, "·"))
              .join("\n")}
          </div>
        </div>
      )}
    />
  );
}
