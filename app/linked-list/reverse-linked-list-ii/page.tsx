"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/linked-list/reverse-linked-list-ii/CodePanel";
import LinkedListTrack from "@/components/linked-list/reverse-linked-list-ii/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/reverse-linked-list-ii/MicroscopeView";
import TracePanel from "@/components/linked-list/reverse-linked-list-ii/TracePanel";
import { generateTrace } from "@/components/linked-list/reverse-linked-list-ii/generateTrace";

const defaultInputs = {
  nodes: "1,2,3,4,5",
  left: "2",
  right: "4"
};
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function parseNums(raw: string) {
  return raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nodes), Number(values.left) || 1, Number(values.right) || 1));
}

export default function ReverseLinkedListIIPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Pointer Trace"
      title="Reverse Linked List II"
      difficulty="Medium"
      description="Trace the Reverse Linked List II pointer algorithm through each mutation."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,4,5" },
        { id: "left", label: "left", placeholder: "2" },
        { id: "right", label: "right", placeholder: "4" }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LinkedListTrack step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
