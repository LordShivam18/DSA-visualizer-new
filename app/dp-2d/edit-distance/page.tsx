"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/edit-distance/CodePanel";
import MainVisualizer from "@/components/dp-2d/edit-distance/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/edit-distance/MicroscopeView";
import TracePanel from "@/components/dp-2d/edit-distance/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/edit-distance/generateTrace";

export default function EditDistancePage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / string transformation / operation cost matrix"
      title="Edit Distance"
      difficulty="Medium"
      description="Step through an edit laboratory where insert, delete, and replace compete cell by cell inside the transformation matrix."
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
