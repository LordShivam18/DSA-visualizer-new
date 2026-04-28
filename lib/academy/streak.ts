export type StreakUpdateStatus =
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

export function resolveStreakUpdate(
  lastActiveDate: string | null,
  nextActiveDate: string | Date
): StreakUpdateStatus {
  if (!lastActiveDate) {
    return "start";
  }

  const lastDay = Date.parse(getLocalDate(lastActiveDate));
  const nextDay = Date.parse(getLocalDate(nextActiveDate));
  const difference = Math.round((nextDay - lastDay) / 86400000);

  if (difference <= 0) {
    return "same-day";
  }

  if (difference === 1) {
    return "increment";
  }

  return "reset";
}
