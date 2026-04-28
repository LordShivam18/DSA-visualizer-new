"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/backtracking/generate-parentheses/CodePanel";
import MicroscopeView from "../../../components/backtracking/generate-parentheses/MicroscopeView";
import GenerateParenthesesWorkbench from "../../../components/backtracking/generate-parentheses/GenerateParenthesesWorkbench";
import TracePanel from "../../../components/backtracking/generate-parentheses/TracePanel";
import { generateTrace } from "../../../components/backtracking/generate-parentheses/generateTrace";

const defaultInputs = {
  n: "3"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.n));
}

export default function GenerateParenthesesPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Trace-driven lesson"
      title="Generate Parentheses"
      difficulty="Medium"
      description="Trace the Generate Parentheses algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "n", label: "n", placeholder: "3", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <GenerateParenthesesWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
