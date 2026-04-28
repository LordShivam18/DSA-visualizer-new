"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-search/find-peak-element/CodePanel";
import MicroscopeView from "../../../components/binary-search/find-peak-element/MicroscopeView";
import PeakSearchVisualizer from "../../../components/binary-search/find-peak-element/PeakSearchVisualizer";
import TracePanel from "../../../components/binary-search/find-peak-element/TracePanel";
import { generateTrace } from "../../../components/binary-search/find-peak-element/generateTrace";

const defaultInputs = {
  nums: "1 2 3 1"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums));
}

export default function FindPeakElementPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Trace-driven lesson"
      title="Find Peak Element"
      difficulty="Medium"
      description="Trace the Find Peak Element algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "1 2 3 1", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <PeakSearchVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
