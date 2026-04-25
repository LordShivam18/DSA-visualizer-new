"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import MatrixCodePanel from "../../../components/matrix/shared/MatrixCodePanel";
import MatrixMicroscopeView from "../../../components/matrix/shared/MatrixMicroscopeView";
import MatrixTracePanel from "../../../components/matrix/shared/MatrixTracePanel";
import { matrixPanelClassName } from "../../../components/matrix/shared/ui";
import {
  generateTrace,
} from "../../../components/matrix/valid-sudoku/generateTrace";
import SudokuVisualizer from "../../../components/matrix/valid-sudoku/SudokuVisualizer";

const codeLines = [
  "const rows = Array.from({ length: 9 }, () => new Set());",
  "const cols = Array.from({ length: 9 }, () => new Set());",
  "const boxes = Array.from({ length: 9 }, () => new Set());",
  "for (let r = 0; r < 9; r += 1) {",
  "  for (let c = 0; c < 9; c += 1) {",
  "    const value = board[r][c];",
  "    if (value === '.') continue;",
  "    const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);",
  "    if (rows[r].has(value) || cols[c].has(value) || boxes[box].has(value)) return false;",
  "    rows[r].add(value); cols[c].add(value); boxes[box].add(value);",
  "return true;",
];

const defaultInputs = {
  board: `[
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]`,
};

const presets = [
  { name: "Example 1", summary: "=> true", values: defaultInputs },
  {
    name: "Duplicate Row",
    summary: "=> false",
    values: {
      board: `[
  ["5","3",".",".","7",".",".",".","5"],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]`,
    },
  },
  {
    name: "Nearly Empty",
    summary: "=> true",
    values: {
      board: `[
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."]
]`,
    },
  },
];

function buildTrace(values: typeof defaultInputs) {
  return generateTrace(values.board);
}

export default function ValidSudokuPage() {
  return (
    <TraceLessonPage
      variant="matrix"
      categoryHref="/matrix"
      categoryLabel="Matrix"
      taxonomy="Matrix / Constraint validation / Set bookkeeping"
      title="Valid Sudoku"
      difficulty="Medium"
      description="Determine whether the filled cells obey Sudoku uniqueness rules by validating each digit against its row, column, and 3 x 3 sub-box."
      complexity="O(81) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[
        {
          id: "board",
          label: "board",
          multiline: true,
          rows: 9,
          placeholder: '[["5","3",".",...], ...]',
          helper: 'Use "." for empty cells.',
        },
      ]}
      presets={presets}
      buildTrace={buildTrace}
      renderVisualization={({ step }) => <SudokuVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MatrixMicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <MatrixTracePanel step={step} />}
      renderCodePanel={({ step }) => (
        <MatrixCodePanel
          step={step}
          lines={codeLines}
          complexity={["Single scan", "3 set families", "Early exit on conflict"]}
        />
      )}
      renderOutput={({ step }) => (
        <div
          className={`${matrixPanelClassName} p-5 ${
            step.done && step.state.result
              ? "border-emerald-200 bg-emerald-50/70"
              : step.done
              ? "border-rose-200 bg-rose-50/70"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done && step.state.result
                  ? "bg-emerald-500"
                  : step.done
                  ? "bg-rose-500"
                  : "bg-sky-500"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Output</h3>
              <p className="text-sm text-stone-500">
                Whether the current board satisfies all Sudoku constraints.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] border border-[#273447] bg-[#16202d] px-4 py-4 font-mono text-base text-[#dfe8f3]">
            isValid = {step.state.result === null ? "..." : String(step.state.result)}
          </div>
        </div>
      )}
    />
  );
}
