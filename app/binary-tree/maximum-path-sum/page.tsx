"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/maximum-path-sum/CodePanel";
import MicroscopeView from "../../../components/binary-tree/maximum-path-sum/MicroscopeView";
import MaximumPathSumWorkbench from "../../../components/binary-tree/maximum-path-sum/MaximumPathSumWorkbench";
import TracePanel from "../../../components/binary-tree/maximum-path-sum/TracePanel";
import { generateTrace } from "../../../components/binary-tree/maximum-path-sum/generateTrace";

const defaultInputs = {
  root: "-10,9,20,null,null,15,7"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function MaximumPathSumPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Binary Tree Maximum Path Sum"
      difficulty="Hard"
      description="Trace the Binary Tree Maximum Path Sum algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "-10,9,20,null,null,15,7", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MaximumPathSumWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
