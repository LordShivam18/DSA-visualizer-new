import { normalizeString } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type IsomorphicStringsTraceStep = HashmapTraceStep;

function sortedCharMap(map: Map<string, string>, prefix: string) {
  return [...map.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([key, value]) => ({
      id: `${prefix}-${key}`,
      key: `${prefix === "forward" ? "s" : "t"}:${key}`,
      value,
      note:
        prefix === "forward"
          ? `maps to '${value}'`
          : `already claimed by '${value}'`,
      tone: prefix === "forward" ? "cyan" : "purple",
    }));
}

export function generateTrace(
  inputs: Record<string, string>
): IsomorphicStringsTraceStep[] {
  const s = normalizeString(inputs.s ?? "");
  const t = normalizeString(inputs.t ?? "");
  const forward = new Map<string, string>();
  const backward = new Map<string, string>();

  let processed = 0;
  let verdict: boolean | null = null;
  let phase: "check" | "done" = "check";
  let conflictMessage = "";

  const initialState: HashmapTraceState = {
    hero:
      "Two strings are isomorphic only when every source character always points to the same target character, and no target character gets reused by a different source.",
    primaryLabel: "String s",
    primaryItems: [],
    secondaryLabel: "String t",
    secondaryItems: [],
    mapLabel: "Bidirectional Mapping Ledger",
    mapEntries: [],
    stats: [],
    resultLabel: "isIsomorphic",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "We maintain both s -> t and t -> s so the mapping stays one-to-one in both directions.",
    footer:
      "A single forward map catches inconsistent reuse from s, but the reverse map is what prevents two source letters from collapsing onto the same target letter.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      verdict === false
        ? conflictMessage
        : phase === "check"
        ? "Each character pair is checked against both mapping tables before any new edge is recorded."
        : "Every pair respected the one-to-one mapping rule.";

    state.primaryItems = s.split("").map((char, index) => ({
      id: `s-${index}`,
      label: char,
      sublabel: `index ${index}`,
      tone:
        pointers.primaryIndex === index
          ? "cyan"
          : index < processed
          ? "green"
          : "slate",
      tags:
        pointers.primaryIndex === index
          ? ["active"]
          : index < processed
          ? ["checked"]
          : undefined,
    }));

    state.secondaryItems = t.split("").map((char, index) => ({
      id: `t-${index}`,
      label: char,
      sublabel: `index ${index}`,
      tone:
        pointers.secondaryIndex === index && verdict === false
          ? "red"
          : pointers.secondaryIndex === index
          ? "yellow"
          : index < processed
          ? "green"
          : "slate",
      tags:
        pointers.secondaryIndex === index && verdict === false
          ? ["conflict"]
          : pointers.secondaryIndex === index
          ? ["pair"]
          : index < processed
          ? ["locked"]
          : undefined,
    }));

    state.mapEntries = [
      ...sortedCharMap(forward, "forward").map((entry) => ({
        ...entry,
        tone: pointers.activeEntryId === entry.id ? ("yellow" as const) : ("cyan" as const),
      })),
      ...sortedCharMap(backward, "reverse").map((entry) => ({
        ...entry,
        tone: pointers.activeEntryId === entry.id ? ("yellow" as const) : ("purple" as const),
      })),
    ];

    state.stats = [
      { label: "Pairs Checked", value: `${processed}/${s.length}`, tone: "cyan" },
      { label: "s -> t Keys", value: `${forward.size}`, tone: "purple" },
      { label: "t -> s Keys", value: `${backward.size}`, tone: "yellow" },
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
        ? "A consistent pair either reuses the same old mapping or creates a fresh mapping in both tables."
        : verdict
        ? "Both hash maps agreed on every character pair, so the mapping is bijective."
        : conflictMessage;
  }

  syncState();

  pushStep({
    action:
      "Parse both strings and prepare two hash maps: one for s -> t and another for t -> s.",
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    explanationBeginner:
      "Using two maps helps us make sure the match works in both directions.",
    explanationExpert:
      "Bidirectional bookkeeping enforces injectivity and consistency simultaneously.",
    done: false,
  });

  if (s.length !== t.length) {
    verdict = false;
    phase = "done";
    conflictMessage =
      "The strings have different lengths, so they cannot pair position by position all the way through.";
    syncState();

    pushStep({
      action:
        "The strings have different lengths, so they fail before any mapping work begins.",
      actionKind: "length-mismatch",
      codeLines: [2],
      explanationBeginner:
        "If one string is longer, there is no way to pair every character with a partner.",
      explanationExpert:
        "Isomorphism requires a total position-wise correspondence, so unequal lengths are an immediate contradiction.",
      done: true,
    });

    return trace;
  }

  for (let index = 0; index < s.length; index += 1) {
    const left = s[index];
    const right = t[index];
    pointers.primaryIndex = index;
    pointers.secondaryIndex = index;
    pointers.focusKey = left;
    pointers.focusValue = right;
    syncState();

    pushStep({
      action: `Inspect pair (${left}, ${right}) at index ${index} and compare it against both mapping tables.`,
      actionKind: "inspect-pair",
      codeLines: [4, 5, 6],
      explanationBeginner:
        "We ask two questions: has this source character already picked a target, and has this target already been claimed by some other source?",
      explanationExpert:
        "A valid bijection must preserve both forward consistency and reverse uniqueness for every processed prefix.",
      done: false,
    });

    const forwardMatch = forward.get(left);
    const backwardMatch = backward.get(right);

    if (
      (forwardMatch !== undefined && forwardMatch !== right) ||
      (backwardMatch !== undefined && backwardMatch !== left)
    ) {
      verdict = false;
      phase = "done";
      conflictMessage =
        forwardMatch !== undefined && forwardMatch !== right
          ? `Character '${left}' already maps to '${forwardMatch}', so it cannot switch to '${right}'.`
          : `Character '${right}' is already reserved by '${backwardMatch}', so '${left}' cannot also map to it.`;
      syncState();

      pushStep({
        action: conflictMessage,
        actionKind: "mapping-conflict",
        codeLines: [6],
        explanationBeginner:
          "A letter cannot change its mind, and two different letters cannot share the same target.",
        explanationExpert:
          "The bijection invariant is broken, so the algorithm terminates as soon as one direction disagrees.",
        done: true,
      });

      return trace;
    }

    forward.set(left, right);
    backward.set(right, left);
    processed = index + 1;
    pointers.activeEntryId = `forward-${left}`;
    syncState();

    pushStep({
      action: `Record the mapping '${left}' -> '${right}' and the reverse claim '${right}' -> '${left}'.`,
      actionKind: "record-mapping",
      codeLines: [7, 8],
      explanationBeginner:
        "Once a pair is proven safe, we lock it into both maps so future positions must respect it.",
      explanationExpert:
        "Writing both edges preserves a one-to-one correspondence for the entire processed prefix.",
      done: false,
    });
  }

  verdict = true;
  phase = "done";
  pointers.primaryIndex = null;
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action:
      "Every character pair fit the same bijection from start to finish, so the strings are isomorphic.",
    actionKind: "done",
    codeLines: [10],
    explanationBeginner:
      "The mapping never contradicted itself, so the answer is true.",
    explanationExpert:
      "Both hash maps remained consistent for all indices, which proves a bijection exists.",
    done: true,
  });

  return trace;
}
