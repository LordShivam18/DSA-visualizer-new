export type HashmapMode = "beginner" | "expert";

export type AccentTone =
  | "slate"
  | "cyan"
  | "yellow"
  | "green"
  | "purple"
  | "red";

export type VisualToken = {
  id: string;
  label: string;
  sublabel?: string;
  tone?: AccentTone;
  tags?: string[];
  muted?: boolean;
};

export type VisualEntry = {
  id: string;
  key: string;
  value: string;
  note?: string;
  tone?: AccentTone;
};

export type VisualGroup = {
  id: string;
  title: string;
  subtitle?: string;
  items: string[];
  tone?: AccentTone;
};

export type VisualStat = {
  label: string;
  value: string;
  tone?: AccentTone;
};

export type HashmapTraceState = {
  hero: string;
  primaryLabel: string;
  primaryItems: VisualToken[];
  secondaryLabel?: string;
  secondaryItems?: VisualToken[];
  tertiaryLabel?: string;
  tertiaryItems?: VisualToken[];
  mapLabel: string;
  mapEntries: VisualEntry[];
  groupsLabel?: string;
  groups?: VisualGroup[];
  auxLabel?: string;
  auxItems?: VisualToken[];
  stats: VisualStat[];
  resultLabel: string;
  resultValue: string;
  resultTone?: AccentTone;
  verdict?: boolean | null;
  summary?: string;
  footer?: string;
};

export type HashmapPointers = {
  primaryIndex: number | null;
  secondaryIndex: number | null;
  tertiaryIndex: number | null;
  focusKey: string | null;
  focusValue: string | null;
  activeEntryId: string | null;
  activeGroupId: string | null;
};

export type HashmapTraceStep = {
  step: number;
  state: HashmapTraceState;
  pointers: HashmapPointers;
  action: string;
  actionKind: string;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type ProblemInputField = {
  id: string;
  label: string;
  placeholder: string;
  helper?: string;
  multiline?: boolean;
};

export type ProblemPreset = {
  name: string;
  output: string;
  description?: string;
  values: Record<string, string>;
};

export type ProblemMeta = {
  title: string;
  eyebrow: string;
  description: string;
  difficulty: "easy" | "medium";
  accent: AccentTone;
  backHref: string;
  backLabel: string;
};

export type SharedControlsProps = {
  stepIndex: number;
  totalSteps: number;
  mode: HashmapMode;
  onModeChange: (mode: HashmapMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};
