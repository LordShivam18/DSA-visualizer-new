"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-tree/populating-next-right-pointers-ii/CodePanel";
import MicroscopeView from "../../../components/binary-tree/populating-next-right-pointers-ii/MicroscopeView";
import NextPointerTree from "../../../components/binary-tree/populating-next-right-pointers-ii/NextPointerTree";
import TracePanel from "../../../components/binary-tree/populating-next-right-pointers-ii/TracePanel";
import { generateTrace } from "../../../components/binary-tree/populating-next-right-pointers-ii/generateTrace";

const defaultInputs = {
  root: "1,2,3,4,5,null,7"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root));
}

export default function PopulatingNextRightPointersIiPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Populating Next Right Pointers II"
      difficulty="Medium"
      description="Trace the Populating Next Right Pointers II algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "1,2,3,4,5,null,7", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <NextPointerTree step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
