"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-bfs/snakes-and-ladders/CodePanel";
import MicroscopeView from "../../../components/graph-bfs/snakes-and-ladders/MicroscopeView";
import SnakesAndLaddersWorkbench from "../../../components/graph-bfs/snakes-and-ladders/SnakesAndLaddersWorkbench";
import TracePanel from "../../../components/graph-bfs/snakes-and-ladders/TracePanel";
import { generateTrace } from "../../../components/graph-bfs/snakes-and-ladders/generateTrace";

const defaultInputs = {
  board: "[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.board));
}

export default function SnakesAndLaddersPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-bfs"
      categoryLabel="Graph BFS"
      taxonomy="Graph BFS / Trace-driven lesson"
      title="Snakes and Ladders"
      difficulty="Medium"
      description="Trace the Snakes and Ladders algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "board", label: "board", placeholder: "[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <SnakesAndLaddersWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
