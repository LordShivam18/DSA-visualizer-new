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
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<RotateImageTraceStep[]>(() =>
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
      taxonomy="Matrix / In-place transform / Transpose + reverse"
      title="Rotate Image"
      difficulty="Medium"
      description="Rotate an n x n matrix clockwise by 90 degrees in place using a transpose pass followed by row reversals."
      complexity="O(n²) time / O(1) extra space"
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
      visualization={<RotateImageVisualizer step={step} />}
      microscope={<MatrixMicroscopeView step={step} mode={mode} />}
      tracePanel={<MatrixTracePanel step={step} />}
      codePanel={
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(n²) time", "In-place swaps", "Two matrix passes"]}
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
                The matrix after clockwise 90-degree rotation.
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
