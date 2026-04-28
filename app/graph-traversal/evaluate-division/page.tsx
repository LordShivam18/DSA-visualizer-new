"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/evaluate-division/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/evaluate-division/MicroscopeView";
import EvaluateDivisionWorkbench from "../../../components/graph-traversal/evaluate-division/EvaluateDivisionWorkbench";
import TracePanel from "../../../components/graph-traversal/evaluate-division/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/evaluate-division/generateTrace";

const defaultInputs = {
  equations: "[[\"a\",\"b\"],[\"b\",\"c\"]]",
  values: "[2.0,3.0]",
  queries: "[[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values));
}

export default function EvaluateDivisionPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Evaluate Division"
      difficulty="Medium"
      description="Trace the Evaluate Division algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "equations", label: "equations", placeholder: "[[\"a\",\"b\"],[\"b\",\"c\"]]", },
        { id: "values", label: "values", placeholder: "[2.0,3.0]", },
        { id: "queries", label: "queries", placeholder: "[[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <EvaluateDivisionWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
