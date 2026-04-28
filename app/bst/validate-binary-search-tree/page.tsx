"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/bst/validate-binary-search-tree/CodePanel";
import MicroscopeView from "../../../components/bst/validate-binary-search-tree/MicroscopeView";
import ValidateBSTWorkbench from "../../../components/bst/validate-binary-search-tree/ValidateBSTWorkbench";
import TracePanel from "../../../components/bst/validate-binary-search-tree/TracePanel";
import { generateTrace } from "../../../components/bst/validate-binary-search-tree/generateTrace";

const defaultInputs = {
  root: "[2,1,3]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function ValidateBinarySearchTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/bst"
      categoryLabel="BST"
      taxonomy="BST / Trace-driven lesson"
      title="Validate Binary Search Tree"
      difficulty="Medium"
      description="Trace the Validate Binary Search Tree algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[2,1,3]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <ValidateBSTWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
