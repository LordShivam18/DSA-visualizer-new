import { AccentPanel, MatrixBoard } from "../shared/ui";
import type { SpiralMatrixTraceStep } from "./generateTrace";

function formatOutput(values: number[]) {
  return values.length > 0 ? `[${values.join(", ")}]` : "[]";
}

function directionLabel(direction: SpiralMatrixTraceStep["state"]["direction"]) {
  if (direction === "top-row") {
    return "Top row";
  }
  if (direction === "right-column") {
    return "Right column";
  }
  if (direction === "bottom-row") {
    return "Bottom row";
  }
  if (direction === "left-column") {
    return "Left column";
  }
  return "Complete";
}

export default function SpiralMatrixVisualizer({
  step,
}: {
  step: SpiralMatrixTraceStep;
}) {
  const active = new Set(step.state.activeCells);
  const visited = new Set(step.state.visitedKeys);

  return (
    <MatrixBoard
      title="Spiral Traversal Field"
      subtitle="Visited cells settle into the trail while the next exposed edge lights up as the active sweep."
      legend={[
        { label: "Visited", tone: "emerald" },
        { label: "Active sweep", tone: "sky" },
        { label: "Unvisited", tone: "slate" },
      ]}
      board={{
        rows: step.state.matrix.map((row, rowIndex) => ({
          label: `r${rowIndex}`,
          cells: row.map((value, colIndex) => {
            const key = `${rowIndex}:${colIndex}`;
            const isActive = active.has(key);
            const isVisited = visited.has(key);

            return {
              value,
              tone: isActive ? "sky" : isVisited ? "emerald" : "slate",
              pulse: isActive,
            };
          }),
        })),
        colLabels: step.state.matrix[0]?.map((_, colIndex) => `c${colIndex}`),
      }}
      footer={
        <div className="grid gap-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <AccentPanel title="Current Sweep" tone="amber">
            {directionLabel(step.state.direction)}. Bounds now span top{" "}
            {step.state.top}, bottom {step.state.bottom}, left {step.state.left},
            right {step.state.right}.
          </AccentPanel>
          <AccentPanel title="Output Rail" tone="emerald">
            {formatOutput(step.state.collected)}
          </AccentPanel>
        </div>
      }
    />
  );
}
