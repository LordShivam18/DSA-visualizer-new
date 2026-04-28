"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/unique-paths-ii/CodePanel";
import MainVisualizer from "@/components/dp-2d/unique-paths-ii/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/unique-paths-ii/MicroscopeView";
import TracePanel from "@/components/dp-2d/unique-paths-ii/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/unique-paths-ii/generateTrace";

export default function UniquePathsIIPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / obstacle grid / path counting"
      title="Unique Paths II"
      difficulty="Medium"
      description="Watch path counts flow around obstacles as the robot's reachable field expands through the grid one open cell at a time."
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
