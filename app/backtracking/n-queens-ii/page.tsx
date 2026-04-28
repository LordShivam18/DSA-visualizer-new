"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/backtracking/n-queens-ii/CodePanel";
import MicroscopeView from "../../../components/backtracking/n-queens-ii/MicroscopeView";
import NQueensWorkbench from "../../../components/backtracking/n-queens-ii/NQueensWorkbench";
import TracePanel from "../../../components/backtracking/n-queens-ii/TracePanel";
import { generateTrace } from "../../../components/backtracking/n-queens-ii/generateTrace";

const defaultInputs = {
  n: "4"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.n));
}

export default function NQueensIiPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Trace-driven lesson"
      title="N-Queens II"
      difficulty="Hard"
      description="Trace the N-Queens II algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "n", label: "n", placeholder: "4", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <NQueensWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
