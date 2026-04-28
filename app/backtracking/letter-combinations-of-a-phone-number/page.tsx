"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/backtracking/letter-combinations-of-a-phone-number/CodePanel";
import MicroscopeView from "../../../components/backtracking/letter-combinations-of-a-phone-number/MicroscopeView";
import LetterCombinationsWorkbench from "../../../components/backtracking/letter-combinations-of-a-phone-number/LetterCombinationsWorkbench";
import TracePanel from "../../../components/backtracking/letter-combinations-of-a-phone-number/TracePanel";
import { generateTrace } from "../../../components/backtracking/letter-combinations-of-a-phone-number/generateTrace";

const defaultInputs = {
  digits: "23"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.digits));
}

export default function LetterCombinationsOfAPhoneNumberPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/backtracking"
      categoryLabel="Backtracking"
      taxonomy="Backtracking / Trace-driven lesson"
      title="Letter Combinations of a Phone Number"
      difficulty="Medium"
      description="Trace the Letter Combinations of a Phone Number algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "digits", label: "digits", placeholder: "23", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <LetterCombinationsWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
