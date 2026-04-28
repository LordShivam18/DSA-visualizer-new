"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayViz from "@/components/math/plus-one/ArrayViz";
import CodePanel from "@/components/math/plus-one/CodePanel";
import TracePanel from "@/components/math/plus-one/TracePanel";
import { generateTrace } from "@/components/math/plus-one/generateTrace";

const defaultInputs = { digits: "1,2,3" };
const presets = [{ name: "Default", summary: "[1,2,4]", values: defaultInputs }];

function parseDigits(raw: string) {
  const digits = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite).map((n) => Math.max(0, Math.min(9, Math.trunc(n))));
  return digits.length ? digits : [1, 2, 3];
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseDigits(values.digits)));
}

export default function PlusOnePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/math"
      categoryLabel="Math"
      taxonomy="Math / Carry Propagation"
      title="Plus One"
      difficulty="Easy"
      description="Trace carry propagation from the final digit toward the front."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "digits", label: "digits", placeholder: "1,2,3" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => <ArrayViz trace={trace} cursor={timeline.activeIndex} />}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline }) => <CodePanel trace={trace} cursor={timeline.activeIndex} />}
    />
  );
}
