"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayBar from "@/components/binary-search/median-two-sorted/ArrayBar";
import CodePanelM2 from "@/components/binary-search/median-two-sorted/CodePanelM2";
import PartitionView from "@/components/binary-search/median-two-sorted/PartitionView";
import StatsPanelM2 from "@/components/binary-search/median-two-sorted/StatsPanelM2";
import { generateTrace } from "@/components/binary-search/median-two-sorted/generateTrace";

const defaultInputs = { nums1: "1,3", nums2: "2" };
const presets = [{ name: "Default", summary: "median = 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums1, values.nums2));
}

export default function MedianTwoSortedPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Partition Search"
      title="Median of Two Sorted Arrays"
      difficulty="Hard"
      description="Binary-search the smaller array until both partitions agree on the median boundary."
      complexity="O(log min(m,n)) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums1", label: "nums1", placeholder: "1,3" },
        { id: "nums2", label: "nums2", placeholder: "2" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-4">
          <ArrayBar nums1={step.state.nums1} nums2={step.state.nums2} i={step.state.i} j={step.state.j} status={step.state.status} />
          <PartitionView nums1={step.state.nums1} nums2={step.state.nums2} i={step.state.i} j={step.state.j} relation={step.state.relation} />
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelM2
          nums1={step.state.nums1}
          nums2={step.state.nums2}
          i={step.state.i}
          j={step.state.j}
          status={step.state.status}
          median={step.state.median}
          relation={step.state.relation}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => (
        <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>
      )}
      renderCodePanel={({ step, teachingMode }) => <CodePanelM2 activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
