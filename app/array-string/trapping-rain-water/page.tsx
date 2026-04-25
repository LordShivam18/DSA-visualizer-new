"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CodePanel from "../../../components/array-string/trapping-rain-water/CodePanel";
import Controls from "../../../components/array-string/trapping-rain-water/Controls";
import MicroscopeView from "../../../components/array-string/trapping-rain-water/MicroscopeView";
import TracePanel from "../../../components/array-string/trapping-rain-water/TracePanel";
import TrappingRainWaterVisualizer from "../../../components/array-string/trapping-rain-water/TrappingRainWaterVisualizer";
import {
  generateTrace,
  type TrappingRainWaterTraceStep,
} from "../../../components/array-string/trapping-rain-water/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  height: "[0,1,0,2,1,0,1,3,2,1,2,1]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 6", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> 9",
    values: { height: "[4,2,0,3,2,5]" },
  },
  {
    name: "Small basin",
    summary: "single valley",
    values: { height: "[3,0,2,0,4]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.height);
}

export default function TrappingRainWaterPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      TrappingRainWaterTraceStep,
      "beginner" | "expert"
    >
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Two-Pointer Boundary Maxima"
      title="Trapping Rain Water"
      difficulty="Hard"
      description="Count trapped water in one pass by always resolving the shorter side and maintaining left and right boundary maxima."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "height",
          label: "height",
          placeholder: "[0,1,0,2,1,0,1,3,2,1,2,1]",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="Each scenario rebuilds the same two-pointer boundary trace, so why-panel reasoning and prediction checkpoints stay in sync."
      Controls={Controls}
      Visualization={TrappingRainWaterVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
