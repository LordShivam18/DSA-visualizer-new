"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/CodePanel";
import MicroscopeView from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/MicroscopeView";
import LowestCommonAncestorWorkbench from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/LowestCommonAncestorWorkbench";
import TracePanel from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/TracePanel";
import { generateTrace } from "../../../components/binary-tree/lowest-common-ancestor-binary-tree/generateTrace";

const defaultInputs = {
  root: "[3,5,1,6,2,0,8,null,null,7,4]",
  p: "5",
  q: "1"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root, values.p, values.q));
}

export default function LowestCommonAncestorBinaryTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Lowest Common Ancestor of a Binary Tree"
      difficulty="Medium"
      description="Trace the Lowest Common Ancestor of a Binary Tree algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[3,5,1,6,2,0,8,null,null,7,4]", },
        { id: "p", label: "p", placeholder: "5", },
        { id: "q", label: "q", placeholder: "1", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LowestCommonAncestorWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
