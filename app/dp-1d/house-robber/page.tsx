"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-1d/house-robber/CodePanel";
import MainVisualizer from "@/components/dp-1d/house-robber/MainVisualizer";
import MicroscopeView from "@/components/dp-1d/house-robber/MicroscopeView";
import TracePanel from "@/components/dp-1d/house-robber/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-1d/house-robber/generateTrace";

export default function HouseRobberPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-1d"
      categoryLabel="1D DP"
      taxonomy="1D DP / take-or-skip / prefix maximization"
      title="House Robber"
      difficulty="Medium"
      description="Plan a silent heist one house at a time and watch the DP planner choose between taking the current house or preserving the previous best prefix."
      complexity="O(n) time / O(n) space"
      inputFields={inputFields}
      defaultInputs={defaultInputs}
      presets={presets}
      buildTrace={generateTrace}
      MainVisualizer={MainVisualizer}
      MicroscopeView={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
