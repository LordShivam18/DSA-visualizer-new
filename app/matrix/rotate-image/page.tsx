"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixControls from "../../../components/matrix/shared/MatrixControls";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import type { PresetConfig } from "../../../components/matrix/shared/types";
import {
  generateTrace,
  type RotateImageTraceStep,
} from "../../../components/matrix/rotate-image/generateTrace";
import RotateImageVisualizer from "../../../components/matrix/rotate-image/RotateImageVisualizer";

const codeLines = [
  "const n = matrix.length;",
  "if (n === 0) return matrix;",
  "for (let r = 0; r < n; r += 1) {",
  "  for (let c = r + 1; c < n; c += 1) {",
  "    [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];",
  "  }",
  "}",
  "for (const row of matrix) row.reverse();",
  "return matrix;",
];

const defaultInputs = {
  matrix: "[[1,2,3],[4,5,6],[7,8,9]]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> [[7,4,1],[8,5,2],[9,6,3]]", values: defaultInputs },
  {
    name: "4 x 4",
    summary: "=> [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
    values: {
      matrix: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
    },
  },
  {
    name: "2 x 2",
    summary: "=> [[3,1],[4,2]]",
    values: { matrix: "[[1,2],[3,4]]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.matrix);
}

export default function RotateImagePage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      RotateImageTraceStep,
      "beginner" | "expert"
    >
      variant="matrix"
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / In-place transform / Transpose + reverse"
      title="Rotate Image"
      difficulty="Medium"
      description="Rotate an n x n matrix clockwise by 90 degrees in place using a transpose pass followed by row reversals."
      complexity="O(n²) time / O(1) extra space"
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
      inputHint="Each run rebuilds the in-place matrix trace, so transpose and reverse steps stay synchronized with prediction mode."
      Controls={MatrixControls}
      Visualization={RotateImageVisualizer}
      Microscope={MatrixMicroscopeView}
      TracePanel={MatrixTracePanel}
      renderCodePanel={({ step }) => (
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(n²) time", "In-place swaps", "Two matrix passes"]}
        />
      )}
    />
  );
}
