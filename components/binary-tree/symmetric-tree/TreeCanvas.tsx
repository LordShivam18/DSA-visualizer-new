import React from "react";
import { TraceStep } from "./generateTrace";

type Props = {
  trace: TraceStep[];
  cursor: number;
  width?: number;
  height?: number;
};

function nodeStyle() {
  return `w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center text-sm font-mono`;
}

export default function TreeCanvas({ trace, cursor, width = 940, height = 420 }: Props) {
  // derive visible nodes & highlight state from trace up to cursor
  const active = trace.slice(0, cursor + 1);

  const compareMap = new Map<string, { ok?: boolean }>();
  active.forEach((s) => {
    if (s.type === "compare") {
      const left = s.leftId || "null";
      const right = s.rightId || "null";
      compareMap.set(`${left}_${right}`, { ok: s.ok });
    }
  });

  // For this simple demo we will reconstruct same example tree positions.
  // Positions are static and centered; nodes are placed level-wise.
  const positions = [
    { id: "n-0", x: width / 2, y: 40 },
    { id: "n-1", x: width / 2 - 220, y: 140 },
    { id: "n-2", x: width / 2 + 220, y: 140 },
    { id: "n-3", x: width / 2 - 300, y: 240 },
    { id: "n-4", x: width / 2 - 140, y: 240 },
    { id: "n-5", x: width / 2 + 140, y: 240 },
    { id: "n-6", x: width / 2 + 300, y: 240 },
  ];

  // map id -> value (same as array in generateTrace)
  const values = new Map([
    ["n-0", 1],
    ["n-1", 2],
    ["n-2", 2],
    ["n-3", 3],
    ["n-4", 4],
    ["n-5", 4],
    ["n-6", 3],
  ]);

  return (
    <div style={{ width, height }} className="relative bg-transparent rounded-lg overflow-visible">
      <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
        {/* draw simple edges */}
        <line x1={positions[0].x} y1={positions[0].y + 18} x2={positions[1].x} y2={positions[1].y - 18} stroke="#0ea5b2" strokeOpacity={0.12} />
        <line x1={positions[0].x} y1={positions[0].y + 18} x2={positions[2].x} y2={positions[2].y - 18} stroke="#0ea5b2" strokeOpacity={0.12} />
        <line x1={positions[1].x} y1={positions[1].y + 18} x2={positions[3].x} y2={positions[3].y - 18} stroke="#0ea5b2" strokeOpacity={0.08} />
        <line x1={positions[1].x} y1={positions[1].y + 18} x2={positions[4].x} y2={positions[4].y - 18} stroke="#0ea5b2" strokeOpacity={0.08} />
        <line x1={positions[2].x} y1={positions[2].y + 18} x2={positions[5].x} y2={positions[5].y - 18} stroke="#0ea5b2" strokeOpacity={0.08} />
        <line x1={positions[2].x} y1={positions[2].y + 18} x2={positions[6].x} y2={positions[6].y - 18} stroke="#0ea5b2" strokeOpacity={0.08} />
      </svg>

      {/* nodes */}
      {positions.map((p) => {
        // highlight rules: if any compare involving this node (either as left or right) happened and failed, mark red.
        // find any compare where leftId or rightId equals id
        let ok = undefined as boolean | undefined;
        trace.slice(0, cursor + 1).forEach((s) => {
          if (s.type === "compare") {
            if (s.leftId === p.id || s.rightId === p.id) ok = s.ok;
          }
        });

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x - 24,
              top: p.y - 24,
              transition: "box-shadow 220ms ease, transform 220ms ease",
            }}
            className={`${nodeStyle()} ${ok === false ? "border-red-400" : ""}`}
          >
            <div className={`relative`}>
              <span className="text-cyan-200">{values.get(p.id)}</span>
              {/* soft glow */}
              <div className="absolute -inset-2 rounded-full blur-[8px]" style={{ boxShadow: ok === false ? "0 0 20px rgba(248,113,113,0.25)" : "0 0 20px rgba(34,211,238,0.06)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
