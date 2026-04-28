"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-search/find-first-last-position/CodePanel";
import MicroscopeView from "../../../components/binary-search/find-first-last-position/MicroscopeView";
import RangeSearchVisualizer from "../../../components/binary-search/find-first-last-position/RangeSearchVisualizer";
import TracePanel from "../../../components/binary-search/find-first-last-position/TracePanel";
import { generateTrace } from "../../../components/binary-search/find-first-last-position/generateTrace";

const defaultInputs = {
  nums: "5 7 7 8 8 10",
  target: "8"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums, values.target));
}

export default function FindFirstLastPositionPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Trace-driven lesson"
      title="Find First and Last Position"
      difficulty="Medium"
      description="Trace the Find First and Last Position algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "5 7 7 8 8 10", },
        { id: "target", label: "target", placeholder: "8", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <RangeSearchVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
