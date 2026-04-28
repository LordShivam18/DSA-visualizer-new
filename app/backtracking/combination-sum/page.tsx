"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/backtracking/combination-sum/CodePanel";
import MicroscopeView from "../../../components/backtracking/combination-sum/MicroscopeView";
import CombinationSumWorkbench from "../../../components/backtracking/combination-sum/CombinationSumWorkbench";
import TracePanel from "../../../components/backtracking/combination-sum/TracePanel";
import { generateTrace } from "../../../components/backtracking/combination-sum/generateTrace";

const defaultInputs = {
  candidates: "[2,3,6,7]",
  target: "7"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.candidates, values.target));
}

export default function CombinationSumPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Trace-driven lesson"
      title="Combination Sum"
      difficulty="Medium"
      description="Trace the Combination Sum algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "candidates", label: "candidates", placeholder: "[2,3,6,7]", },
        { id: "target", label: "target", placeholder: "7", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CombinationSumWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
