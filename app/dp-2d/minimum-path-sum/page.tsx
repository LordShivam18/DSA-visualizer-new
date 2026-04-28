"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/minimum-path-sum/CodePanel";
import MainVisualizer from "@/components/dp-2d/minimum-path-sum/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/minimum-path-sum/MicroscopeView";
import TracePanel from "@/components/dp-2d/minimum-path-sum/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/minimum-path-sum/generateTrace";

export default function MinimumPathSumPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / grid path cost / right and down transitions"
      title="Minimum Path Sum"
      difficulty="Medium"
      description="Traverse a luminous atlas where every cell chooses the cheaper path from above or left until the destination cost stabilizes."
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
