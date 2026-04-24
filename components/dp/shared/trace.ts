import type {
  DpTraceStep,
  VisualHighlights,
  VisualState,
  VisualTone,
} from "./types";

export function createTraceRecorder() {
  const trace: DpTraceStep[] = [];

  function pushStep(
    step: Omit<DpTraceStep, "step"> & {
      state: VisualState;
      highlights?: VisualHighlights;
    }
  ) {
    trace.push({
      step: trace.length,
      highlights: step.highlights ?? {},
      ...step,
    });
  }

  return { trace, pushStep };
}

export function numericTone(value: number): VisualTone {
  if (value > 0) {
    return "emerald";
  }

  if (value < 0) {
    return "rose";
  }

  return "slate";
}

export function boolTone(value: boolean): VisualTone {
  return value ? "emerald" : "rose";
}

export function formatInfinity(value: number) {
  return Number.isFinite(value) ? String(value) : "∞";
}
