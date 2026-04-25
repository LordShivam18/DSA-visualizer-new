"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CandyVisualizer from "../../../components/array-string/candy/CandyVisualizer";
import CodePanel from "../../../components/array-string/candy/CodePanel";
import Controls from "../../../components/array-string/candy/Controls";
import MicroscopeView from "../../../components/array-string/candy/MicroscopeView";
import TracePanel from "../../../components/array-string/candy/TracePanel";
import {
  generateTrace,
  type CandyTraceStep,
} from "../../../components/array-string/candy/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  ratings: "[1,0,2]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 5", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 4",
    values: { ratings: "[1,2,2]" },
  },
  {
    name: "Long slope",
    summary: "two-pass repair is visible",
    values: { ratings: "[1,3,4,5,2]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.ratings);
}

export default function CandyPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      CandyTraceStep,
      "beginner" | "expert"
    >
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Two-Pass Constraints"
      title="Candy"
      difficulty="Hard"
      description="Distribute the fewest candies by enforcing rating inequalities once from the left and once from the right."
      complexity="O(n) time / O(n) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "ratings", label: "ratings", placeholder: "[1,0,2]" },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="The left-to-right and right-to-left passes are rebuilt from the same trace, so prediction mode stays aligned with the greedy repair."
      Controls={Controls}
      Visualization={CandyVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
