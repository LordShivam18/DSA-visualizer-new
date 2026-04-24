function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseInteger(raw: string, fallback = 0) {
  const parsed = Number.parseInt(raw.trim(), 10);
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
        .map((value) => (typeof value === "string" ? Number(value.trim()) : value))
        .filter(isFiniteNumber);
    }
  } catch {
    // Fall through to delimiter parsing.
  }

  return trimmed
    .split(/[\s,|]+/)
    .map((value) => Number(value))
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
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0);
    }
  } catch {
    // Fall through to delimiter parsing.
  }

  return trimmed
    .split(/[\n,|]+/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
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
              .map((value) =>
                typeof value === "string" ? Number(value.trim()) : value
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

export function parseBinaryMatrix(raw: string) {
  return parseNestedNumberList(raw).map((row) =>
    row.map((value) => (value === 0 ? 0 : 1))
  );
}

export function formatArray(values: readonly (string | number | boolean)[]) {
  return `[${values.map((value) => String(value)).join(", ")}]`;
}

export function formatMatrix(values: readonly (readonly (string | number)[])[]) {
  return `[${values
    .map((row) => `[${row.map((value) => String(value)).join(", ")}]`)
    .join(", ")}]`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
