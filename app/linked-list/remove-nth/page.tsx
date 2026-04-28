"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/linked-list/remove-nth/CodePanel";
import LinkedListTrack from "@/components/linked-list/remove-nth/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/remove-nth/MicroscopeView";
import TracePanel from "@/components/linked-list/remove-nth/TracePanel";
import { generateTrace } from "@/components/linked-list/remove-nth/generateTrace";

const defaultInputs = {
  nodes: "1,2,3,4,5",
  n: "2"
};
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function parseNums(raw: string) {
  return raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nodes), Number(values.n) || 1));
}

export default function RemoveNthNodeFromEndofListPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Pointer Trace"
      title="Remove Nth Node From End of List"
      difficulty="Medium"
      description="Trace the Remove Nth Node From End of List pointer algorithm through each mutation."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,4,5" },
        { id: "n", label: "n", placeholder: "2" }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LinkedListTrack step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step}  />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
