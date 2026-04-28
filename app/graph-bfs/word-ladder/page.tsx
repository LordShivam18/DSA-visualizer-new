"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-bfs/word-ladder/CodePanel";
import MicroscopeView from "../../../components/graph-bfs/word-ladder/MicroscopeView";
import WordLadderWorkbench from "../../../components/graph-bfs/word-ladder/WordLadderWorkbench";
import TracePanel from "../../../components/graph-bfs/word-ladder/TracePanel";
import { generateTrace } from "../../../components/graph-bfs/word-ladder/generateTrace";

const defaultInputs = {
  beginWord: "hit",
  endWord: "cog",
  wordList: "[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values));
}

export default function WordLadderPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-bfs"
      categoryLabel="Graph BFS"
      taxonomy="Graph BFS / Trace-driven lesson"
      title="Word Ladder"
      difficulty="Hard"
      description="Trace the Word Ladder algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "beginWord", label: "beginWord", placeholder: "hit", },
        { id: "endWord", label: "endWord", placeholder: "cog", },
        { id: "wordList", label: "wordList", placeholder: "[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <WordLadderWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
