export function cleanInlineText(raw: string) {
  return raw.trim();
}

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
    // Fall back to delimiter parsing.
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
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0);
    }
  } catch {
    // Fall back to delimiter parsing.
  }

  return trimmed
    .split(/[\n,|]+/)
    .map((part) => part.trim())
    .filter((value) => value.length > 0);
}

export function parseSentenceWords(raw: string) {
  return raw
    .trim()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((value) => value.length > 0);
}

export function normalizeString(raw: string) {
  return raw.trim();
}
