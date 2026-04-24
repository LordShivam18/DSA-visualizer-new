import { AccentPanel, MatrixBoard } from "../shared/ui";
import type { SetMatrixZeroesTraceStep } from "./generateTrace";

export default function SetMatrixZeroesVisualizer({
  step,
}: {
  step: SetMatrixZeroesTraceStep;
}) {
  return (
    <MatrixBoard
      title="Marker Board"
      subtitle="The first row and first column act like built-in ledgers. Marker cells tint the lanes that will be cleared later."
      legend={[
        { label: "Marker lane", tone: "amber" },
        { label: "Active cell", tone: "sky" },
        { label: "Zeroed cell", tone: "emerald" },
      ]}
      board={{
        rows: step.state.matrix.map((row, rowIndex) => ({
          label: `r${rowIndex}`,
          cells: row.map((value, colIndex) => {
            const active =
              step.state.activeCell?.row === rowIndex &&
              step.state.activeCell?.col === colIndex;
            const marker =
              (rowIndex === 0 && step.state.colMarkers.includes(colIndex)) ||
              (colIndex === 0 && step.state.rowMarkers.includes(rowIndex));

            return {
              value,
              tone: active
                ? "sky"
                : marker
                ? "amber"
                : value === 0
                ? "emerald"
                : "slate",
              pulse: active,
              badge: marker ? "M" : undefined,
            };
          }),
        })),
        colLabels: step.state.matrix[0]?.map((_, colIndex) => `c${colIndex}`),
      }}
      footer={
        <div className="grid gap-3 md:grid-cols-3">
          <AccentPanel title="Phase" tone="indigo">
            {step.state.phase}
          </AccentPanel>
          <AccentPanel title="Row Markers" tone="amber">
            {step.state.rowMarkers.length > 0
              ? step.state.rowMarkers.join(", ")
              : "none"}
          </AccentPanel>
          <AccentPanel title="Column Markers" tone="sky">
            {step.state.colMarkers.length > 0
              ? step.state.colMarkers.join(", ")
              : "none"}
          </AccentPanel>
        </div>
      }
    />
  );
}
