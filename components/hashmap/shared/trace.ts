import type {
  HashmapPointers,
  HashmapTraceState,
  HashmapTraceStep,
  VisualEntry,
  VisualGroup,
  VisualStat,
  VisualToken,
} from "./types";

export function basePointers(): HashmapPointers {
  return {
    primaryIndex: null,
    secondaryIndex: null,
    tertiaryIndex: null,
    focusKey: null,
    focusValue: null,
    activeEntryId: null,
    activeGroupId: null,
  };
}

function cloneTokens(items: VisualToken[]) {
  return items.map((item) => ({
    ...item,
    tags: item.tags ? [...item.tags] : undefined,
  }));
}

function cloneEntries(items: VisualEntry[]) {
  return items.map((item) => ({ ...item }));
}

function cloneGroups(items: VisualGroup[]) {
  return items.map((item) => ({
    ...item,
    items: [...item.items],
  }));
}

function cloneStats(items: VisualStat[]) {
  return items.map((item) => ({ ...item }));
}

export function cloneState(state: HashmapTraceState): HashmapTraceState {
  return {
    ...state,
    primaryItems: cloneTokens(state.primaryItems),
    secondaryItems: state.secondaryItems
      ? cloneTokens(state.secondaryItems)
      : undefined,
    tertiaryItems: state.tertiaryItems
      ? cloneTokens(state.tertiaryItems)
      : undefined,
    mapEntries: cloneEntries(state.mapEntries),
    groups: state.groups ? cloneGroups(state.groups) : undefined,
    auxItems: state.auxItems ? cloneTokens(state.auxItems) : undefined,
    stats: cloneStats(state.stats),
  };
}

export function createTraceRecorder(initialState: HashmapTraceState) {
  const state = initialState;
  const trace: HashmapTraceStep[] = [];
  const pointers = basePointers();

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: Omit<HashmapTraceStep, "step" | "state" | "pointers">) {
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
