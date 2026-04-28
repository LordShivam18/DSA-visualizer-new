"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/count-complete-tree-nodes/CodePanel";
import MicroscopeView from "../../../components/binary-tree/count-complete-tree-nodes/MicroscopeView";
import CountCompleteTreeNodesWorkbench from "../../../components/binary-tree/count-complete-tree-nodes/CountCompleteTreeNodesWorkbench";
import TracePanel from "../../../components/binary-tree/count-complete-tree-nodes/TracePanel";
import { generateTrace } from "../../../components/binary-tree/count-complete-tree-nodes/generateTrace";

const defaultInputs = {
  root: "[1,2,3,4,5,6]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function CountCompleteTreeNodesPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Count Complete Tree Nodes"
      difficulty="Easy"
      description="Trace the Count Complete Tree Nodes algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[1,2,3,4,5,6]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CountCompleteTreeNodesWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
