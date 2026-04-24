import type {
  LedgerEntry,
  RailItem,
  SlidingWindowPointers,
  SlidingWindowState,
  SlidingWindowTraceStep,
  WindowGroup,
  WindowSpan,
  WindowStat,
} from "./types";

function cloneRail(items: RailItem[]) {
  return items.map((item) => ({
    ...item,
    tags: item.tags ? [...item.tags] : undefined,
  }));
}

function cloneLedger(items: LedgerEntry[]) {
  return items.map((item) => ({ ...item }));
}

function cloneGroups(items: WindowGroup[]) {
  return items.map((item) => ({
    ...item,
    items: [...item.items],
  }));
}

function cloneStats(items: WindowStat[]) {
  return items.map((item) => ({ ...item }));
}

function cloneSpan(span: WindowSpan | undefined) {
  return span ? { ...span } : undefined;
}

export function cloneState(state: SlidingWindowState): SlidingWindowState {
  return {
    ...state,
    primaryItems: cloneRail(state.primaryItems),
    primarySpan: cloneSpan(state.primarySpan),
    bestSpan: cloneSpan(state.bestSpan),
    secondaryItems: state.secondaryItems
      ? cloneRail(state.secondaryItems)
      : undefined,
    secondarySpan: cloneSpan(state.secondarySpan),
    tertiaryItems: state.tertiaryItems
      ? cloneRail(state.tertiaryItems)
      : undefined,
    tertiarySpan: cloneSpan(state.tertiarySpan),
    ledgerEntries: cloneLedger(state.ledgerEntries),
    groups: state.groups ? cloneGroups(state.groups) : undefined,
    stats: cloneStats(state.stats),
  };
}

export function basePointers(): SlidingWindowPointers {
  return {
    left: null,
    right: null,
    anchor: null,
    scan: null,
    focusKey: null,
    focusValue: null,
    activeEntryId: null,
    activeGroupId: null,
    offset: null,
  };
}

export function createTraceRecorder(initialState: SlidingWindowState) {
  const state = initialState;
  const trace: SlidingWindowTraceStep[] = [];
  const pointers = basePointers();

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: Omit<SlidingWindowTraceStep, "step" | "state" | "pointers">) {
    trace.push({
      step: trace.length,
      state: cloneState(state),
      pointers: { ...pointers },
      action,
      actionKind,
      codeLines: [...codeLines],
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  return {
    state,
    trace,
    pointers,
    pushStep,
  };
}
