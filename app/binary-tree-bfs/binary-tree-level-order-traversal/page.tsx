"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree-bfs/binary-tree-level-order-traversal/CodePanel";
import MicroscopeView from "../../../components/binary-tree-bfs/binary-tree-level-order-traversal/MicroscopeView";
import LevelOrderTraversalWorkbench from "../../../components/binary-tree-bfs/binary-tree-level-order-traversal/LevelOrderTraversalWorkbench";
import TracePanel from "../../../components/binary-tree-bfs/binary-tree-level-order-traversal/TracePanel";
import { generateTrace } from "../../../components/binary-tree-bfs/binary-tree-level-order-traversal/generateTrace";

const defaultInputs = {
  root: "[3,9,20,null,null,15,7]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function BinaryTreeLevelOrderTraversalPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree-bfs"
      categoryLabel="Binary Tree BFS"
      taxonomy="Binary Tree BFS / Trace-driven lesson"
      title="Binary Tree Level Order Traversal"
      difficulty="Medium"
      description="Trace the Binary Tree Level Order Traversal algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[3,9,20,null,null,15,7]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LevelOrderTraversalWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
