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
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<SetMatrixZeroesTraceStep[]>(() =>
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
      taxonomy="Matrix / In-place markers / Row and column propagation"
      title="Set Matrix Zeroes"
      difficulty="Medium"
      description="If any cell is zero, set its entire row and column to zero while reusing the first row and first column as marker storage."
      complexity="O(mn) time / O(1) extra space"
      inputFields={[
        {
          key: "matrix",
          label: "matrix",
          multiline: true,
          rows: 5,
          placeholder: "[[1,1,1],[1,0,1],[1,1,1]]",
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
      visualization={<SetMatrixZeroesVisualizer step={step} />}
      microscope={<MatrixMicroscopeView step={step} mode={mode} />}
      tracePanel={<MatrixTracePanel step={step} />}
      codePanel={
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "O(1) extra space", "Marker lanes"]}
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
                Matrix after all zero-triggered rows and columns are cleared.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-[#273447] bg-[#16202d] px-4 py-4 font-mono text-base text-[#dfe8f3]">
            matrix ={" "}
            {step.state.result
              ? JSON.stringify(step.state.result)
              : JSON.stringify(step.state.matrix)}
          </div>
        </div>
      }
    />
  );
}
