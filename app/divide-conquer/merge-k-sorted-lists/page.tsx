"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/divide-conquer/merge-k-sorted-lists/CodePanel";
import MicroscopeView from "../../../components/divide-conquer/merge-k-sorted-lists/MicroscopeView";
import MergeKSortedListsWorkbench from "../../../components/divide-conquer/merge-k-sorted-lists/MergeKSortedListsWorkbench";
import TracePanel from "../../../components/divide-conquer/merge-k-sorted-lists/TracePanel";
import { generateTrace } from "../../../components/divide-conquer/merge-k-sorted-lists/generateTrace";

const defaultInputs = {
  lists: "[[1,4,5],[1,3,4],[2,6]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.lists));
}

export default function MergeKSortedListsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/divide-conquer"
      categoryLabel="Divide & Conquer"
      taxonomy="Divide & Conquer / Trace-driven lesson"
      title="Merge k Sorted Lists"
      difficulty="Hard"
      description="Trace the Merge k Sorted Lists algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "lists", label: "lists", placeholder: "[[1,4,5],[1,3,4],[2,6]]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MergeKSortedListsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
