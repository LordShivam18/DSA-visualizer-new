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
  type GameOfLifeTraceStep,
} from "../../../components/matrix/game-of-life/generateTrace";
import GameOfLifeVisualizer from "../../../components/matrix/game-of-life/GameOfLifeVisualizer";

const codeLines = [
  "const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];",
  "for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {",
  "  const liveNeighbors = countNeighbors(board, r, c);",
  "  if (board[r][c] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) board[r][c] = -1;",
  "  else if (board[r][c] === 0 && liveNeighbors === 3) board[r][c] = 2;",
  "}",
  "for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) board[r][c] = board[r][c] > 0 ? 1 : 0;",
];

const defaultInputs = {
  board: "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]",
};

const presets: PresetConfig[] = [
  {
    name: "Example 1",
    summary: "=> [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]",
    values: defaultInputs,
  },
  {
    name: "Stable Block",
    summary: "=> unchanged",
    values: { board: "[[1,1],[1,1]]" },
  },
  {
    name: "Blinker",
    summary: "=> [[0,0,0],[1,1,1],[0,0,0]]",
    values: { board: "[[0,1,0],[0,1,0],[0,1,0]]" },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.board);
}

export default function GameOfLifePage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [trace, setTrace] = useState<GameOfLifeTraceStep[]>(() =>
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
      taxonomy="Matrix / Cellular automaton / Neighbor simulation"
      title="Game of Life"
      difficulty="Medium"
      description="Update the board in place by counting live neighbors, writing transition markers, and then finalizing the next generation."
      complexity="O(mn) time / O(1) extra space"
      inputFields={[
        {
          key: "board",
          label: "board",
          multiline: true,
          rows: 5,
          placeholder: "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]",
          help: "Use 0 for dead cells and 1 for live cells.",
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
      visualization={<GameOfLifeVisualizer step={step} />}
      microscope={<MatrixMicroscopeView step={step} mode={mode} />}
      tracePanel={<MatrixTracePanel step={step} />}
      codePanel={
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "Eight-neighbor scan", "In-place markers"]}
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
                Board after one simultaneous Game of Life update.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-[#273447] bg-[#16202d] px-4 py-4 font-mono text-base text-[#dfe8f3]">
            board ={" "}
            {step.state.result
              ? JSON.stringify(step.state.result)
              : JSON.stringify(step.state.board)}
          </div>
        </div>
      }
    />
  );
}
