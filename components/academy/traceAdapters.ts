import type { LessonStepLike } from "./hooks/useLessonController";

type TraceRecord = Record<string, unknown>;

function readText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export type LessonTraceStep<TStep extends TraceRecord> = TStep &
  LessonStepLike;

export function toLessonTrace<TStep extends TraceRecord>(
  steps: TStep[]
): LessonTraceStep<TStep>[] {
  return steps.map((item, index) => {
    const existingStep =
      typeof item.step === "number" ? item.step : index;
    const action =
      readText(item.action) ??
      readText(item.text) ??
      readText(item.explanation) ??
      readText(item.explanationBeginner) ??
      readText(item.type) ??
      `Step ${index + 1}`;
    const beginnerNote =
      readText(item.beginnerNote) ??
      readText(item.explanationBeginner) ??
      readText(item.text) ??
      readText(item.explanation) ??
      action;
    const expertNote =
      readText(item.expertNote) ??
      readText(item.explanationExpert) ??
      beginnerNote;

    return {
      ...item,
      step: existingStep,
      action,
      state: item.state ?? item,
      beginnerNote,
      expertNote,
      explanationBeginner: readText(item.explanationBeginner) ?? beginnerNote,
      explanationExpert: readText(item.explanationExpert) ?? expertNote,
      done: typeof item.done === "boolean" ? item.done : index === steps.length - 1,
    } as LessonTraceStep<TStep>;
  });
}
