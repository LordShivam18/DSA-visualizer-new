import type { LessonStepLike } from "./hooks/useLessonController";

type TraceRecord = Record<string, unknown>;

function readText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export type LessonTraceStep<TStep extends object> = TStep &
  LessonStepLike;

export function toLessonTrace<TStep extends object>(
  steps: TStep[]
): LessonTraceStep<TStep>[] {
  return steps.map((item, index) => {
    const record = item as TraceRecord;
    const existingStep =
      typeof record.step === "number" ? record.step : index;
    const action =
      readText(record.action) ??
      readText(record.text) ??
      readText(record.explanation) ??
      readText(record.explanationBeginner) ??
      readText(record.type) ??
      `Step ${index + 1}`;
    const beginnerNote =
      readText(record.beginnerNote) ??
      readText(record.explanationBeginner) ??
      readText(record.text) ??
      readText(record.explanation) ??
      action;
    const expertNote =
      readText(record.expertNote) ??
      readText(record.explanationExpert) ??
      beginnerNote;

    return {
      ...item,
      step: existingStep,
      action,
      state: record.state ?? item,
      beginnerNote,
      expertNote,
      explanationBeginner: readText(record.explanationBeginner) ?? beginnerNote,
      explanationExpert: readText(record.explanationExpert) ?? expertNote,
      done: typeof record.done === "boolean" ? record.done : index === steps.length - 1,
    } as LessonTraceStep<TStep>;
  });
}
