"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/same-tree/CodePanel";
import TracePanel from "@/components/binary-tree/same-tree/TracePanel";
import TreeCanvas from "@/components/binary-tree/same-tree/TreeCanvas";
import { generateTrace } from "@/components/binary-tree/same-tree/generateTrace";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace() {
  return toLessonTrace(generateTrace());
}

export default function SameTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Same Tree"
      difficulty="Easy"
      description="Trace paired recursive comparisons between two binary trees."
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => <TreeCanvas trace={trace} cursor={timeline.activeIndex} />}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline }) => <CodePanel trace={trace} cursor={timeline.activeIndex}  />}
    />
  );
}
