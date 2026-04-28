"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/two-pointers/valid-palindrome/CodePanel";
import MicroscopeView from "@/components/two-pointers/valid-palindrome/MicroscopeView";
import PalindromeBox from "@/components/two-pointers/valid-palindrome/PalindromeBox";
import { generateTrace } from "@/components/two-pointers/valid-palindrome/generateTrace";

const defaultInputs = { s: "A man, a plan, a canal: Panama" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.s));
}

export default function ValidPalindromePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Normalized Mirror Scan"
      title="Valid Palindrome"
      difficulty="Easy"
      description="Trace normalized character comparisons from both ends toward the center."
      complexity="O(n) time / O(n) normalized buffer"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "s", label: "s", placeholder: "A man, a plan, a canal: Panama", multiline: true, rows: 3 }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <PalindromeBox step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.headline}</div>}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
