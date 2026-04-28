"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/math/palindrome/CodePanel";
import NumberCanvas from "@/components/math/palindrome/NumberCanvas";
import TracePanel from "@/components/math/palindrome/TracePanel";
import { generateTrace } from "@/components/math/palindrome/generateTrace";

const defaultInputs = { n: "121" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.n));
}

export default function PalindromeNumberPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/math"
      categoryLabel="Math"
      taxonomy="Math / Digit Reversal"
      title="Palindrome Number"
      difficulty="Easy"
      description="Trace half-number reversal and final comparison."
      complexity="O(log n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "n", label: "n", placeholder: "121" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <NumberCanvas step={step} />}
      renderMicroscope={() => null}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel highlight={step.highlight} />}
    />
  );
}
