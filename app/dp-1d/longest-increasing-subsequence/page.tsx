"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-1d/longest-increasing-subsequence/CodePanel";
import MainVisualizer from "@/components/dp-1d/longest-increasing-subsequence/MainVisualizer";
import MicroscopeView from "@/components/dp-1d/longest-increasing-subsequence/MicroscopeView";
import TracePanel from "@/components/dp-1d/longest-increasing-subsequence/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-1d/longest-increasing-subsequence/generateTrace";

export default function LisPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-1d"
      categoryLabel="1D DP"
      taxonomy="1D DP / subsequence extension / quadratic scan"
      title="Longest Increasing Subsequence"
      difficulty="Medium"
      description="Build a skyline of subsequence lengths and watch each number search left for a lower tower that can launch a longer increasing chain."
      complexity="O(n²) time / O(n) space"
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
