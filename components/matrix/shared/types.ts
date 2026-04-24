import type { ReactNode } from "react";

export type Mode = "beginner" | "expert";

export type Tone = "sky" | "amber" | "emerald" | "rose" | "indigo" | "slate";

export type MetricCard = {
  label: string;
  value: string | number;
  tone?: Tone;
};

export type PointerChip = {
  label: string;
  value: string;
  tone?: Tone;
};

export type TeachingTraceFrame = {
  step: number;
  action: string;
  actionKind: string;
  actionTone: Tone;
  codeLines: number[];
  beginnerNote: string;
  expertNote: string;
  focus: string;
  hints: string[];
  metrics: MetricCard[];
  pointerChips: PointerChip[];
  done: boolean;
};

export type MatrixCellView = {
  value: string | number;
  secondary?: string;
  tone?: Tone;
  badge?: string;
  muted?: boolean;
  pulse?: boolean;
};

export type MatrixRowView = {
  label?: string;
  cells: MatrixCellView[];
};

export type MatrixBoardView = {
  rows: MatrixRowView[];
  colLabels?: string[];
  compact?: boolean;
  thickEvery?: number;
};

export type InputFieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
  rows?: number;
};

export type PresetConfig = {
  name: string;
  summary?: string;
  values: Record<string, string>;
};

export type LegendItem = {
  label: string;
  tone?: Tone;
};

export type ProblemShellProps<Step extends TeachingTraceFrame> = {
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  complexity: string;
  inputFields: InputFieldConfig[];
  inputValues: Record<string, string>;
  onInputChange: (key: string, value: string) => void;
  onRun: () => void;
  presets: PresetConfig[];
  onPreset: (preset: PresetConfig) => void;
  step: Step;
  mode: Mode;
  controls: ReactNode;
  visualization: ReactNode;
  microscope: ReactNode;
  tracePanel: ReactNode;
  codePanel: ReactNode;
  output: ReactNode;
};
