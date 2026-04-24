import { normalizeString } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type RansomNoteTraceStep = HashmapTraceStep;

function sortedEntries(freq: Map<string, number>) {
  return [...freq.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

export function generateTrace(inputs: Record<string, string>): RansomNoteTraceStep[] {
  const ransomNote = normalizeString(inputs.ransomNote ?? "");
  const magazine = normalizeString(inputs.magazine ?? "");
  const freq = new Map<string, number>();

  let builtCount = 0;
  let fulfilledCount = 0;
  let verdict: boolean | null = null;
  let phase: "build" | "consume" | "done" = "build";
  let failedChar: string | null = null;
  let failureIndex: number | null = null;

  const initialState: HashmapTraceState = {
    hero:
      "First fill the magazine frequency table, then spend one count each time the ransom note asks for a letter.",
    primaryLabel: "Magazine Supply",
    primaryItems: [],
    secondaryLabel: "Ransom Demand",
    secondaryItems: [],
    mapLabel: "Frequency Ledger",
    mapEntries: [],
    stats: [],
    resultLabel: "canConstruct",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "A character can only be used as many times as it appears in the magazine.",
    footer:
      "This visualizer mirrors the classic two-pass hash map solution: count supply first, then consume demand.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      verdict === false && failedChar
        ? `The note asks for '${failedChar}' again, but the frequency table shows no spare copies left.`
        : phase === "build"
        ? "The magazine is being converted into a reusable character bank."
        : phase === "consume"
        ? "The ransom note is withdrawing letters from the frequency table one by one."
        : verdict
        ? "Every requested letter was successfully reserved from the magazine."
        : "The note cannot be built because at least one letter ran out.";

    state.primaryItems = magazine.split("").map((char, index) => ({
      id: `mag-${index}`,
      label: char,
      sublabel: `slot ${index}`,
      tone:
        pointers.primaryIndex === index
          ? "cyan"
          : index < builtCount
          ? "green"
          : "slate",
      tags:
        pointers.primaryIndex === index
          ? ["counting"]
          : index < builtCount
          ? ["banked"]
          : undefined,
    }));

    state.secondaryItems = ransomNote.split("").map((char, index) => ({
      id: `note-${index}`,
      label: char,
      sublabel: `slot ${index}`,
      tone:
        pointers.secondaryIndex === index && verdict === false
          ? "red"
          : pointers.secondaryIndex === index
          ? "yellow"
          : index < fulfilledCount
          ? "green"
          : "slate",
      tags:
        pointers.secondaryIndex === index && verdict === false
          ? ["missing"]
          : pointers.secondaryIndex === index
          ? ["checking"]
          : index < fulfilledCount
          ? ["used"]
          : undefined,
    }));

    state.mapEntries = sortedEntries(freq).map(([char, count]) => ({
      id: `freq-${char}`,
      key: `'${char}'`,
      value: `${count}`,
      note:
        count > 0
          ? `${count} copy${count === 1 ? "" : "ies"} still available`
          : "No spare copies remain",
      tone:
        pointers.focusKey === char && verdict === false
          ? "red"
          : pointers.focusKey === char
          ? "yellow"
          : count > 0
          ? "green"
          : "slate",
    }));

    state.stats = [
      { label: "Supply Scanned", value: `${builtCount}/${magazine.length}`, tone: "cyan" },
      {
        label: "Demand Met",
        value: `${fulfilledCount}/${ransomNote.length}`,
        tone: verdict === false ? "red" : "green",
      },
      { label: "Distinct Keys", value: `${freq.size}`, tone: "purple" },
      {
        label: "Verdict",
        value: verdict === null ? "building" : String(verdict),
        tone: verdict === null ? "yellow" : verdict ? "green" : "red",
      },
    ];

    state.resultValue = verdict === null ? "building" : String(verdict);
    state.resultTone = verdict === null ? "cyan" : verdict ? "green" : "red";
    state.verdict = verdict;
    state.summary =
      verdict === null
        ? "Positive counts mean the magazine still has spare letters to spend."
        : verdict
        ? "The note succeeded because every demand found available supply."
        : `Construction fails exactly at note index ${failureIndex ?? "-"} when '${failedChar ?? "?"}' is unavailable.`;
  }

  syncState();

  pushStep({
    action:
      "Parse the two strings and prepare a frequency ledger that will store how many copies of each magazine letter are available.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "We start with an empty letter bank. The magazine will fill it, and the ransom note will spend from it.",
    explanationExpert:
      "The hash map compresses repeated characters into counts, so later membership checks and decrements stay O(1) on average.",
    done: false,
  });

  for (let index = 0; index < magazine.length; index += 1) {
    const char = magazine[index];
    pointers.primaryIndex = index;
    pointers.focusKey = char;
    pointers.focusValue = `${(freq.get(char) ?? 0) + 1}`;
    freq.set(char, (freq.get(char) ?? 0) + 1);
    builtCount = index + 1;
    pointers.activeEntryId = `freq-${char}`;
    syncState();

    pushStep({
      action: `Add magazine letter '${char}' into the hash map, increasing its available count to ${freq.get(
        char
      )}.`,
      actionKind: "count-supply",
      codeLines: [3, 4],
      explanationBeginner:
        "Each magazine letter is saved in the bank so we know how many copies we can spend later.",
      explanationExpert:
        "The first pass materializes the multiset of available characters. Duplicates collapse into a single key with a larger count.",
      done: false,
    });
  }

  phase = "consume";
  pointers.primaryIndex = null;
  pointers.focusValue = null;
  syncState();

  for (let index = 0; index < ransomNote.length; index += 1) {
    const char = ransomNote[index];
    pointers.secondaryIndex = index;
    pointers.focusKey = char;
    pointers.activeEntryId = `freq-${char}`;
    syncState();

    pushStep({
      action: `The ransom note requests '${char}' at index ${index}. Check whether the frequency ledger still has a spare copy.`,
      actionKind: "inspect-demand",
      codeLines: [6, 7],
      explanationBeginner:
        "Now the note starts asking for letters. A missing or empty entry means the construction stops immediately.",
      explanationExpert:
        "Each request is a direct hash lookup. The algorithm fails fast as soon as any required count is zero.",
      done: false,
    });

    if ((freq.get(char) ?? 0) === 0) {
      verdict = false;
      failedChar = char;
      failureIndex = index;
      phase = "done";
      syncState();

      pushStep({
        action: `Letter '${char}' is unavailable, so the ransom note cannot be constructed from the magazine.`,
        actionKind: "fail-demand",
        codeLines: [7],
        explanationBeginner:
          "The note needs one more copy of this letter than the magazine can provide.",
        explanationExpert:
          "A zero count violates the feasibility invariant, so the algorithm returns false without scanning any remaining characters.",
        done: true,
      });

      return trace;
    }

    freq.set(char, (freq.get(char) ?? 0) - 1);
    fulfilledCount = index + 1;
    pointers.focusValue = `${freq.get(char) ?? 0}`;
    syncState();

    pushStep({
      action: `Spend one '${char}' from the ledger. Its remaining supply drops to ${freq.get(
        char
      )}.`,
      actionKind: "consume-demand",
      codeLines: [8],
      explanationBeginner:
        "Using a letter means lowering its count so the same magazine character cannot be reused by mistake.",
      explanationExpert:
        "Decrementing in place preserves the multiset invariant: the map always reflects unspent magazine supply after each prefix of the ransom note.",
      done: false,
    });
  }

  verdict = true;
  phase = "done";
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action: "Every letter in the ransom note found a matching copy in the magazine, so the final answer is true.",
    actionKind: "done",
    codeLines: [10],
    explanationBeginner:
      "The note never ran out of letters, so construction succeeds.",
    explanationExpert:
      "Because each demand was satisfied and decremented, the hash map proves the magazine multiset dominates the ransom-note multiset.",
    done: true,
  });

  return trace;
}
