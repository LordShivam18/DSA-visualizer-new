import { AccentPanel, MatrixBoard } from "../shared/ui";
import type { ValidSudokuTraceStep } from "./generateTrace";

function keyOf(row: number, col: number) {
  return `${row}:${col}`;
}

function inSameBox(
  row: number,
  col: number,
  targetRow: number,
  targetCol: number
) {
  return (
    Math.floor(row / 3) === Math.floor(targetRow / 3) &&
    Math.floor(col / 3) === Math.floor(targetCol / 3)
  );
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "empty";
}

export default function SudokuVisualizer({
  step,
}: {
  step: ValidSudokuTraceStep;
}) {
  const active = step.state.currentCell;

  return (
    <MatrixBoard
      title="Sudoku Validation Board"
      subtitle="Accepted digits glow softly, while the active row, column, and box reveal the exact constraint currently under inspection."
      legend={[
        { label: "Validated", tone: "emerald" },
        { label: "Active cell", tone: "sky" },
        { label: "Active 3 x 3 box", tone: "indigo" },
        { label: "Conflict", tone: "rose" },
      ]}
      board={{
        compact: true,
        thickEvery: 3,
        colLabels: ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
        rows: step.state.board.map((row, rowIndex) => ({
          label: `r${rowIndex}`,
          cells: row.map((value, colIndex) => {
            const current = active?.row === rowIndex && active?.col === colIndex;
            const validated = step.state.validatedKeys.includes(keyOf(rowIndex, colIndex));
            const sameRow = active ? active.row === rowIndex : false;
            const sameCol = active ? active.col === colIndex : false;
            const sameBox = active
              ? inSameBox(rowIndex, colIndex, active.row, active.col)
              : false;

            let tone:
              | "slate"
              | "sky"
              | "amber"
              | "emerald"
              | "indigo"
              | "rose" = "slate";
            if (validated) {
              tone = "emerald";
            }
            if (sameBox) {
              tone = "indigo";
            }
            if (sameRow || sameCol) {
              tone = "amber";
            }
            if (current) {
              tone = step.state.conflictKind ? "rose" : "sky";
            }
            if (
              step.state.conflictKind &&
              value === step.state.currentValue &&
              !current &&
              ((step.state.conflictKind === "row" && sameRow) ||
                (step.state.conflictKind === "column" && sameCol) ||
                (step.state.conflictKind === "box" && sameBox))
            ) {
              tone = "rose";
            }

            return {
              value,
              tone,
              pulse: current,
              muted: value === ".",
            };
          }),
        })),
      }}
      footer={
        <div className="grid gap-3 md:grid-cols-3">
          <AccentPanel title="Row Ledger" tone="amber">
            {formatList(step.state.rowSeen)}
          </AccentPanel>
          <AccentPanel title="Column Ledger" tone="sky">
            {formatList(step.state.colSeen)}
          </AccentPanel>
          <AccentPanel title="Box Ledger" tone="indigo">
            {formatList(step.state.boxSeen)}
          </AccentPanel>
        </div>
      }
    />
  );
}
