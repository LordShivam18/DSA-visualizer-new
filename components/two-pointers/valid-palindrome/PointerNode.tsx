"use client";

import { motion } from "framer-motion";

interface PointerNodeProps {
  label: string;
  accent: "left" | "right";
  dock: "top" | "bottom";
}

const palette = {
  left: {
    pill: "border-cyan-400/80 bg-cyan-500/12 text-cyan-100",
    stem: "bg-cyan-300/80",
    dot: "bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]",
    layoutId: "valid-palindrome-left-pointer",
  },
  right: {
    pill: "border-amber-400/80 bg-amber-500/12 text-amber-100",
    stem: "bg-amber-300/80",
    dot: "bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.9)]",
    layoutId: "valid-palindrome-right-pointer",
  },
};

export default function PointerNode({
  label,
  accent,
  dock,
}: PointerNodeProps) {
  const colors = palette[accent];

  return (
    <motion.div
      layout
      layoutId={colors.layoutId}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={`flex items-center gap-1 ${
        dock === "top" ? "flex-col" : "flex-col-reverse"
      }`}
    >
      <span
        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.22em] ${colors.pill}`}
      >
        {label}
      </span>
      <span className={`h-4 w-px ${colors.stem}`} />
      <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
    </motion.div>
  );
}
