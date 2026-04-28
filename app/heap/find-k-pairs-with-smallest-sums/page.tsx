"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/heap/find-k-pairs-with-smallest-sums/CodePanel";
import MicroscopeView from "../../../components/heap/find-k-pairs-with-smallest-sums/MicroscopeView";
import SmallestPairsWorkbench from "../../../components/heap/find-k-pairs-with-smallest-sums/SmallestPairsWorkbench";
import TracePanel from "../../../components/heap/find-k-pairs-with-smallest-sums/TracePanel";
import { generateTrace } from "../../../components/heap/find-k-pairs-with-smallest-sums/generateTrace";

const defaultInputs = {
  nums1: "1, 7, 11",
  nums2: "2, 4, 6",
  k: "3"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums1, values.nums2, values.k));
}

export default function FindKPairsWithSmallestSumsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/heap"
      categoryLabel="Heap"
      taxonomy="Heap / Trace-driven lesson"
      title="Find K Pairs with Smallest Sums"
      difficulty="Medium"
      description="Trace the Find K Pairs with Smallest Sums algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums1", label: "nums1", placeholder: "1, 7, 11", },
        { id: "nums2", label: "nums2", placeholder: "2, 4, 6", },
        { id: "k", label: "k", placeholder: "3", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SmallestPairsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
