"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/interleaving-string/CodePanel";
import MainVisualizer from "@/components/dp-2d/interleaving-string/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/interleaving-string/MicroscopeView";
import TracePanel from "@/components/dp-2d/interleaving-string/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/interleaving-string/generateTrace";

export default function InterleavingStringPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / string weave / prefix compatibility"
      title="Interleaving String"
      difficulty="Medium"
      description="Use a weave loom to track whether prefixes of two source strings can interlace cleanly into the target ribbon."
      complexity="O(m*n) time / O(m*n) space"
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
