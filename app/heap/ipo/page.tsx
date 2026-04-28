"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/heap/ipo/CodePanel";
import MicroscopeView from "../../../components/heap/ipo/MicroscopeView";
import IPOWorkbench from "../../../components/heap/ipo/IPOWorkbench";
import TracePanel from "../../../components/heap/ipo/TracePanel";
import { generateTrace } from "../../../components/heap/ipo/generateTrace";

const defaultInputs = {
  k: "2",
  capital: "0",
  profits: "1, 2, 3",
  requirements: "0, 1, 1"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.k, values.capital, values.profits, values.requirements));
}

export default function IpoPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/heap"
      categoryLabel="Heap"
      taxonomy="Heap / Trace-driven lesson"
      title="IPO"
      difficulty="Hard"
      description="Trace the IPO algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "k", label: "k", placeholder: "2", },
        { id: "capital", label: "capital", placeholder: "0", },
        { id: "profits", label: "profits", placeholder: "1, 2, 3", },
        { id: "requirements", label: "requirements", placeholder: "0, 1, 1", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <IPOWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
