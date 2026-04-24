import { AccentPanel, MatrixBoard } from "../shared/ui";
import type { GameOfLifeTraceStep } from "./generateTrace";

function coordKey(row: number, col: number) {
  return `${row}:${col}`;
}

export default function GameOfLifeVisualizer({
  step,
}: {
  step: GameOfLifeTraceStep;
}) {
  const neighbors = new Set(
    step.state.activeNeighbors.map((coord) => coordKey(coord.row, coord.col))
  );

  return (
    <MatrixBoard
      title="Life Simulation Board"
      subtitle="Temporary markers show cells that are about to flip, while the active neighborhood explains the rule being applied."
      legend={[
        { label: "Current cell", tone: "sky" },
        { label: "Live neighbor", tone: "indigo" },
        { label: "Live", tone: "emerald" },
        { label: "Transition", tone: "amber" },
      ]}
      board={{
        rows: step.state.board.map((row, rowIndex) => ({
          label: `r${rowIndex}`,
          cells: row.map((value, colIndex) => {
            const current =
              step.state.currentCell?.row === rowIndex &&
              step.state.currentCell?.col === colIndex;
            const neighbor = neighbors.has(coordKey(rowIndex, colIndex));

            let tone: "sky" | "indigo" | "emerald" | "amber" | "rose" | "slate" =
              "slate";

            if (value === -1) {
              tone = "rose";
            } else if (value === 2) {
              tone = "amber";
            } else if (value === 1) {
              tone = "emerald";
            }

            if (neighbor) {
              tone = "indigo";
            }
            if (current) {
              tone = "sky";
            }

            return {
              value:
                value === -1 ? "1→0" : value === 2 ? "0→1" : String(value),
              tone,
              pulse: current,
            };
          }),
        })),
        colLabels: step.state.board[0]?.map((_, colIndex) => `c${colIndex}`),
      }}
      footer={
        <div className="grid gap-3 md:grid-cols-3">
          <AccentPanel title="Phase" tone="amber">
            {step.state.phase}
          </AccentPanel>
          <AccentPanel title="Live Neighbors" tone="indigo">
            {step.state.activeNeighbors.length > 0
              ? step.state.activeNeighbors
                  .map((coord) => `(${coord.row}, ${coord.col})`)
                  .join(", ")
              : "none"}
          </AccentPanel>
          <AccentPanel title="Next State" tone="emerald">
            {step.state.nextValue !== null ? step.state.nextValue : "-"}
          </AccentPanel>
        </div>
      }
    />
  );
}
