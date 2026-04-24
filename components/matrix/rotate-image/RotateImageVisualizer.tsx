import { AccentPanel, MatrixBoard } from "../shared/ui";
import type { RotateImageTraceStep } from "./generateTrace";

export default function RotateImageVisualizer({
  step,
}: {
  step: RotateImageTraceStep;
}) {
  return (
    <MatrixBoard
      title="Rotation Workbench"
      subtitle="The active swap pair shows the exact cells being exchanged while the board morphs in place."
      legend={[
        { label: "Transpose swap", tone: "sky" },
        { label: "Row reversal swap", tone: "amber" },
        { label: "Final board", tone: "emerald" },
      ]}
      board={{
        rows: step.state.matrix.map((row, rowIndex) => ({
          label: `r${rowIndex}`,
          cells: row.map((value, colIndex) => {
            const isA =
              step.state.activeA?.row === rowIndex &&
              step.state.activeA?.col === colIndex;
            const isB =
              step.state.activeB?.row === rowIndex &&
              step.state.activeB?.col === colIndex;
            const isActive = isA || isB;

            return {
              value,
              tone: step.done
                ? "emerald"
                : step.state.phase === "transpose"
                ? isActive
                  ? "sky"
                  : "slate"
                : step.state.phase === "reverse-row"
                ? isActive
                  ? "amber"
                  : step.state.rowIndex === rowIndex
                  ? "indigo"
                  : "slate"
                : "slate",
              badge: isA ? "A" : isB ? "B" : undefined,
              pulse: isActive,
            };
          }),
        })),
        colLabels: step.state.matrix[0]?.map((_, colIndex) => `c${colIndex}`),
      }}
      footer={
        <div className="grid gap-3 md:grid-cols-2">
          <AccentPanel title="Phase" tone="amber">
            {step.state.phase === "transpose"
              ? "Transpose across the main diagonal."
              : step.state.phase === "reverse-row"
              ? `Reverse row ${step.state.rowIndex}.`
              : "All swaps are complete."}
          </AccentPanel>
          <AccentPanel title="Swap Counter" tone="sky">
            {step.state.swapCount} in-place swap
            {step.state.swapCount === 1 ? "" : "s"} executed.
          </AccentPanel>
        </div>
      }
    />
  );
}
