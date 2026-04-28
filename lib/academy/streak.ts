export type StreakUpdateStatus =
  | "start"
  | "same-day"
  | "increment"
  | "reset";

function normalizeDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

export function toUtcDateKey(value: string | Date) {
  return normalizeDate(value);
}

export function resolveStreakUpdate(
  lastActiveDate: string | null,
  nextActiveDate: string | Date
): StreakUpdateStatus {
  if (!lastActiveDate) {
    return "start";
  }

  const lastDay = Date.parse(normalizeDate(lastActiveDate));
  const nextDay = Date.parse(normalizeDate(nextActiveDate));
  const difference = Math.round((nextDay - lastDay) / 86400000);

  if (difference <= 0) {
    return "same-day";
  }

  if (difference === 1) {
    return "increment";
  }

  return "reset";
}
