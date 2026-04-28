"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/backtracking/combinations/CodePanel";
import MicroscopeView from "../../../components/backtracking/combinations/MicroscopeView";
import CombinationsWorkbench from "../../../components/backtracking/combinations/CombinationsWorkbench";
import TracePanel from "../../../components/backtracking/combinations/TracePanel";
import { generateTrace } from "../../../components/backtracking/combinations/generateTrace";

const defaultInputs = {
  n: "4",
  k: "2"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.n, values.k));
}

export default function CombinationsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Trace-driven lesson"
      title="Combinations"
      difficulty="Medium"
      description="Trace the Combinations algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "n", label: "n", placeholder: "4", },
        { id: "k", label: "k", placeholder: "2", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CombinationsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
