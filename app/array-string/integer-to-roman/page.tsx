"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CodePanel from "../../../components/array-string/integer-to-roman/CodePanel";
import Controls from "../../../components/array-string/integer-to-roman/Controls";
import IntegerToRomanVisualizer from "../../../components/array-string/integer-to-roman/IntegerToRomanVisualizer";
import MicroscopeView from "../../../components/array-string/integer-to-roman/MicroscopeView";
import TracePanel from "../../../components/array-string/integer-to-roman/TracePanel";
import {
  generateTrace,
  type IntegerToRomanTraceStep,
} from "../../../components/array-string/integer-to-roman/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  num: "3749",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> MMMDCCXLIX", values: { num: "3749" } },
  { name: "Compact", summary: "=> LVIII", values: { num: "58" } },
  { name: "Subtractive", summary: "=> MCMXCIV", values: { num: "1994" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.num);
}

export default function IntegerToRomanPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      IntegerToRomanTraceStep,
      "beginner" | "expert"
    >
      variant="dark"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Denominations / Roman Numerals"
      title="Integer to Roman"
      difficulty="Medium"
      description="Convert an integer into a Roman numeral by greedily minting the largest denomination that still fits the remaining value."
      complexity="O(1) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "num",
          label: "Integer",
          placeholder: "3749",
          helper:
            "Values are clamped safely into the standard Roman range 1..3999.",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="Roman numerals regenerate from the same denomination trace, so prediction mode stays aligned with the greedy conversion."
      Controls={Controls}
      Visualization={IntegerToRomanVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
