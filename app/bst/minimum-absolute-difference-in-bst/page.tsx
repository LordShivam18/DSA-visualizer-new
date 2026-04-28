"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/bst/minimum-absolute-difference-in-bst/CodePanel";
import MicroscopeView from "../../../components/bst/minimum-absolute-difference-in-bst/MicroscopeView";
import MinimumDifferenceWorkbench from "../../../components/bst/minimum-absolute-difference-in-bst/MinimumDifferenceWorkbench";
import TracePanel from "../../../components/bst/minimum-absolute-difference-in-bst/TracePanel";
import { generateTrace } from "../../../components/bst/minimum-absolute-difference-in-bst/generateTrace";

const defaultInputs = {
  root: "[4,2,6,1,3]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function MinimumAbsoluteDifferenceInBstPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/bst"
      categoryLabel="BST"
      taxonomy="BST / Trace-driven lesson"
      title="Minimum Absolute Difference in BST"
      difficulty="Easy"
      description="Trace the Minimum Absolute Difference in BST algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[4,2,6,1,3]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MinimumDifferenceWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
