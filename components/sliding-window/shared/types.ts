export type SlidingWindowMode = "beginner" | "expert";

export type AccentTone =
  | "slate"
  | "cyan"
  | "emerald"
  | "yellow"
  | "purple"
  | "rose";

export type RailItem = {
  id: string;
  label: string;
  sublabel?: string;
  tone?: AccentTone;
  tags?: string[];
  muted?: boolean;
};

export type LedgerEntry = {
  id: string;
  key: string;
  need?: string;
  have?: string;
  delta?: string;
  note?: string;
  tone?: AccentTone;
};

export type WindowGroup = {
  id: string;
  title: string;
  subtitle?: string;
  items: string[];
  tone?: AccentTone;
};

export type WindowStat = {
  label: string;
  value: string;
  tone?: AccentTone;
};

export type WindowSpan = {
  start: number | null;
  end: number | null;
  tone?: AccentTone;
  label?: string;
};

export type SlidingWindowState = {
  hero: string;
  primaryLabel: string;
  primaryItems: RailItem[];
  primarySpan?: WindowSpan;
  bestSpan?: WindowSpan;
  secondaryLabel?: string;
  secondaryItems?: RailItem[];
  secondarySpan?: WindowSpan;
  tertiaryLabel?: string;
  tertiaryItems?: RailItem[];
  tertiarySpan?: WindowSpan;
  ledgerLabel: string;
  ledgerEntries: LedgerEntry[];
  groupsLabel?: string;
  groups?: WindowGroup[];
  stats: WindowStat[];
  resultLabel: string;
  resultValue: string;
  resultTone?: AccentTone;
  summary?: string;
  footer?: string;
};

export type SlidingWindowPointers = {
  left: number | null;
  right: number | null;
  anchor: number | null;
  scan: number | null;
  focusKey: string | null;
  focusValue: string | null;
  activeEntryId: string | null;
  activeGroupId: string | null;
  offset: number | null;
};

export type SlidingWindowTraceStep = {
  step: number;
  state: SlidingWindowState;
  pointers: SlidingWindowPointers;
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
  values: Record<string, string>;
};

export type ProblemMeta = {
  title: string;
  eyebrow: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  backHref: string;
  backLabel: string;
};

export type SharedControlsProps = {
  stepIndex: number;
  totalSteps: number;
  mode: SlidingWindowMode;
  onModeChange: (mode: SlidingWindowMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};
