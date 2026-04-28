"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CodePanel from "../../../components/array-string/roman-to-integer/CodePanel";
import Controls from "../../../components/array-string/roman-to-integer/Controls";
import MicroscopeView from "../../../components/array-string/roman-to-integer/MicroscopeView";
import RomanToIntegerVisualizer from "../../../components/array-string/roman-to-integer/RomanToIntegerVisualizer";
import TracePanel from "../../../components/array-string/roman-to-integer/TracePanel";
import {
  generateTrace,
  type RomanToIntegerTraceStep,
} from "../../../components/array-string/roman-to-integer/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  roman: "MCMXCIV",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: { roman: "III" } },
  { name: "Example 2", summary: "=> 58", values: { roman: "LVIII" } },
  { name: "Example 3", summary: "=> 1994", values: { roman: "MCMXCIV" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.roman);
}

export default function RomanToIntegerPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      RomanToIntegerTraceStep,
      "beginner" | "expert"
    >
      variant="dark"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Roman Numerals / Lookahead"
      title="Roman to Integer"
      difficulty="Easy"
      description="Convert a Roman numeral into an integer by comparing each glyph to its immediate lookahead and turning it into a signed contribution."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "roman",
          label: "Roman numeral",
          placeholder: "MCMXCIV",
          helper: "Invalid characters are ignored safely.",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      generateTrace={buildTrace}
      inputHint="The signed-contribution trace is rebuilt on every run, so prediction mode always asks about the real next lookahead decision."
      Controls={Controls}
      Visualization={RomanToIntegerVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
