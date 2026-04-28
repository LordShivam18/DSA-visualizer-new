"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/number-of-islands/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/number-of-islands/MicroscopeView";
import IslandsWorkbench from "../../../components/graph-traversal/number-of-islands/IslandsWorkbench";
import TracePanel from "../../../components/graph-traversal/number-of-islands/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/number-of-islands/generateTrace";

const defaultInputs = {
  grid: "11110\n11010\n11000\n00000"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.grid));
}

export default function NumberOfIslandsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Number of Islands"
      difficulty="Medium"
      description="Trace the Number of Islands algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "grid", label: "grid", placeholder: "11110\n11010\n11000\n00000", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <IslandsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
