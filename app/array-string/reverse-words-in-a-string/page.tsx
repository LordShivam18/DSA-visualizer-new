"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CodePanel from "../../../components/array-string/reverse-words-in-a-string/CodePanel";
import Controls from "../../../components/array-string/reverse-words-in-a-string/Controls";
import MicroscopeView from "../../../components/array-string/reverse-words-in-a-string/MicroscopeView";
import ReverseWordsVisualizer from "../../../components/array-string/reverse-words-in-a-string/ReverseWordsVisualizer";
import TracePanel from "../../../components/array-string/reverse-words-in-a-string/TracePanel";
import {
  generateTrace,
  type ReverseWordsTraceStep,
} from "../../../components/array-string/reverse-words-in-a-string/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  s: "the sky is blue",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: '=> "blue is sky the"', values: { s: "the sky is blue" } },
  { name: "Example 2", summary: '=> "world hello"', values: { s: "  hello world  " } },
  { name: "Example 3", summary: '=> "example good a"', values: { s: "a good   example" } },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.s);
}

export default function ReverseWordsPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      ReverseWordsTraceStep,
      "beginner" | "expert"
    >
      variant="dark"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Tokenization / Reverse Assembly"
      title="Reverse Words in a String"
      difficulty="Medium"
      description="Normalize the input into clean tokens, then rebuild the sentence from the last token back to the first with exactly one space between words."
      complexity="O(n) time / O(k) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "s",
          label: "Sentence",
          placeholder: "the sky is blue",
          multiline: true,
          rows: 4,
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="Token cleanup and reverse assembly both come from the same trace, so the why panel can explain each normalization step without duplicated logic."
      Controls={Controls}
      Visualization={ReverseWordsVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
