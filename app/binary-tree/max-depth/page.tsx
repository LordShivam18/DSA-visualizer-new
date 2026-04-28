"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanelBT from "@/components/binary-tree/max-depth/CodePanelBT";
import StatsPanelBT from "@/components/binary-tree/max-depth/StatsPanelBT";
import TreeView from "@/components/binary-tree/max-depth/TreeView";
import { generateTrace } from "@/components/binary-tree/max-depth/generateTrace";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Static BFS tree", values: defaultInputs }];

function generateLessonTrace() {
  return generateTrace();
}

export default function MaxDepthPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / BFS Depth"
      title="Maximum Depth of Binary Tree"
      difficulty="Easy"
      description="Trace level-order BFS as each completed frontier increments the depth."
      complexity="O(n) time / O(w) space"
      defaultInputs={defaultInputs}
      inputFields={[]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step, teachingMode }) => (
        <TreeView currentId={step.state.currentId} queue={step.state.queue} visited={step.state.visited} mode={teachingMode} />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelBT depth={step.state.depth} queue={step.state.queue} currentId={step.state.currentId} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step, teachingMode }) => <CodePanelBT activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
