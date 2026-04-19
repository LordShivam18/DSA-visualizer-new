"use client";

import type { Trace } from "./generateTrace";

type Props = {
  trace: Trace[];
  cursor: number;
};

type TreeNodePosition = {
  id: number;
  x: number;
  y: number;
};

export default function TreeCanvas({ trace, cursor }: Props) {
  const nodes = [
    { id: 4, x: 400, y: 60 },
    { id: 2, x: 250, y: 180 },
    { id: 7, x: 550, y: 180 },
    { id: 1, x: 180, y: 300 },
    { id: 3, x: 320, y: 300 },
    { id: 6, x: 480, y: 300 },
    { id: 9, x: 620, y: 300 },
  ] satisfies TreeNodePosition[];

  const visitedNodes = new Set(
    trace
      .slice(0, cursor + 1)
      .map((step) => step.value)
      .filter((value): value is number => value !== undefined)
  );

  const currentValue = trace[cursor]?.value;

  return (
    <div className="relative h-[360px] w-full rounded-xl bg-[#0d1117]">
      <svg className="absolute inset-0 h-full w-full">
        <line x1={400} y1={60} x2={250} y2={180} stroke="#555" strokeWidth={3} />
        <line x1={400} y1={60} x2={550} y2={180} stroke="#555" strokeWidth={3} />
        <line x1={250} y1={180} x2={180} y2={300} stroke="#555" strokeWidth={3} />
        <line x1={250} y1={180} x2={320} y2={300} stroke="#555" strokeWidth={3} />
        <line x1={550} y1={180} x2={480} y2={300} stroke="#555" strokeWidth={3} />
        <line x1={550} y1={180} x2={620} y2={300} stroke="#555" strokeWidth={3} />
      </svg>

      {nodes.map((node) => {
        const isCurrent = currentValue === node.id;
        const isVisited = visitedNodes.has(node.id);

        return (
          <div
            key={node.id}
            className="absolute flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white shadow-lg transition-all duration-500"
            style={{
              left: node.x - 24,
              top: node.y - 24,
              background: isCurrent
                ? "#34d399"
                : isVisited
                ? "#1f6feb"
                : "rgba(255,255,255,0.05)",
              opacity: isCurrent || isVisited ? 1 : 0.15,
              transform: isCurrent
                ? "scale(1.08)"
                : isVisited
                ? "scale(1)"
                : "scale(0.6)",
            }}
          >
            {node.id}
          </div>
        );
      })}
    </div>
  );
}
