"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import CodePanel from "../../../components/array-string/gas-station/CodePanel";
import Controls from "../../../components/array-string/gas-station/Controls";
import GasStationVisualizer from "../../../components/array-string/gas-station/GasStationVisualizer";
import MicroscopeView from "../../../components/array-string/gas-station/MicroscopeView";
import TracePanel from "../../../components/array-string/gas-station/TracePanel";
import {
  generateTrace,
  type GasStationTraceStep,
} from "../../../components/array-string/gas-station/generateTrace";
import type { PresetConfig } from "../../../components/array-string/shared/types";

const defaultInputs = {
  gas: "[1,2,3,4,5]",
  cost: "[3,4,5,1,2]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> 3", values: defaultInputs },
  {
    name: "No solution",
    summary: "=> -1",
    values: { gas: "[2,3,4]", cost: "[3,4,3]" },
  },
  {
    name: "Small route",
    summary: "candidate resets once",
    values: { gas: "[5,1,2,3,4]", cost: "[4,4,1,5,1]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.gas, values.cost);
}

export default function GasStationPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      GasStationTraceStep,
      "beginner" | "expert"
    >
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Circuit Proof"
      title="Gas Station"
      difficulty="Medium"
      description="Find the unique start index by combining a global balance check with a local running tank that resets on failure."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "gas", label: "gas", placeholder: "[1,2,3,4,5]" },
        { id: "cost", label: "cost", placeholder: "[3,4,5,1,2]" },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="The global balance proof and local tank resets come from the same trace, so the next-step prediction always matches the real greedy transition."
      Controls={Controls}
      Visualization={GasStationVisualizer}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
