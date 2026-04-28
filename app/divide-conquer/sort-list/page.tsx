"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/divide-conquer/sort-list/CodePanel";
import MicroscopeView from "../../../components/divide-conquer/sort-list/MicroscopeView";
import SortListWorkbench from "../../../components/divide-conquer/sort-list/SortListWorkbench";
import TracePanel from "../../../components/divide-conquer/sort-list/TracePanel";
import { generateTrace } from "../../../components/divide-conquer/sort-list/generateTrace";

const defaultInputs = {
  list: "4, 2, 1, 3"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.list));
}

export default function SortListPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/divide-conquer"
      categoryLabel="Divide & Conquer"
      taxonomy="Divide & Conquer / Trace-driven lesson"
      title="Sort List"
      difficulty="Medium"
      description="Trace the Sort List algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "list", label: "list", placeholder: "4, 2, 1, 3", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SortListWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
