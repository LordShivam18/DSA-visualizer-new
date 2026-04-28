"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/symmetric-tree/CodePanel";
import TracePanel from "@/components/binary-tree/symmetric-tree/TracePanel";
import TreeCanvas from "@/components/binary-tree/symmetric-tree/TreeCanvas";
import { generateTrace } from "@/components/binary-tree/symmetric-tree/generateTrace";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace() {
  return toLessonTrace(generateTrace());
}

export default function SymmetricTreePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Symmetric Tree"
      difficulty="Easy"
      description="Trace mirror comparisons between left and right subtrees."
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
