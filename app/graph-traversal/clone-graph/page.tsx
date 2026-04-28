"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/clone-graph/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/clone-graph/MicroscopeView";
import CloneGraphWorkbench from "../../../components/graph-traversal/clone-graph/CloneGraphWorkbench";
import TracePanel from "../../../components/graph-traversal/clone-graph/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/clone-graph/generateTrace";

const defaultInputs = {
  graph: "[[2,4],[1,3],[2,4],[1,3]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.graph));
}

export default function CloneGraphPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Clone Graph"
      difficulty="Medium"
      description="Trace the Clone Graph algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "graph", label: "graph", placeholder: "[[2,4],[1,3],[2,4],[1,3]]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CloneGraphWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
