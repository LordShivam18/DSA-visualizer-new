"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/path-sum/CodePanel";
import MicroscopeView from "../../../components/binary-tree/path-sum/MicroscopeView";
import PathSumWorkbench from "../../../components/binary-tree/path-sum/PathSumWorkbench";
import TracePanel from "../../../components/binary-tree/path-sum/TracePanel";
import { generateTrace } from "../../../components/binary-tree/path-sum/generateTrace";

const defaultInputs = {
  root: "5,4,8,11,null,13,4,7,2,null,null,null,1",
  target: "22"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root, values.target));
}

export default function PathSumPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Path Sum"
      difficulty="Easy"
      description="Trace the Path Sum algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "5,4,8,11,null,13,4,7,2,null,null,null,1", multiline: true, rows: 4, },
        { id: "target", label: "target", placeholder: "22", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <PathSumWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
