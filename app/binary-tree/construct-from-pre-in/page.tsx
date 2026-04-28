"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/construct-from-pre-in/CodePanelCT";
import InorderBar from "@/components/binary-tree/construct-from-pre-in/InorderBar";
import PreorderBar from "@/components/binary-tree/construct-from-pre-in/PreorderBar";
import RecursionStack from "@/components/binary-tree/construct-from-pre-in/RecursionStack";
import TreeCanvas from "@/components/binary-tree/construct-from-pre-in/TreeCanvas";
import { buildNodeLayouts, computeBarsLayout } from "@/components/binary-tree/construct-from-pre-in/layoutEngine";
import {
  generateTrace,
  type ConstructTraceStep,
} from "@/components/binary-tree/construct-from-pre-in/generateTrace";

const defaultInputs = { preorder: "3,9,20,15,7", inorder: "9,3,15,20,7" };
const presets = [{ name: "Default", summary: "Build sample tree", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.preorder, values.inorder));
}

function buildLayouts(trace: ConstructTraceStep[]) {
  const nodesFound = trace
    .flatMap((step) => {
      if (!step.nodeId) {
        return [];
      }

      const parts = String(step.nodeId).split("-");
      const value = Number(parts[1]);
      const preorderIndex = Number(parts[2]);
      return [{
        id: step.nodeId,
        value,
        preorderIndex,
        inorderIndex: step.state.inorder.indexOf(value),
        depth: step.snapshot?.depth ?? 0,
      }];
    });
  const unique = Array.from(new Map(nodesFound.map((node) => [node.id, node])).values());
  return buildNodeLayouts(unique, computeBarsLayout(940, trace[0]?.state.preorder.length ?? 0));
}

export default function ConstructFromPreInPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Recursive Construction"
      title="Construct Binary Tree from Preorder and Inorder"
      difficulty="Medium"
      description="Trace recursive root selection from preorder and subtree boundaries from inorder."
      complexity="O(n) time / O(n) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "preorder", label: "preorder", placeholder: "3,9,20,15,7" },
        { id: "inorder", label: "inorder", placeholder: "9,3,15,20,7" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => {
        const cursor = timeline.activeIndex;
        const first = trace[0];
        return (
          <div className="space-y-3 overflow-x-auto rounded-2xl border border-slate-800 bg-[#050817] p-4">
            <PreorderBar pre={first.state.preorder} cursor={cursor} trace={trace} />
            <InorderBar ino={first.state.inorder} cursor={cursor} trace={trace} />
            <TreeCanvas trace={trace} cursor={cursor} nodeLayouts={buildLayouts(trace)} />
          </div>
        );
      }}
      renderMicroscope={({ trace, timeline }) => <RecursionStack trace={trace} cursor={timeline.activeIndex} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ trace, timeline, teachingMode }) => <CodePanel trace={trace} cursor={timeline.activeIndex} mode={teachingMode} />}
    />
  );
}
