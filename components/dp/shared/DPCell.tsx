"use client";

import { motion } from "framer-motion";

import { gentleSpring, toneClasses } from "./theme";
import type { VisualCell, VisualMatrixCell } from "./types";

type Props = {
  cell: VisualCell | VisualMatrixCell;
  highlighted?: boolean;
  compact?: boolean;
  index?: number;
};

function variantShape(variant: VisualCell["variant"], compact?: boolean) {
  if (variant === "coin") {
    return compact
      ? "aspect-square rounded-[1.2rem]"
      : "aspect-square rounded-[1.55rem]";
  }

  if (variant === "house") {
    return compact
      ? "rounded-[1.2rem] pt-5"
      : "rounded-[1.4rem] pt-6";
  }

  if (variant === "char") {
    return compact ? "rounded-[1rem]" : "rounded-[1.2rem]";
  }

  if (variant === "price" || variant === "skyline") {
    return compact ? "rounded-[1rem] pb-5" : "rounded-[1.2rem] pb-6";
  }

  if (variant === "square") {
    return "aspect-square rounded-[1.2rem]";
  }

  if (variant === "stairs") {
    return compact ? "rounded-[1rem]" : "rounded-[1.2rem]";
  }

  return compact ? "rounded-[1rem]" : "rounded-[1.2rem]";
}

export default function DPCell({
  cell,
  highlighted = false,
  compact = false,
  index = 0,
}: Props) {
  const tone = toneClasses(cell.tone);
  const variant = cell.variant ?? "default";

  return (
    <motion.div
      layout
      transition={gentleSpring}
      initial={{ opacity: 0, y: 14, scale: 0.95 }}
      animate={{
        opacity: cell.ghost ? 0.45 : 1,
        y: highlighted ? -6 : 0,
        scale: highlighted ? 1.04 : 1,
      }}
      className={`relative min-w-[72px] overflow-hidden border px-3 py-3 ${variantShape(
        variant,
        compact
      )} ${tone.surface} ${highlighted ? `ring-2 ${tone.ring} ${tone.glow}` : ""}`}
      style={{
        transformOrigin: "center bottom",
        marginTop:
          variant === "stairs"
            ? `${Math.max(0, 22 - index * 5)}px`
            : undefined,
      }}
    >
      {variant === "house" ? (
        <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border border-white/65 bg-white/80" />
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-h-[18px] text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">
            {cell.label ?? "\u00A0"}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {(cell.tags ?? []).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone.soft}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div
            className={`text-center font-semibold ${
              compact ? "text-lg" : "text-2xl"
            }`}
          >
            {cell.value}
          </div>
          {cell.caption ? (
            <div className="mt-1 text-center text-xs opacity-70">{cell.caption}</div>
          ) : null}
        </div>

        {variant === "coin" ? (
          <div className="absolute inset-x-3 bottom-2 h-2 rounded-full bg-white/45 blur-md" />
        ) : null}

        {variant === "price" || variant === "skyline" ? (
          <div className="absolute inset-x-3 bottom-2 h-1.5 rounded-full bg-white/45 blur-sm" />
        ) : null}

        {variant === "binary" ? (
          <div
            className={`absolute inset-0 ${
              String(cell.value) === "1" ? "bg-emerald-200/18" : "bg-slate-200/18"
            }`}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
