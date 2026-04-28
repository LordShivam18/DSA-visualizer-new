"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/triangle/CodePanel";
import MainVisualizer from "@/components/dp-2d/triangle/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/triangle/MicroscopeView";
import TracePanel from "@/components/dp-2d/triangle/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/triangle/generateTrace";

export default function TrianglePage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / triangular grid / minimum path sum"
      title="Triangle"
      difficulty="Medium"
      description="Descend through a crystal lattice where each cell inherits the cheaper of its two parents above and the minimum path reveals itself in the bottom row."
      complexity="O(rows²) time / O(rows²) space"
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
