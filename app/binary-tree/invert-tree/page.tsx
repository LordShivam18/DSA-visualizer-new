"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/invert-tree/CodePanel";
import TracePanel from "@/components/binary-tree/invert-tree/TracePanel";
import TreeCanvas from "@/components/binary-tree/invert-tree/TreeCanvas";
import { generateTrace } from "@/components/binary-tree/invert-tree/generateTrace";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace() {
  return toLessonTrace(generateTrace());
}

export default function InvertBinaryTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Invert Binary Tree"
      difficulty="Easy"
      description="Trace the recursive swaps that mirror every subtree."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => <TreeCanvas trace={trace} cursor={timeline.activeIndex} />}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline, teachingMode }) => <CodePanel trace={trace} cursor={timeline.activeIndex} mode={teachingMode} />}
    />
  );
}
