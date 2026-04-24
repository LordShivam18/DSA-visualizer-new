"use client";

import { motion } from "framer-motion";

import { gentleSpring, toneClasses } from "./theme";
import type { VisualNode } from "./types";

export default function DPNode({
  node,
  highlighted = false,
}: {
  node: VisualNode;
  highlighted?: boolean;
}) {
  const tone = toneClasses(node.tone);

  return (
    <motion.div
      layout
      transition={gentleSpring}
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{
        opacity: 1,
        y: highlighted ? -6 : 0,
        scale: highlighted ? 1.05 : 1,
      }}
      className={`relative overflow-hidden rounded-[1.45rem] border px-4 py-4 ${tone.surface} ${
        highlighted ? `ring-2 ${tone.ring} ${tone.glow}` : ""
      }`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/35 blur-2xl" />
      <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">
        {node.label}
      </p>
      <p className="relative z-10 mt-3 text-3xl font-semibold">{node.value}</p>
      {node.note ? (
        <p className="relative z-10 mt-2 text-xs leading-6 opacity-75">{node.note}</p>
      ) : null}
    </motion.div>
  );
}
