"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/bst/kth-smallest-element-in-a-bst/CodePanel";
import MicroscopeView from "../../../components/bst/kth-smallest-element-in-a-bst/MicroscopeView";
import KthSmallestWorkbench from "../../../components/bst/kth-smallest-element-in-a-bst/KthSmallestWorkbench";
import TracePanel from "../../../components/bst/kth-smallest-element-in-a-bst/TracePanel";
import { generateTrace } from "../../../components/bst/kth-smallest-element-in-a-bst/generateTrace";

const defaultInputs = {
  root: "[3,1,4,null,2]",
  k: "1"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root, values.k));
}

export default function KthSmallestElementInABstPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/bst"
      categoryLabel="BST"
      taxonomy="BST / Trace-driven lesson"
      title="Kth Smallest Element in a BST"
      difficulty="Medium"
      description="Trace the Kth Smallest Element in a BST algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[3,1,4,null,2]", },
        { id: "k", label: "k", placeholder: "1", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <KthSmallestWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
