"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree/CodePanel";
import MicroscopeView from "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree/MicroscopeView";
import AverageLevelsWorkbench from "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree/AverageLevelsWorkbench";
import TracePanel from "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree/TracePanel";
import { generateTrace } from "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree/generateTrace";

const defaultInputs = {
  root: "[3,9,20,null,null,15,7]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function AverageOfLevelsInBinaryTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree-bfs"
      categoryLabel="Binary Tree BFS"
      taxonomy="Binary Tree BFS / Trace-driven lesson"
      title="Average of Levels in Binary Tree"
      difficulty="Easy"
      description="Trace the Average of Levels in Binary Tree algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[3,9,20,null,null,15,7]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <AverageLevelsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
