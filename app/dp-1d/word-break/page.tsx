"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-1d/word-break/CodePanel";
import MainVisualizer from "@/components/dp-1d/word-break/MainVisualizer";
import MicroscopeView from "@/components/dp-1d/word-break/MicroscopeView";
import TracePanel from "@/components/dp-1d/word-break/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-1d/word-break/generateTrace";

export default function WordBreakPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-1d"
      categoryLabel="1D DP"
      taxonomy="1D DP / prefix reachability / string segmentation"
      title="Word Break"
      difficulty="Medium"
      description="See segmentation as a timeline of reachable cut positions, where dictionary words bridge one valid cut to the next across the source string."
      complexity="O(n²) time / O(n) space"
      inputFields={inputFields}
      defaultInputs={defaultInputs}
      presets={presets}
      generateTrace={generateTrace}
      MainVisualizer={MainVisualizer}
      MicroscopeView={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
