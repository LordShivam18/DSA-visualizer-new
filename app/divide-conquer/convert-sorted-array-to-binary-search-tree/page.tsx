"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree/CodePanel";
import MicroscopeView from "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree/MicroscopeView";
import SortedArrayToBSTWorkbench from "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree/SortedArrayToBSTWorkbench";
import TracePanel from "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree/TracePanel";
import { generateTrace } from "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree/generateTrace";

const defaultInputs = {
  nums: "-10, -3, 0, 5, 9"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums));
}

export default function ConvertSortedArrayToBinarySearchTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/divide-conquer"
      categoryLabel="Divide & Conquer"
      taxonomy="Divide & Conquer / Trace-driven lesson"
      title="Convert Sorted Array to Binary Search Tree"
      difficulty="Easy"
      description="Trace the Convert Sorted Array to Binary Search Tree algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "-10, -3, 0, 5, 9", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SortedArrayToBSTWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
