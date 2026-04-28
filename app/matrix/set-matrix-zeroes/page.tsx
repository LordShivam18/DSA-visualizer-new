"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixControls from "../../../components/matrix/shared/MatrixControls";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import type { PresetConfig } from "../../../components/matrix/shared/types";
import {
  generateTrace,
  type SetMatrixZeroesTraceStep,
} from "../../../components/matrix/set-matrix-zeroes/generateTrace";
import SetMatrixZeroesVisualizer from "../../../components/matrix/set-matrix-zeroes/SetMatrixZeroesVisualizer";

const codeLines = [
  "const firstRowZero = matrix[0].includes(0);",
  "const firstColZero = matrix.some((row) => row[0] === 0);",
  "for (let r = 1; r < rows; r += 1) for (let c = 1; c < cols; c += 1) if (matrix[r][c] === 0) matrix[r][0] = matrix[0][c] = 0;",
  "for (let r = 1; r < rows; r += 1) for (let c = 1; c < cols; c += 1) if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;",
  "if (firstRowZero) for (let c = 0; c < cols; c += 1) matrix[0][c] = 0;",
  "if (firstColZero) for (let r = 0; r < rows; r += 1) matrix[r][0] = 0;",
];

const defaultInputs = {
  matrix: "[[1,1,1],[1,0,1],[1,1,1]]",
};

const presets: PresetConfig[] = [
  { name: "Example 1", summary: "=> [[1,0,1],[0,0,0],[1,0,1]]", values: defaultInputs },
  {
    name: "Example 2",
    summary: "=> [[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
    values: { matrix: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]" },
  },
  {
    name: "No Zeroes",
    summary: "=> unchanged",
    values: { matrix: "[[1,2],[3,4]]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.matrix);
}

export default function SetMatrixZeroesPage() {
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      SetMatrixZeroesTraceStep,
      "beginner" | "expert"
    >
      variant="matrix"
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / In-place markers / Row and column propagation"
      title="Set Matrix Zeroes"
      difficulty="Medium"
      description="If any cell is zero, set its entire row and column to zero while reusing the first row and first column as marker storage."
      complexity="O(mn) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "matrix",
          label: "matrix",
          multiline: true,
          rows: 5,
          placeholder: "[[1,1,1],[1,0,1],[1,1,1]]",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      generateTrace={buildTrace}
      inputHint="Marker rows and columns regenerate from the same trace, so the why panel can explain every zero-propagation decision."
      Controls={MatrixControls}
      Visualization={SetMatrixZeroesVisualizer}
      Microscope={MatrixMicroscopeView}
      TracePanel={MatrixTracePanel}
      renderCodePanel={({ step }) => (
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "O(1) extra space", "Marker lanes"]}
        />
      )}
    />
  );
}
