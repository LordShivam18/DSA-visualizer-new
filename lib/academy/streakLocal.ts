import type { LearnerProfile } from "./models";

export type LocalStreakUpdateStatus =
  | "start"
  | "same-day"
  | "increment"
  | "reset";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function padDateSegment(value: number) {
  return value.toString().padStart(2, "0");
}

export function getLocalDate(value: string | Date = new Date()) {
  if (typeof value === "string" && DATE_KEY_PATTERN.test(value)) {
    return value;
  }

  const source = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(source.getTime())) {
    return typeof value === "string" ? value.slice(0, 10) : "";
  }

  return [
    source.getFullYear(),
    padDateSegment(source.getMonth() + 1),
    padDateSegment(source.getDate()),
  ].join("-");
}

export function resolveLocalStreakUpdate(
  lastActiveAt: string | null,
  nextActiveAt: string | Date
): LocalStreakUpdateStatus {
  if (!lastActiveAt) {
    return "start";
  }

  const lastDay = Date.parse(getLocalDate(lastActiveAt));
  const nextDay = Date.parse(getLocalDate(nextActiveAt));
  const difference = Math.round((nextDay - lastDay) / 86400000);

  if (difference <= 0) {
    return "same-day";
  }

  if (difference === 1) {
    return "increment";
  }

  return "reset";
}

export function updateStreakLocal(
  learner: LearnerProfile,
  activeAt: string | Date
) {
  const streakChange = resolveLocalStreakUpdate(learner.lastActiveAt, activeAt);
  const nextActiveAt =
    activeAt instanceof Date ? activeAt.toISOString() : activeAt;

  return {
    ...learner,
    lastActiveAt: nextActiveAt,
    streakDays:
      streakChange === "start"
        ? 1
        : streakChange === "increment"
        ? learner.streakDays + 1
        : streakChange === "reset"
        ? 1
        : learner.streakDays,
  };
}
