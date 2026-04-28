"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/heap/find-median-from-data-stream/CodePanel";
import MicroscopeView from "../../../components/heap/find-median-from-data-stream/MicroscopeView";
import MedianStreamWorkbench from "../../../components/heap/find-median-from-data-stream/MedianStreamWorkbench";
import TracePanel from "../../../components/heap/find-median-from-data-stream/TracePanel";
import { generateTrace } from "../../../components/heap/find-median-from-data-stream/generateTrace";

const defaultInputs = {
  operations: "add 1\nadd 2\nmedian\nadd 3\nmedian"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.operations));
}

export default function FindMedianFromDataStreamPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/heap"
      categoryLabel="Heap"
      taxonomy="Heap / Trace-driven lesson"
      title="Find Median from Data Stream"
      difficulty="Hard"
      description="Trace the Find Median from Data Stream algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "operations", label: "operations", placeholder: "add 1\nadd 2\nmedian\nadd 3\nmedian", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MedianStreamWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
