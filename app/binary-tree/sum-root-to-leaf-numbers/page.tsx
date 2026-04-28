"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/sum-root-to-leaf-numbers/CodePanel";
import MicroscopeView from "../../../components/binary-tree/sum-root-to-leaf-numbers/MicroscopeView";
import SumRootToLeafWorkbench from "../../../components/binary-tree/sum-root-to-leaf-numbers/SumRootToLeafWorkbench";
import TracePanel from "../../../components/binary-tree/sum-root-to-leaf-numbers/TracePanel";
import { generateTrace } from "../../../components/binary-tree/sum-root-to-leaf-numbers/generateTrace";

const defaultInputs = {
  root: "4,9,0,5,1"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function SumRootToLeafNumbersPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Sum Root to Leaf Numbers"
      difficulty="Medium"
      description="Trace the Sum Root to Leaf Numbers algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "4,9,0,5,1", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SumRootToLeafWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
