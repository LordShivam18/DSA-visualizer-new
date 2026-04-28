"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayViz from "@/components/kadane/ArrayViz";
import ChartViz from "@/components/kadane/ChartViz";
import CodePanel from "@/components/kadane/CodePanel";
import TracePanel from "@/components/kadane/TracePanel";
import { generateTrace } from "@/components/kadane/generateTrace";

const defaultInputs = { nums: "-2,1,-3,4,-1,2,1,-5,4" };
const presets = [{ name: "Default", summary: "max = 6", values: defaultInputs }];

function parseNums(raw: string) {
  const values = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  return values.length ? values : undefined;
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nums)));
}

export default function MaxSubarrayPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/kadane"
      categoryLabel="Kadane"
      taxonomy="Kadane / Running Best Subarray"
      title="Maximum Subarray"
      difficulty="Medium"
      description="Trace Kadane's running sum and best range updates."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "-2,1,-3,4,-1,2,1,-5,4" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => (
        <div className="space-y-4">
          <ArrayViz trace={trace} cursor={timeline.activeIndex} />
          <ChartViz trace={trace} cursor={timeline.activeIndex} />
        </div>
      )}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline }) => <CodePanel trace={trace} cursor={timeline.activeIndex} />}
    />
  );
}
