export function parseNumberArray(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as number[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    }
  } catch {
    // Fall back to delimiters.
  }

  return trimmed
    .split(/[\s,|]+/)
    .map((part) => Number(part))
    .filter((value) => Number.isFinite(value));
}

export function parseWordArray(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => String(value))
        .filter((value) => value.length > 0 || value === "");
    }
  } catch {
    // Fall back to delimiters.
  }

  return trimmed
    .split(/[\n,|]+/)
    .map((part) => part.trim())
    .filter((value) => value.length > 0 || value === "");
}

export function normalizeString(raw: string) {
  return raw.trim();
}
