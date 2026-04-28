"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/linked-list/rotate-list/CodePanel";
import LinkedListTrack from "@/components/linked-list/rotate-list/LinkedListTrack";
import MicroscopeView from "@/components/linked-list/rotate-list/MicroscopeView";
import TracePanel from "@/components/linked-list/rotate-list/TracePanel";
import { generateTrace } from "@/components/linked-list/rotate-list/generateTrace";

const defaultInputs = {
  nodes: "1,2,3,4,5",
  k: "2"
};
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function parseNums(raw: string) {
  return raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nodes), Number(values.k) || 0));
}

export default function RotateListPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Pointer Trace"
      title="Rotate List"
      difficulty="Medium"
      description="Trace the Rotate List pointer algorithm through each mutation."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,4,5" },
        { id: "k", label: "k", placeholder: "2" }
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
