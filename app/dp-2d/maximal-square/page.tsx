"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/maximal-square/CodePanel";
import MainVisualizer from "@/components/dp-2d/maximal-square/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/maximal-square/MicroscopeView";
import TracePanel from "@/components/dp-2d/maximal-square/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/maximal-square/generateTrace";

export default function MaximalSquarePage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / square growth / binary matrix"
      title="Maximal Square"
      difficulty="Medium"
      description="Use a square radar to grow all-ones squares from every valid cell and watch the largest area emerge from the DP field."
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
