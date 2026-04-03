"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  accentColor?: "cyan" | "violet" | "emerald" | "rose" | "amber" | "blue";
  hoverable?: boolean;
  onClick?: () => void;
}

const accentMap = {
  cyan: {
    border: "rgba(34, 211, 238, 0.25)",
    glow: "rgba(34, 211, 238, 0.12)",
    hoverBorder: "rgba(34, 211, 238, 0.5)",
    hoverGlow: "rgba(34, 211, 238, 0.2)",
  },
  violet: {
    border: "rgba(167, 139, 250, 0.25)",
    glow: "rgba(167, 139, 250, 0.12)",
    hoverBorder: "rgba(167, 139, 250, 0.5)",
    hoverGlow: "rgba(167, 139, 250, 0.2)",
  },
  emerald: {
    border: "rgba(52, 211, 153, 0.25)",
    glow: "rgba(52, 211, 153, 0.12)",
    hoverBorder: "rgba(52, 211, 153, 0.5)",
    hoverGlow: "rgba(52, 211, 153, 0.2)",
  },
  rose: {
    border: "rgba(251, 113, 133, 0.25)",
    glow: "rgba(251, 113, 133, 0.12)",
    hoverBorder: "rgba(251, 113, 133, 0.5)",
    hoverGlow: "rgba(251, 113, 133, 0.2)",
  },
  amber: {
    border: "rgba(251, 191, 36, 0.25)",
    glow: "rgba(251, 191, 36, 0.12)",
    hoverBorder: "rgba(251, 191, 36, 0.5)",
    hoverGlow: "rgba(251, 191, 36, 0.2)",
  },
  blue: {
    border: "rgba(96, 165, 250, 0.25)",
    glow: "rgba(96, 165, 250, 0.12)",
    hoverBorder: "rgba(96, 165, 250, 0.5)",
    hoverGlow: "rgba(96, 165, 250, 0.2)",
  },
};

export default function GlassCard({
  children,
  className = "",
  accentColor = "cyan",
  hoverable = true,
  onClick,
}: GlassCardProps) {
  const accent = accentMap[accentColor];

  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`glass-card ${hoverable ? "cursor-pointer" : ""} ${className}`}
      style={{
        borderColor: accent.border,
        boxShadow: `0 0 0 1px ${accent.glow} inset, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLElement).style.borderColor = accent.hoverBorder;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accent.hoverGlow}, 0 12px 40px rgba(0,0,0,0.5)`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          (e.currentTarget as HTMLElement).style.borderColor = accent.border;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${accent.glow} inset, 0 8px 32px rgba(0,0,0,0.4)`;
        }
      }}
    >
      {children}
    </motion.div>
  );
}
