import type { DpScene, VisualTone } from "./types";

export const glassPanelClassName =
  "rounded-[1.75rem] border border-white/70 bg-white/72 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl";

export const motionSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

export const gentleSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
  mass: 0.95,
};

const toneClassMap: Record<
  VisualTone,
  {
    surface: string;
    soft: string;
    ring: string;
    text: string;
    glow: string;
  }
> = {
  sky: {
    surface:
      "border-sky-200/80 bg-sky-50/85 text-sky-900 shadow-[0_18px_40px_rgba(14,165,233,0.16)]",
    soft: "border-sky-200 bg-sky-50 text-sky-700",
    ring: "ring-sky-300/65",
    text: "text-sky-700",
    glow: "shadow-[0_0_32px_rgba(14,165,233,0.18)]",
  },
  violet: {
    surface:
      "border-violet-200/80 bg-violet-50/85 text-violet-900 shadow-[0_18px_40px_rgba(139,92,246,0.16)]",
    soft: "border-violet-200 bg-violet-50 text-violet-700",
    ring: "ring-violet-300/65",
    text: "text-violet-700",
    glow: "shadow-[0_0_32px_rgba(139,92,246,0.18)]",
  },
  emerald: {
    surface:
      "border-emerald-200/80 bg-emerald-50/85 text-emerald-900 shadow-[0_18px_40px_rgba(16,185,129,0.16)]",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-300/65",
    text: "text-emerald-700",
    glow: "shadow-[0_0_32px_rgba(16,185,129,0.18)]",
  },
  amber: {
    surface:
      "border-amber-200/80 bg-amber-50/90 text-amber-900 shadow-[0_18px_40px_rgba(245,158,11,0.16)]",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    ring: "ring-amber-300/65",
    text: "text-amber-700",
    glow: "shadow-[0_0_32px_rgba(245,158,11,0.18)]",
  },
  rose: {
    surface:
      "border-rose-200/80 bg-rose-50/90 text-rose-900 shadow-[0_18px_40px_rgba(244,63,94,0.16)]",
    soft: "border-rose-200 bg-rose-50 text-rose-700",
    ring: "ring-rose-300/65",
    text: "text-rose-700",
    glow: "shadow-[0_0_32px_rgba(244,63,94,0.18)]",
  },
  slate: {
    surface:
      "border-slate-200/80 bg-slate-50/85 text-slate-900 shadow-[0_18px_40px_rgba(71,85,105,0.12)]",
    soft: "border-slate-200 bg-slate-50 text-slate-700",
    ring: "ring-slate-300/65",
    text: "text-slate-700",
    glow: "shadow-[0_0_28px_rgba(71,85,105,0.12)]",
  },
};

export function toneClasses(tone?: VisualTone) {
  return toneClassMap[tone ?? "slate"];
}

export const sceneThemeMap: Record<
  DpScene,
  {
    label: string;
    accent: string;
    chipTone: VisualTone;
    orbClass: string;
    beamClass: string;
  }
> = {
  stairs: {
    label: "Fibonacci Stairwell",
    accent: "from-sky-500 via-violet-500 to-emerald-400",
    chipTone: "sky",
    orbClass: "bg-sky-300/30",
    beamClass: "from-sky-200/55 via-white/65 to-violet-200/45",
  },
  heist: {
    label: "Heist Route Planner",
    accent: "from-amber-500 via-rose-500 to-violet-500",
    chipTone: "amber",
    orbClass: "bg-amber-300/25",
    beamClass: "from-amber-200/55 via-white/65 to-rose-200/45",
  },
  wordbreak: {
    label: "Segmentation Studio",
    accent: "from-violet-500 via-sky-500 to-emerald-400",
    chipTone: "violet",
    orbClass: "bg-violet-300/25",
    beamClass: "from-violet-200/55 via-white/65 to-sky-200/45",
  },
  coinforge: {
    label: "Coin Forge",
    accent: "from-amber-500 via-sky-500 to-emerald-400",
    chipTone: "amber",
    orbClass: "bg-amber-300/25",
    beamClass: "from-amber-200/55 via-white/65 to-emerald-200/45",
  },
  skyline: {
    label: "Skyline Builder",
    accent: "from-emerald-500 via-sky-500 to-violet-500",
    chipTone: "emerald",
    orbClass: "bg-emerald-300/25",
    beamClass: "from-emerald-200/55 via-white/65 to-sky-200/45",
  },
  triangle: {
    label: "Crystal Lattice",
    accent: "from-violet-500 via-amber-400 to-sky-400",
    chipTone: "violet",
    orbClass: "bg-violet-300/25",
    beamClass: "from-violet-200/55 via-white/65 to-amber-200/45",
  },
  grid: {
    label: "Path Atlas",
    accent: "from-sky-500 via-emerald-500 to-amber-400",
    chipTone: "sky",
    orbClass: "bg-sky-300/25",
    beamClass: "from-sky-200/55 via-white/65 to-emerald-200/45",
  },
  pathfinder: {
    label: "Obstacle Navigator",
    accent: "from-emerald-500 via-sky-500 to-rose-500",
    chipTone: "emerald",
    orbClass: "bg-emerald-300/25",
    beamClass: "from-emerald-200/55 via-white/65 to-rose-200/45",
  },
  palindrome: {
    label: "Palindrome Resonance",
    accent: "from-rose-500 via-violet-500 to-sky-500",
    chipTone: "rose",
    orbClass: "bg-rose-300/25",
    beamClass: "from-rose-200/55 via-white/65 to-violet-200/45",
  },
  interleave: {
    label: "Weave Loom",
    accent: "from-sky-500 via-violet-500 to-rose-400",
    chipTone: "sky",
    orbClass: "bg-sky-300/25",
    beamClass: "from-sky-200/55 via-white/65 to-rose-200/45",
  },
  edit: {
    label: "Edit Lab",
    accent: "from-rose-500 via-amber-500 to-sky-500",
    chipTone: "rose",
    orbClass: "bg-rose-300/25",
    beamClass: "from-rose-200/55 via-white/65 to-amber-200/45",
  },
  trading: {
    label: "Trading Control Room",
    accent: "from-emerald-500 via-sky-500 to-violet-500",
    chipTone: "emerald",
    orbClass: "bg-emerald-300/25",
    beamClass: "from-emerald-200/55 via-white/65 to-violet-200/45",
  },
  square: {
    label: "Square Radar",
    accent: "from-sky-500 via-emerald-500 to-violet-500",
    chipTone: "sky",
    orbClass: "bg-sky-300/25",
    beamClass: "from-sky-200/55 via-white/65 to-emerald-200/45",
  },
};

export function sceneTheme(scene: DpScene) {
  return sceneThemeMap[scene];
}
