"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixControls from "../../../components/matrix/shared/MatrixControls";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import type { PresetConfig } from "../../../components/matrix/shared/types";
import {
  generateTrace,
  type SpiralMatrixTraceStep,
} from "../../../components/matrix/spiral-matrix/generateTrace";
import SpiralMatrixVisualizer from "../../../components/matrix/spiral-matrix/SpiralMatrixVisualizer";

const codeLines = [
  "const result = [];",
  "let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;",
  "while (top <= bottom && left <= right) {",
  "  for (let c = left; c <= right; c += 1) result.push(matrix[top][c]);",
  "  top += 1;",
  "  for (let r = top; r <= bottom; r += 1) result.push(matrix[r][right]);",
  "  right -= 1;",
  "  if (top <= bottom) for (let c = right; c >= left; c -= 1) result.push(matrix[bottom][c]);",
  "  if (left <= right) for (let r = bottom; r >= top; r -= 1) result.push(matrix[r][left]);",
  "}",
];

const defaultInputs = {
  matrix: "[[1,2,3],[4,5,6],[7,8,9]]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> [1,2,3,6,9,8,7,4,5]", values: defaultInputs },
  {
    name: "Rectangle",
    summary: "=> [1,2,3,4,8,12,11,10,9,5,6,7]",
    values: { matrix: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]" },
  },
  {
    name: "Single Column",
    summary: "=> [1,2,3]",
    values: { matrix: "[[1],[2],[3]]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.matrix);
}

export default function SpiralMatrixPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      SpiralMatrixTraceStep,
      "beginner" | "expert"
    >
      variant="matrix"
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / Simulation / Boundary contraction"
      title="Spiral Matrix"
      difficulty="Medium"
      description="Return all elements in spiral order by shrinking the outer rectangle after each directional sweep."
      complexity="O(mn) time / O(1) extra traversal state"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "matrix",
          label: "matrix",
          multiline: true,
          rows: 5,
          placeholder: "[[1,2,3],[4,5,6],[7,8,9]]",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      buildTrace={buildTrace}
      inputHint="Boundary contraction always regenerates from the same trace, so prediction mode can ask about the real next sweep."
      Controls={MatrixControls}
      Visualization={SpiralMatrixVisualizer}
      Microscope={MatrixMicroscopeView}
      TracePanel={MatrixTracePanel}
      renderCodePanel={({ step }) => (
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "O(1) traversal state", "Boundary sweeps"]}
        />
      )}
    />
  );
}
