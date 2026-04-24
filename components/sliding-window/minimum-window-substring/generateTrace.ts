import { normalizeString } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  SlidingWindowState,
  SlidingWindowTraceStep,
  WindowGroup,
} from "../shared/types";

export type MinimumWindowSubstringTraceStep = SlidingWindowTraceStep;

function sortedNeedEntries(map: Map<string, number>) {
  return [...map.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function buildGroups(
  s: string,
  left: number,
  right: number,
  bestStart: number | null,
  bestEnd: number | null
): WindowGroup[] {
  const current = right >= left ? s.slice(left, right + 1).split("") : [];
  const best =
    bestStart !== null && bestEnd !== null
      ? s.slice(bestStart, bestEnd + 1).split("")
      : [];

  return [
    {
      id: "group-current",
      title: "Current Window",
      subtitle: "live candidate coverage",
      items: current,
      tone: "cyan",
    },
    {
      id: "group-best",
      title: "Best Window",
      subtitle: "shortest valid window so far",
      items: best,
      tone: "yellow",
    },
  ];
}

export function generateTrace(
  inputs: Record<string, string>
): MinimumWindowSubstringTraceStep[] {
  const s = normalizeString(inputs.s ?? "");
  const t = normalizeString(inputs.t ?? "");
  const need = new Map<string, number>();
  const have = new Map<string, number>();

  let left = 0;
  let formed = 0;
  let required = 0;
  let bestLength = Number.POSITIVE_INFINITY;
  let bestStart: number | null = null;
  let bestEnd: number | null = null;

  const initialState: SlidingWindowState = {
    hero:
      "The live window must cover every character required by t, including duplicates. The ledger tracks exactly when each requirement becomes satisfied.",
    primaryLabel: "Source String s",
    primaryItems: [],
    primarySpan: {
      start: null,
      end: null,
      tone: "emerald",
      label: "Live window",
    },
    bestSpan: {
      start: null,
      end: null,
      tone: "yellow",
      label: "Best answer",
    },
    secondaryLabel: "Required String t",
    secondaryItems: [],
    ledgerLabel: "Need vs Have Ledger",
    ledgerEntries: [],
    groupsLabel: "Window Comparison",
    groups: [],
    stats: [],
    resultLabel: "minimum window",
    resultValue: "building",
    resultTone: "emerald",
    summary:
      "A window becomes valid only when every required character reaches its needed count. Then the left edge shrinks greedily to tighten it.",
    footer:
      "This is the classic formed/required strategy: expand until all required keys are satisfied, then shrink until the window would become invalid again.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState(right: number | null) {
    const activeRight = right ?? -1;
    const currentWindow = activeRight >= left ? s.slice(left, activeRight + 1) : "";

    state.hero =
      currentWindow.length === 0
        ? "The next expansion will add one more character from s into the coverage window."
        : formed === required && required > 0
        ? `Window "${currentWindow}" covers all requirements, so the left edge can tighten it without losing validity until a needed count drops below target.`
        : `Window "${currentWindow}" is still building coverage; formed = ${formed} out of ${required} required character classes.`;

    state.primaryItems = s.split("").map((char, index) => {
      const inBest =
        bestStart !== null && bestEnd !== null && index >= bestStart && index <= bestEnd;
      const inActive = activeRight >= left && index >= left && index <= activeRight;

      return {
        id: `s-${index}`,
        label: char,
        sublabel: `index ${index}`,
        tone:
          index === pointers.right
            ? "emerald"
            : index === pointers.left
            ? "cyan"
            : inBest
            ? "yellow"
            : inActive
            ? formed === required
              ? "purple"
              : "cyan"
            : "slate",
        tags:
          index === pointers.left && index === pointers.right
            ? ["L", "R"]
            : index === pointers.left
            ? ["L"]
            : index === pointers.right
            ? ["R"]
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
            tone: formed === required ? "emerald" : "cyan",
            label: formed === required ? "valid window" : "coverage build",
          }
        : {
            start: null,
            end: null,
            tone: "emerald",
            label: "Live window",
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
            label: "Best answer",
          };

    state.secondaryItems = t.split("").map((char, index) => ({
      id: `t-${index}`,
      label: char,
      sublabel: "need",
      tone: char === pointers.focusKey ? "yellow" : "purple",
      tags: ["req"],
    }));

    state.ledgerEntries = sortedNeedEntries(need).map(([char, requiredCount]) => {
      const haveCount = have.get(char) ?? 0;
      const status =
        haveCount >= requiredCount
          ? haveCount === requiredCount
            ? "met"
            : "extra"
          : "missing";

      return {
        id: `need-${char}`,
        key: char,
        need: `${requiredCount}`,
        have: `${haveCount}`,
        delta:
          status === "met"
            ? "met"
            : status === "extra"
            ? `+${haveCount - requiredCount}`
            : `-${requiredCount - haveCount}`,
        note:
          status === "met"
            ? "exactly satisfied"
            : status === "extra"
            ? "window has spare copies"
            : "still missing copies",
        tone:
          status === "missing"
            ? char === pointers.focusKey
              ? "rose"
              : "purple"
            : char === pointers.focusKey
            ? "yellow"
            : "emerald",
      };
    });

    state.groups = buildGroups(s, left, activeRight, bestStart, bestEnd);
    state.stats = [
      { label: "Left", value: `${activeRight >= left ? left : 0}`, tone: "cyan" },
      { label: "Right", value: `${activeRight >= 0 ? activeRight : 0}`, tone: "emerald" },
      { label: "Coverage", value: `${formed}/${required}`, tone: formed === required && required > 0 ? "emerald" : "yellow" },
      {
        label: "Window Length",
        value: `${currentWindow.length}`,
        tone: "cyan",
      },
      {
        label: "Best Length",
        value: Number.isFinite(bestLength) ? `${bestLength}` : "none",
        tone: Number.isFinite(bestLength) ? "yellow" : "slate",
      },
    ];

    state.resultValue =
      bestStart !== null && bestEnd !== null
        ? s.slice(bestStart, bestEnd + 1)
        : "building";
    state.resultTone =
      bestStart !== null && bestEnd !== null ? "yellow" : "emerald";
    state.summary =
      bestStart !== null && bestEnd !== null
        ? `Best window so far is "${s.slice(bestStart, bestEnd + 1)}".`
        : "No fully covering window has been discovered yet.";
  }

  syncState(null);

  pushStep({
    action:
      "Parse s and t, then prepare a need ledger that records the exact counts each required character must reach.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "The target string tells the window what it must cover, including duplicates.",
    explanationExpert:
      "Coverage is tracked per required key, not per raw character position in t.",
    done: false,
  });

  if (t.length === 0) {
    state.resultValue = "";
    state.resultTone = "yellow";
    state.summary = "An empty target is already covered by the empty window.";

    pushStep({
      action: "The target string is empty, so the minimum window is the empty string immediately.",
      actionKind: "done",
      codeLines: [21],
      explanationBeginner:
        "There is nothing to cover, so the answer is empty right away.",
      explanationExpert:
        "The empty multiset is satisfied by the empty window.",
      done: true,
    });

    return trace;
  }

  for (const char of t) {
    need.set(char, (need.get(char) ?? 0) + 1);
    required = need.size;
    pointers.focusKey = char;
    pointers.focusValue = `${need.get(char)}`;
    pointers.activeEntryId = `need-${char}`;
    syncState(null);

    pushStep({
      action: `Record requirement '${char}', raising its needed count to ${need.get(
        char
      )}.`,
      actionKind: "build-need",
      codeLines: [3, 4],
      explanationBeginner:
        "Repeated characters in t raise the required count instead of creating a new kind of requirement.",
      explanationExpert:
        "The need map stores multiplicities, while required counts only distinct keys.",
      done: false,
    });
  }

  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState(null);

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right];
    have.set(char, (have.get(char) ?? 0) + 1);
    pointers.left = left;
    pointers.right = right;
    pointers.focusKey = char;
    pointers.focusValue = `${have.get(char)}`;
    pointers.activeEntryId = need.has(char) ? `need-${char}` : null;
    syncState(right);

    pushStep({
      action: `Expand right to include '${char}' at index ${right}, raising its window count to ${have.get(
        char
      )}.`,
      actionKind: "expand-window",
      codeLines: [6, 7, 8],
      explanationBeginner:
        "The window grows one character at a time while it tries to collect every required count.",
      explanationExpert:
        "The have map tracks window multiplicities for every scanned prefix of s.",
      done: false,
    });

    if (need.has(char) && have.get(char) === need.get(char)) {
      formed += 1;
      pointers.focusKey = char;
      pointers.focusValue = `${formed}/${required}`;
      syncState(right);

      pushStep({
        action: `Requirement '${char}' just became fully satisfied, so formed increases to ${formed}.`,
        actionKind: "satisfy-requirement",
        codeLines: [9],
        explanationBeginner:
          "One more required character class is now fully covered by the live window.",
        explanationExpert:
          "Formed counts satisfied distinct keys, not total matched characters.",
        done: false,
      });
    }

    while (formed === required && required > 0) {
      pointers.left = left;
      pointers.right = right;
      pointers.focusKey = "window valid";
      pointers.focusValue = s.slice(left, right + 1);
      syncState(right);

      pushStep({
        action: `Window "${s.slice(
          left,
          right + 1
        )}" is valid because it covers every required character count.`,
        actionKind: "window-valid",
        codeLines: [10],
        explanationBeginner:
          "A valid window means every requirement in t is fully covered somewhere inside the current slice of s.",
        explanationExpert:
          "Formed == required certifies full coverage of the need multiset.",
        done: false,
      });

      const windowLength = right - left + 1;
      if (windowLength < bestLength) {
        bestLength = windowLength;
        bestStart = left;
        bestEnd = right;
        pointers.activeGroupId = "group-best";
        syncState(right);

        pushStep({
          action: `Update the best answer because "${s.slice(
            left,
            right + 1
          )}" is the shortest valid window seen so far.`,
          actionKind: "update-best",
          codeLines: [11, 12, 13],
          explanationBeginner:
            "A shorter valid window is always better, so it replaces the old answer.",
          explanationExpert:
            "The optimum updates only at valid windows and only on strict improvement.",
          done: false,
        });
      }

      const outgoing = s[left];
      have.set(outgoing, (have.get(outgoing) ?? 0) - 1);
      pointers.focusKey = outgoing;
      pointers.focusValue = `${have.get(outgoing)}`;
      pointers.activeEntryId = need.has(outgoing) ? `need-${outgoing}` : null;
      syncState(right);

      pushStep({
        action: `Release '${outgoing}' from the left edge and decrease its window count to ${
          have.get(outgoing) ?? 0
        }.`,
        actionKind: "release-left",
        codeLines: [15, 16],
        explanationBeginner:
          "Once the window is valid, the left edge tries to remove characters to tighten it.",
        explanationExpert:
          "Contraction proceeds greedily until a needed count would fall below its requirement.",
        done: false,
      });

      if (need.has(outgoing) && (have.get(outgoing) ?? 0) < (need.get(outgoing) ?? 0)) {
        formed -= 1;
        pointers.focusValue = `${formed}/${required}`;
        syncState(right);

        pushStep({
          action: `Removing '${outgoing}' dropped its count below the needed amount, so formed decreases to ${formed} and the window becomes invalid again.`,
          actionKind: "lose-coverage",
          codeLines: [17],
          explanationBeginner:
            "The window was tightened one step too far, so it no longer covers everything.",
          explanationExpert:
            "The invariant breaks precisely when a required key crosses from satisfied to unsatisfied.",
          done: false,
        });
      }

      left += 1;
      pointers.left = left;
      syncState(right);
    }
  }

  pointers.left = null;
  pointers.right = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  syncState(s.length - 1);
  state.resultValue =
    bestStart !== null && bestEnd !== null ? s.slice(bestStart, bestEnd + 1) : "";
  state.resultTone =
    bestStart !== null && bestEnd !== null ? "yellow" : "rose";
  state.summary =
    bestStart !== null && bestEnd !== null
      ? `The minimum window substring is "${s.slice(bestStart, bestEnd + 1)}".`
      : "No window covered every required character, so the answer is the empty string.";

  pushStep({
    action:
      bestStart !== null && bestEnd !== null
        ? `The scan is complete. The minimum window substring is "${s.slice(
            bestStart,
            bestEnd + 1
          )}".`
        : "The scan is complete, and no valid covering window exists for this input.",
    actionKind: "done",
    codeLines: [21],
    explanationBeginner:
      bestStart !== null && bestEnd !== null
        ? "The shortest fully covering window survived every later comparison, so it becomes the final answer."
        : "The window never managed to cover everything in t, so the answer is empty.",
    explanationExpert:
      bestStart !== null && bestEnd !== null
        ? "The greedy shrink loop ensures that each valid right boundary is paired with its tightest feasible left boundary."
        : "The formed counter never reached required in a durable way, so no covering window exists.",
    done: true,
  });

  return trace;
}
