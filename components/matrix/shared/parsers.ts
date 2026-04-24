function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeJson(raw: string) {
  return raw.replace(/'/g, '"');
}

export function parseInteger(value: string, fallback = 0) {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseNumberMatrix(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as number[][];
  }

  try {
    const parsed = JSON.parse(normalizeJson(trimmed));
    if (Array.isArray(parsed)) {
      return parsed
        .map((row) =>
          Array.isArray(row)
            ? row
                .map((item) =>
                  typeof item === "string" ? Number(item.trim()) : item
                )
                .filter(isFiniteNumber)
            : []
        )
        .filter((row) => row.length > 0);
    }
  } catch {
    // Fall back to plain text parsing.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((line) =>
      line
        .split(/[\s,]+/)
        .map((token) => Number(token.trim()))
        .filter(isFiniteNumber)
    )
    .filter((row) => row.length > 0);
}

export function parseStringMatrix(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as string[][];
  }

  try {
    const parsed = JSON.parse(normalizeJson(trimmed));
    if (Array.isArray(parsed)) {
      return parsed
        .map((row) =>
          Array.isArray(row)
            ? row.map((item) => String(item).trim())
            : []
        )
        .filter((row) => row.length > 0);
    }
  } catch {
    // Fall back to plain text parsing.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((line) =>
      line
        .split(/[\s,]+/)
        .map((token) => token.trim())
        .filter(Boolean)
    )
    .filter((row) => row.length > 0);
}

export function isRectangular<T>(matrix: T[][]) {
  if (matrix.length === 0) {
    return false;
  }

  const width = matrix[0].length;
  return width > 0 && matrix.every((row) => row.length === width);
}

export function cloneMatrix<T>(matrix: T[][]) {
  return matrix.map((row) => [...row]);
}

export function formatArray(values: readonly (string | number | boolean)[]) {
  return `[${values.map((value) => String(value)).join(", ")}]`;
}

export function formatMatrix(matrix: readonly (readonly (string | number)[])[]) {
  return `[${matrix.map((row) => formatArray(row)).join(", ")}]`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
