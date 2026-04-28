"use client";

import StandardTraceLessonPage from "@/components/academy/StandardTraceLessonPage";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixControls from "../../../components/matrix/shared/MatrixControls";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import type { PresetConfig } from "../../../components/matrix/shared/types";
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
  return (
    <StandardTraceLessonPage<
      typeof defaultInputs,
      GameOfLifeTraceStep,
      "beginner" | "expert"
    >
      variant="matrix"
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / Cellular automaton / Neighbor simulation"
      title="Game of Life"
      difficulty="Medium"
      description="Update the board in place by counting live neighbors, writing transition markers, and then finalizing the next generation."
      complexity="O(mn) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "board",
          label: "board",
          multiline: true,
          rows: 5,
          placeholder: "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]",
          helper: "Use 0 for dead cells and 1 for live cells.",
        },
      ]}
      presets={presets as Array<{
        name: string;
        summary?: string;
        values: typeof defaultInputs;
      }>}
      generateTrace={buildTrace}
      inputHint="Neighbor counts and transition markers are regenerated from the same trace, so prediction mode reflects the real next cellular update."
      Controls={MatrixControls}
      Visualization={GameOfLifeVisualizer}
      Microscope={MatrixMicroscopeView}
      TracePanel={MatrixTracePanel}
      renderCodePanel={({ step }) => (
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["O(mn) time", "Eight-neighbor scan", "In-place markers"]}
        />
      )}
    />
  );
}
