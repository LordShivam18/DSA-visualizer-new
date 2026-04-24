"use client";

import { useState } from "react";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixControls from "../../../components/matrix/shared/MatrixControls";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixProblemShell from "../../../components/matrix/shared/MatrixProblemShell";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import type { PresetConfig } from "../../../components/matrix/shared/types";
import { matrixPanelClassName } from "../../../components/matrix/shared/ui";
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
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<SpiralMatrixTraceStep[]>(() =>
    buildTrace(defaultInputs)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");
  const step = trace[Math.min(cursor, trace.length - 1)];

  function run(nextValues = inputs) {
    setInputs(nextValues);
    setTrace(buildTrace(nextValues));
    setCursor(0);
  }

  return (
    <MatrixProblemShell
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / Simulation / Boundary contraction"
      title="Spiral Matrix"
      difficulty="Medium"
      description="Return all elements in spiral order by shrinking the outer rectangle after each directional sweep."
      complexity="O(mn) time / O(1) extra traversal state"
      inputFields={[
        {
          key: "matrix",
          label: "matrix",
          multiline: true,
          rows: 5,
          placeholder: "[[1,2,3],[4,5,6],[7,8,9]]",
        },
      ]}
      inputValues={inputs}
      onInputChange={(key, value) =>
        setInputs((current) => ({ ...current, [key]: value }))
      }
      onRun={() => run()}
      presets={presets}
      onPreset={(preset) => run(preset.values as typeof defaultInputs)}
      step={step}
      mode={mode}
      controls={
        <MatrixControls
          stepIndex={cursor}
          totalSteps={trace.length}
          mode={mode}
          onModeChange={setMode}
          onPrev={() => setCursor((current) => Math.max(current - 1, 0))}
          onNext={() =>
            setCursor((current) => Math.min(current + 1, trace.length - 1))
          }
          onReset={() => setCursor(0)}
          canPrev={cursor > 0}
          canNext={cursor < trace.length - 1}
        />
      }
      visualization={<SpiralMatrixVisualizer step={step} />}
      microscope={<MatrixMicroscopeView step={step} mode={mode} />}
      tracePanel={<MatrixTracePanel step={step} />}
      codePanel={
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "O(1) traversal state", "Boundary sweeps"]}
        />
      }
      output={
        <div
          className={`${matrixPanelClassName} p-5 ${
            step.done ? "border-emerald-200 bg-emerald-50/70" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`h-5 w-1.5 rounded-full ${step.done ? "bg-emerald-500" : "bg-sky-500"}`} />
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Output</h3>
              <p className="text-sm text-stone-500">
                Collected values in clockwise spiral order.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-[#273447] bg-[#16202d] px-4 py-4 font-mono text-base text-[#dfe8f3]">
            spiral = [{step.state.collected.join(", ")}]
          </div>
        </div>
      }
    />
  );
}
