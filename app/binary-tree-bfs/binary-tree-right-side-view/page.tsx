"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree-bfs/binary-tree-right-side-view/CodePanel";
import MicroscopeView from "../../../components/binary-tree-bfs/binary-tree-right-side-view/MicroscopeView";
import BinaryTreeRightSideViewWorkbench from "../../../components/binary-tree-bfs/binary-tree-right-side-view/BinaryTreeRightSideViewWorkbench";
import TracePanel from "../../../components/binary-tree-bfs/binary-tree-right-side-view/TracePanel";
import { generateTrace } from "../../../components/binary-tree-bfs/binary-tree-right-side-view/generateTrace";

const defaultInputs = {
  root: "[1,2,3,null,5,null,4]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function BinaryTreeRightSideViewPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree-bfs"
      categoryLabel="Binary Tree BFS"
      taxonomy="Binary Tree BFS / Trace-driven lesson"
      title="Binary Tree Right Side View"
      difficulty="Medium"
      description="Trace the Binary Tree Right Side View algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[1,2,3,null,5,null,4]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <BinaryTreeRightSideViewWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
