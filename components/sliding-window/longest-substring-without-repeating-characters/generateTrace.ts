import { normalizeString } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  SlidingWindowState,
  SlidingWindowTraceStep,
  WindowGroup,
} from "../shared/types";

export type LongestSubstringWithoutRepeatingCharactersTraceStep =
  SlidingWindowTraceStep;

function sliceChars(value: string, start: number, end: number) {
  if (end < start || start < 0 || end < 0) {
    return [];
  }

  return value.slice(start, end + 1).split("");
}

function groupsFor(
  s: string,
  left: number,
  right: number,
  bestStart: number | null,
  bestEnd: number | null
): WindowGroup[] {
  const current = right >= left ? sliceChars(s, left, right) : [];
  const best =
    bestStart !== null && bestEnd !== null
      ? sliceChars(s, bestStart, bestEnd)
      : [];

  return [
    {
      id: "group-current",
      title: "Current Substring",
      subtitle: "live window after duplicate cleanup",
      items: current,
      tone: "cyan",
    },
    {
      id: "group-best",
      title: "Best Substring",
      subtitle: "longest duplicate-free window so far",
      items: best,
      tone: "yellow",
    },
  ];
}

export function generateTrace(
  inputs: Record<string, string>
): LongestSubstringWithoutRepeatingCharactersTraceStep[] {
  const s = normalizeString(inputs.s ?? "");
  const counts = new Map<string, number>();

  let left = 0;
  let bestLength = 0;
  let bestStart: number | null = null;
  let bestEnd: number | null = null;
  let currentDuplicate: string | null = null;

  const initialState: SlidingWindowState = {
    hero:
      "The window is allowed to contain each character at most once. When a repeat enters from the right, the left edge keeps moving until that repeat disappears.",
    primaryLabel: "Character Rail",
    primaryItems: [],
    primarySpan: {
      start: null,
      end: null,
      tone: "emerald",
      label: "Live substring",
    },
    bestSpan: {
      start: null,
      end: null,
      tone: "yellow",
      label: "Best substring",
    },
    ledgerLabel: "Character Count Ledger",
    ledgerEntries: [],
    groupsLabel: "Substring Comparison",
    groups: [],
    stats: [],
    resultLabel: "longest length",
    resultValue: "building",
    resultTone: "emerald",
    summary:
      "The invariant is strict: every character count inside the live window must stay at most 1.",
    footer:
      "This version uses a frequency ledger for teaching. The same idea can also be implemented with last-seen indices.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState(right: number | null) {
    const activeRight = right ?? -1;
    const currentChars =
      activeRight >= left ? sliceChars(s, left, activeRight) : [];
    const duplicateEntries = [...counts.entries()].filter(([, count]) => count > 1);

    state.hero =
      currentChars.length === 0
        ? "The next character will enter from the right and begin a fresh window."
        : duplicateEntries.length > 0
        ? `Character '${currentDuplicate}' is duplicated, so the left edge must keep moving until its count drops back to 1.`
        : `Window "${currentChars.join("")}" is duplicate-free, so it is eligible to update the best answer.`;

    state.primaryItems = s.split("").map((char, index) => {
      const count = counts.get(char) ?? 0;
      const inBest =
        bestStart !== null && bestEnd !== null && index >= bestStart && index <= bestEnd;
      const inActive = activeRight >= left && index >= left && index <= activeRight;

      return {
        id: `char-${index}`,
        label: char,
        sublabel: `index ${index}`,
        tone:
          index === pointers.right
            ? "emerald"
            : index === pointers.left
            ? "cyan"
            : inActive && count > 1 && char === currentDuplicate
            ? "rose"
            : inBest
            ? "yellow"
            : inActive
            ? "purple"
            : "slate",
        tags:
          index === pointers.left && index === pointers.right
            ? ["L", "R"]
            : index === pointers.left
            ? ["L"]
            : index === pointers.right
            ? ["R"]
            : inActive && count > 1 && char === currentDuplicate
            ? ["dup"]
            : inBest
            ? ["best"]
            : inActive
            ? ["live"]
            : undefined,
      };
    });

    state.primarySpan =
      activeRight >= left
        ? {
            start: left,
            end: activeRight,
            tone: duplicateEntries.length > 0 ? "rose" : "emerald",
            label: duplicateEntries.length > 0 ? "duplicate flush" : "unique window",
          }
        : {
            start: null,
            end: null,
            tone: "emerald",
            label: "Live substring",
          };

    state.bestSpan =
      bestStart !== null && bestEnd !== null
        ? {
            start: bestStart,
            end: bestEnd,
            tone: "yellow",
            label: `best len ${bestLength}`,
          }
        : {
            start: null,
            end: null,
            tone: "yellow",
            label: "Best substring",
          };

    state.ledgerEntries = [...counts.entries()]
      .filter(([, count]) => count > 0)
      .sort((leftEntry, rightEntry) => leftEntry[0].localeCompare(rightEntry[0]))
      .map(([char, count]) => ({
        id: `count-${char}`,
        key: char,
        need: "<= 1",
        have: `${count}`,
        delta: count > 1 ? "repeat" : "unique",
        note:
          count > 1
            ? "window is invalid until this duplicate is removed"
            : "safe frequency",
        tone:
          char === currentDuplicate && count > 1
            ? "rose"
            : char === pointers.focusKey
            ? "emerald"
            : "purple",
      }));

    state.groups = groupsFor(s, left, activeRight, bestStart, bestEnd);
    state.stats = [
      { label: "Left", value: `${activeRight >= left ? left : 0}`, tone: "cyan" },
      { label: "Right", value: `${activeRight >= 0 ? activeRight : 0}`, tone: "emerald" },
      {
        label: "Window Length",
        value: `${currentChars.length}`,
        tone: duplicateEntries.length > 0 ? "rose" : "cyan",
      },
      { label: "Best Length", value: `${bestLength}`, tone: "yellow" },
    ];

    state.resultValue = `${bestLength}`;
    state.resultTone = bestLength > 0 ? "yellow" : "emerald";
    state.summary =
      bestLength > 0
        ? `Best duplicate-free substring so far is "${bestStart !== null && bestEnd !== null ? s.slice(bestStart, bestEnd + 1) : ""}".`
        : "No non-empty duplicate-free substring has been locked in yet.";
  }

  syncState(null);

  pushStep({
    action:
      "Parse the string and prepare a character-count ledger for the live window.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "The window is only valid when every character inside it appears once at most.",
    explanationExpert:
      "The invariant is count[c] <= 1 for every character c inside the current window.",
    done: false,
  });

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right];
    counts.set(char, (counts.get(char) ?? 0) + 1);
    currentDuplicate = char;
    pointers.left = left;
    pointers.right = right;
    pointers.focusKey = char;
    pointers.focusValue = `${counts.get(char)}`;
    pointers.activeEntryId = `count-${char}`;
    syncState(right);

    pushStep({
      action: `Expand right to include '${char}' at index ${right}, changing its count inside the window to ${counts.get(
        char
      )}.`,
      actionKind: "expand-window",
      codeLines: [3, 4],
      explanationBeginner:
        "Every step adds one new character from the right side.",
      explanationExpert:
        "The outer loop advances the right boundary and updates the frequency ledger for the enlarged window.",
      done: false,
    });

    while ((counts.get(char) ?? 0) > 1) {
      pointers.left = left;
      pointers.right = right;
      pointers.focusKey = char;
      pointers.focusValue = `${counts.get(char)}`;
      pointers.activeEntryId = `count-${char}`;
      syncState(right);

      pushStep({
        action: `Character '${char}' now repeats, so the window is invalid and must shrink from the left.`,
        actionKind: "duplicate-detected",
        codeLines: [5],
        explanationBeginner:
          "A repeated character breaks the rule, so the left edge starts removing characters until the duplicate disappears.",
        explanationExpert:
          "The shrink loop restores the invariant count[s[right]] <= 1 after the new right character enters.",
        done: false,
      });

      const removed = s[left];
      counts.set(removed, (counts.get(removed) ?? 0) - 1);
      left += 1;
      pointers.left = left;
      pointers.right = right;
      pointers.focusKey = removed;
      pointers.focusValue = `${counts.get(removed) ?? 0}`;
      pointers.activeEntryId = `count-${removed}`;
      syncState(right);

      pushStep({
        action: `Drop '${removed}' from the left boundary and move left to ${left}, reducing that character count to ${
          counts.get(removed) ?? 0
        }.`,
        actionKind: "shrink-window",
        codeLines: [6, 7],
        explanationBeginner:
          "Removing characters from the left is how the algorithm flushes the duplicate back out of the window.",
        explanationExpert:
          "Every shrink step decrements the outgoing character and advances left until the repeated character becomes unique again.",
        done: false,
      });
    }

    currentDuplicate = null;
    const currentLength = right - left + 1;
    if (currentLength > bestLength) {
      bestLength = currentLength;
      bestStart = left;
      bestEnd = right;
      pointers.activeGroupId = "group-best";
      syncState(right);

      pushStep({
        action: `Update the best answer because "${s.slice(
          left,
          right + 1
        )}" has length ${currentLength}, which is longer than every duplicate-free window seen earlier.`,
        actionKind: "update-best",
        codeLines: [8],
        explanationBeginner:
          "Once the window is clean again, a longer window becomes the new best answer.",
        explanationExpert:
          "The optimum is updated only after the invariant is restored, so every candidate is guaranteed to be duplicate-free.",
        done: false,
      });
    }
  }

  pointers.left = null;
  pointers.right = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  syncState(s.length - 1);

  pushStep({
    action: `The scan is complete. The longest substring without repeating characters has length ${bestLength}.`,
    actionKind: "done",
    codeLines: [10],
    explanationBeginner:
      "The best clean window stayed on top until the end, so its length is the final answer.",
    explanationExpert:
      "Every right boundary was processed once, and every left boundary moved monotonically forward, yielding linear time.",
    done: true,
  });

  return trace;
}
