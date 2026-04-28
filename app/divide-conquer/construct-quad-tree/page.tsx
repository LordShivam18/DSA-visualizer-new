"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/divide-conquer/construct-quad-tree/CodePanel";
import MicroscopeView from "../../../components/divide-conquer/construct-quad-tree/MicroscopeView";
import ConstructQuadTreeWorkbench from "../../../components/divide-conquer/construct-quad-tree/ConstructQuadTreeWorkbench";
import TracePanel from "../../../components/divide-conquer/construct-quad-tree/TracePanel";
import { generateTrace } from "../../../components/divide-conquer/construct-quad-tree/generateTrace";

const defaultInputs = {
  grid: "[[0,1],[1,0]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.grid));
}

export default function ConstructQuadTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/divide-conquer"
      categoryLabel="Divide & Conquer"
      taxonomy="Divide & Conquer / Trace-driven lesson"
      title="Construct Quad Tree"
      difficulty="Medium"
      description="Trace the Construct Quad Tree algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "grid", label: "grid", placeholder: "[[0,1],[1,0]]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <ConstructQuadTreeWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
