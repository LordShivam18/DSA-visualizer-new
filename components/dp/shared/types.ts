import type { ReactNode } from "react";

import type {
  TimelineAnimation,
  TimelineStep,
} from "@/components/core/animation/TimelineEngine";

export type Mode = "beginner" | "expert";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type VisualTone =
  | "sky"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "slate";

export type DpScene =
  | "stairs"
  | "heist"
  | "wordbreak"
  | "coinforge"
  | "skyline"
  | "triangle"
  | "grid"
  | "pathfinder"
  | "palindrome"
  | "interleave"
  | "edit"
  | "trading"
  | "square";

export type MetricCard = {
  label: string;
  value: string | number;
  tone?: VisualTone;
};

export type PointerChip = {
  label: string;
  value: string;
  tone?: VisualTone;
};

export type VisualCellVariant =
  | "default"
  | "stairs"
  | "house"
  | "coin"
  | "char"
  | "price"
  | "binary"
  | "skyline"
  | "square";

export type VisualCell = {
  id: string;
  value: string | number;
  label?: string;
  caption?: string;
  tone?: VisualTone;
  tags?: string[];
  ghost?: boolean;
  variant?: VisualCellVariant;
};

export type VisualSequence = {
  id: string;
  title: string;
  subtitle?: string;
  variant?: VisualCellVariant;
  cells: VisualCell[];
};

export type VisualMatrixCell = {
  id: string;
  value: string | number;
  label?: string;
  caption?: string;
  tone?: VisualTone;
  tags?: string[];
  blocked?: boolean;
  ghost?: boolean;
  variant?: VisualCellVariant;
};

export type VisualMatrixRow = {
  id: string;
  label?: string;
  cells: VisualMatrixCell[];
};

export type VisualMatrix = {
  id: string;
  title: string;
  subtitle?: string;
  variant?: "grid" | "triangle" | "heat" | "square";
  rows: VisualMatrixRow[];
  columnLabels?: string[];
};

export type VisualRibbonToken = {
  id: string;
  value: string;
  tone?: VisualTone;
  caption?: string;
  tags?: string[];
  source?: string;
};

export type VisualRibbon = {
  id: string;
  title: string;
  subtitle?: string;
  tokens: VisualRibbonToken[];
};

export type VisualLedgerItem = {
  id: string;
  label: string;
  value: string;
  tone?: VisualTone;
  note?: string;
};

export type VisualLedger = {
  id: string;
  title: string;
  subtitle?: string;
  items: VisualLedgerItem[];
  emptyLabel?: string;
};

export type VisualNode = {
  id: string;
  label: string;
  value: string | number;
  tone?: VisualTone;
  note?: string;
};

export type VisualNodeGroup = {
  id: string;
  title: string;
  subtitle?: string;
  nodes: VisualNode[];
};

export type VisualCallout = {
  id: string;
  label: string;
  value: string;
  tone?: VisualTone;
  description?: string;
};

export type VisualState = {
  scene: DpScene;
  headline: string;
  subheadline: string;
  sequences?: VisualSequence[];
  matrices?: VisualMatrix[];
  ribbons?: VisualRibbon[];
  ledgers?: VisualLedger[];
  nodeGroups?: VisualNodeGroup[];
  callouts?: VisualCallout[];
  result?: {
    label: string;
    value: string;
    tone?: VisualTone;
  };
};

export type VisualHighlights = {
  primaryIds?: string[];
  secondaryIds?: string[];
  pathIds?: string[];
  explanation?: string;
};

export type DpTraceStep = TimelineStep<VisualState, VisualHighlights> & {
  animation: TimelineAnimation;
  actionKind: string;
  actionTone: VisualTone;
  codeLines: number[];
  beginnerNote: string;
  expertNote: string;
  focus: string;
  hints: string[];
  metrics: MetricCard[];
  pointerChips: PointerChip[];
  done: boolean;
  resultLabel: string;
  resultValue: string;
};

export type InputFieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
  rows?: number;
};

export type PresetConfig<TInputs extends Record<string, string>> = {
  name: string;
  summary?: string;
  values: TInputs;
};

export type DpProblemMeta = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  taxonomy: string;
  route: string;
};

export type DpProblemPageProps<TInputs extends Record<string, string>> = {
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  complexity: string;
  inputFields: InputFieldConfig[];
  defaultInputs: TInputs;
  presets: PresetConfig<TInputs>[];
  buildTrace: (inputs: TInputs) => DpTraceStep[];
  MainVisualizer: (props: {
    step: DpTraceStep;
    transitionProgress: number;
  }) => ReactNode;
  MicroscopeView: (props: { step: DpTraceStep; mode: Mode }) => ReactNode;
  TracePanel: (props: { step: DpTraceStep }) => ReactNode;
  CodePanel: (props: { step: DpTraceStep }) => ReactNode;
};

export type DpProblemShellProps = {
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  complexity: string;
  inputFields: InputFieldConfig[];
  inputValues: Record<string, string>;
  onInputChange: (key: string, value: string) => void;
  onRun: () => void;
  presets: Array<PresetConfig<Record<string, string>>>;
  onPreset: (preset: PresetConfig<Record<string, string>>) => void;
  step: DpTraceStep;
  mode: Mode;
  controls: ReactNode;
  visualization: ReactNode;
  microscope: ReactNode;
  tracePanel: ReactNode;
  codePanel: ReactNode;
  output: ReactNode;
};
