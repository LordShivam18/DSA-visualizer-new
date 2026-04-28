import type { ReplayVariation, ReplayVariationKind } from "./variationEngine";

export type ProgressiveLearningMode = "beginner" | "intermediate" | "expert";

export type ProgressivePanelKey =
  | "narrative"
  | "why"
  | "mistake"
  | "pattern"
  | "path"
  | "replay"
  | "intelligence"
  | "completion"
  | "code";

type ProgressiveModeProfile = {
  label: string;
  summary: string;
  panels: Record<ProgressivePanelKey, boolean>;
  replayKinds: ReplayVariationKind[];
  maxReplayItems: number;
};

export const progressiveModeProfiles: Record<
  ProgressiveLearningMode,
  ProgressiveModeProfile
> = {
  beginner: {
    label: "Beginner",
    summary: "Core narration, why, and mistake repair.",
    panels: {
      narrative: true,
      why: true,
      mistake: true,
      pattern: false,
      path: false,
      replay: false,
      intelligence: false,
      completion: true,
      code: false,
    },
    replayKinds: ["minimal", "edge"],
    maxReplayItems: 1,
  },
  intermediate: {
    label: "Intermediate",
    summary: "Pattern transfer with focused replays.",
    panels: {
      narrative: true,
      why: true,
      mistake: true,
      pattern: true,
      path: false,
      replay: true,
      intelligence: true,
      completion: true,
      code: true,
    },
    replayKinds: ["minimal", "edge", "adversarial"],
    maxReplayItems: 3,
  },
  expert: {
    label: "Expert",
    summary: "Full diagnostics, pathing, and code context.",
    panels: {
      narrative: true,
      why: true,
      mistake: true,
      pattern: true,
      path: true,
      replay: true,
      intelligence: true,
      completion: true,
      code: true,
    },
    replayKinds: ["adversarial", "edge", "minimal", "mutation"],
    maxReplayItems: 4,
  },
};

export function getProgressiveDisclosure(mode: ProgressiveLearningMode) {
  return progressiveModeProfiles[mode];
}

export function filterReplayVariationsForMode(
  items: ReplayVariation[],
  mode: ProgressiveLearningMode
) {
  const profile = getProgressiveDisclosure(mode);
  const allowedKinds = new Set(profile.replayKinds);

  return items
    .filter((item) => allowedKinds.has(item.kind))
    .sort(
      (left, right) =>
        profile.replayKinds.indexOf(left.kind) -
        profile.replayKinds.indexOf(right.kind)
    )
    .slice(0, profile.maxReplayItems);
}
