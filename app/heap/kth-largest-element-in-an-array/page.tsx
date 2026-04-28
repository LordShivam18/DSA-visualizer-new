"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/heap/kth-largest-element-in-an-array/CodePanel";
import MicroscopeView from "../../../components/heap/kth-largest-element-in-an-array/MicroscopeView";
import KthLargestWorkbench from "../../../components/heap/kth-largest-element-in-an-array/KthLargestWorkbench";
import TracePanel from "../../../components/heap/kth-largest-element-in-an-array/TracePanel";
import { generateTrace } from "../../../components/heap/kth-largest-element-in-an-array/generateTrace";

const defaultInputs = {
  numbers: "3, 2, 1, 5, 6, 4",
  k: "2"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.numbers, values.k));
}

export default function KthLargestElementInAnArrayPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/heap"
      categoryLabel="Heap"
      taxonomy="Heap / Trace-driven lesson"
      title="Kth Largest Element in an Array"
      difficulty="Medium"
      description="Trace the Kth Largest Element in an Array algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "numbers", label: "numbers", placeholder: "3, 2, 1, 5, 6, 4", },
        { id: "k", label: "k", placeholder: "2", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <KthLargestWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
