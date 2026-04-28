"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/surrounded-regions/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/surrounded-regions/MicroscopeView";
import SurroundedRegionsWorkbench from "../../../components/graph-traversal/surrounded-regions/SurroundedRegionsWorkbench";
import TracePanel from "../../../components/graph-traversal/surrounded-regions/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/surrounded-regions/generateTrace";

const defaultInputs = {
  board: "XXXX\nXOOX\nXXOX\nXOXX"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.board));
}

export default function SurroundedRegionsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Surrounded Regions"
      difficulty="Medium"
      description="Trace the Surrounded Regions algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "board", label: "board", placeholder: "XXXX\nXOOX\nXXOX\nXOXX", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SurroundedRegionsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
