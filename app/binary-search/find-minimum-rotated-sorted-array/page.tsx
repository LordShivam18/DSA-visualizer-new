"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-search/find-minimum-rotated-sorted-array/CodePanel";
import MicroscopeView from "../../../components/binary-search/find-minimum-rotated-sorted-array/MicroscopeView";
import MinimumSearchVisualizer from "../../../components/binary-search/find-minimum-rotated-sorted-array/MinimumSearchVisualizer";
import TracePanel from "../../../components/binary-search/find-minimum-rotated-sorted-array/TracePanel";
import { generateTrace } from "../../../components/binary-search/find-minimum-rotated-sorted-array/generateTrace";

const defaultInputs = {
  nums: "3 4 5 1 2"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums));
}

export default function FindMinimumRotatedSortedArrayPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Trace-driven lesson"
      title="Find Minimum in Rotated Sorted Array"
      difficulty="Medium"
      description="Trace the Find Minimum in Rotated Sorted Array algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "3 4 5 1 2", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MinimumSearchVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
