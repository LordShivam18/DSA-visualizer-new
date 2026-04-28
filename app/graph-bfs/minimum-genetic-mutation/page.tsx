"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-bfs/minimum-genetic-mutation/CodePanel";
import MicroscopeView from "../../../components/graph-bfs/minimum-genetic-mutation/MicroscopeView";
import MinimumGeneticMutationWorkbench from "../../../components/graph-bfs/minimum-genetic-mutation/MinimumGeneticMutationWorkbench";
import TracePanel from "../../../components/graph-bfs/minimum-genetic-mutation/TracePanel";
import { generateTrace } from "../../../components/graph-bfs/minimum-genetic-mutation/generateTrace";

const defaultInputs = {
  startGene: "AACCGGTT",
  endGene: "AACCGGTA",
  bank: "[\"AACCGGTA\"]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values));
}

export default function MinimumGeneticMutationPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-bfs"
      categoryLabel="Graph BFS"
      taxonomy="Graph BFS / Trace-driven lesson"
      title="Minimum Genetic Mutation"
      difficulty="Medium"
      description="Trace the Minimum Genetic Mutation algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "startGene", label: "startGene", placeholder: "AACCGGTT", },
        { id: "endGene", label: "endGene", placeholder: "AACCGGTA", },
        { id: "bank", label: "bank", placeholder: "[\"AACCGGTA\"]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MinimumGeneticMutationWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
