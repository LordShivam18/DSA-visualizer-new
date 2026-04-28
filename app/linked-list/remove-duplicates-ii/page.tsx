"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/linked-list/remove-duplicates-ii/CodePanel";
import LinkedListTrack from "@/components/linked-list/remove-duplicates-ii/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/remove-duplicates-ii/MicroscopeView";
import TracePanel from "@/components/linked-list/remove-duplicates-ii/TracePanel";
import { generateTrace } from "@/components/linked-list/remove-duplicates-ii/generateTrace";

const defaultInputs = {
  nodes: "1,2,3,3,4,4,5"
};
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function parseNums(raw: string) {
  return raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nodes)));
}

export default function RemoveDuplicatesfromSortedListIIPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Pointer Trace"
      title="Remove Duplicates from Sorted List II"
      difficulty="Medium"
      description="Trace the Remove Duplicates from Sorted List II pointer algorithm through each mutation."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,3,4,4,5" }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LinkedListTrack step={step} />}
      renderMicroscope={({ step }) => <MicroscopeView step={step}  />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
