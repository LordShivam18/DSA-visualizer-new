"use client";

import React, { useMemo } from "react";
import { NodeLayout } from "./layoutEngine";
import type { ConstructTraceStep } from "./generateTrace";

type NodeState = {
  x: number;
  y: number;
  visible: boolean;
  value: number;
  glow: number;
};

type Props = {
  trace: ConstructTraceStep[];
  cursor: number;
  nodeLayouts: NodeLayout[];
  width?: number;
  height?: number;
};

export default function TreeCanvas({
  trace,
  cursor,
  nodeLayouts,
  width = 940,
  height = 440,
}: Props) {
  const minX = Math.min(...nodeLayouts.map((n) => n.x));
  const maxX = Math.max(...nodeLayouts.map((n) => n.x));
  const offsetX = width / 2 - (minX + (maxX - minX) / 2);

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const step of trace.slice(0, cursor + 1)) {
      const nodeId = step.nodeId;
      if (nodeId) {
        ids.add(nodeId);
      }
    }
    return ids;
  }, [cursor, trace]);

  const nodes = useMemo(() => {
    const initial: Record<string, NodeState> = {};
    for (const n of nodeLayouts) {
      initial[n.id] = {
        x: n.x + offsetX,
        y: n.y,
        visible: visibleNodeIds.has(n.id),
        value: n.value,
        glow: visibleNodeIds.has(n.id) ? 1 : 0,
      };
    }
    return initial;
  }, [nodeLayouts, offsetX, visibleNodeIds]);

  // ---- EDGES ----
  const renderEdges = () => {
    return nodeLayouts.map((n) => {
      if (!n.parentId) return null;

      const parent = nodes[n.parentId];
      const child = nodes[n.id];
      if (!parent || !child || !parent.visible || !child.visible) return null;

      return (
        <line
          key={n.id + "-edge"}
          x1={parent.x}
          y1={parent.y}
          x2={child.x}
          y2={child.y}
          stroke="#38bdf8"
          strokeWidth={2}
          strokeOpacity={0.35}
          className="animate-[drawEdge_0.5s_ease-out]"
        />
      );
    });
  };

  // ---- FINAL RENDER ----
  return (
    <div className="relative overflow-visible" style={{ width, height }}>
      {/* Soft grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_70%)] pointer-events-none" />

      <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
        {renderEdges()}
      </svg>

      {Object.entries(nodes).map(([id, s]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: s.x - 18,
            top: s.y - 18,
            width: 36,
            height: 36,
            transform: `scale(${s.visible ? 1 : 0.3})`,
            transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
            boxShadow: `0 0 ${15 + s.glow * 25}px rgba(56,189,248,${0.4 + s.glow * 0.4})`,
          }}
          className="flex items-center justify-center rounded-full border-2 border-cyan-400 bg-[#001720]"
        >
          <span className="text-xs font-mono text-cyan-200">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
