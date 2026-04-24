function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseInteger(value: string, fallback = 0) {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseNumberList(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as number[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) =>
          typeof item === "string" ? Number(item.trim()) : item
        )
        .filter(isFiniteNumber);
    }
  } catch {
    // Fall through to delimiter parsing.
  }

  return trimmed
    .split(/[\s,|]+/)
    .map((chunk) => Number(chunk))
    .filter(isFiniteNumber);
}

export function parseStringList(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0);
    }
  } catch {
    // Fall through to delimiter parsing.
  }

  return trimmed
    .split(/[\n,|]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function parseNestedNumberList(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as number[][];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed.map((row) =>
        Array.isArray(row)
          ? row
              .map((item) =>
                typeof item === "string" ? Number(item.trim()) : item
              )
              .filter(isFiniteNumber)
          : []
      );
    }
  } catch {
    // Fall through to row parsing.
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => parseNumberList(line))
    .filter((row) => row.length > 0);
}

export function formatArray(values: readonly (string | number | null)[]) {
  return `[${values.map((value) => String(value)).join(", ")}]`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
