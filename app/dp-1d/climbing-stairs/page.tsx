"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-1d/climbing-stairs/CodePanel";
import MainVisualizer from "@/components/dp-1d/climbing-stairs/MainVisualizer";
import MicroscopeView from "@/components/dp-1d/climbing-stairs/MicroscopeView";
import TracePanel from "@/components/dp-1d/climbing-stairs/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-1d/climbing-stairs/generateTrace";

export default function ClimbingStairsPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-1d"
      categoryLabel="1D DP"
      taxonomy="1D DP / Fibonacci recurrence / stair counting"
      title="Climbing Stairs"
      difficulty="Easy"
      description="Climb a cinematic staircase where each landing resolves from the previous two answers, making the Fibonacci recurrence feel spatial and inevitable."
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
