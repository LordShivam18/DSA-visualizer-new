import { normalizeString } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type ValidAnagramTraceStep = HashmapTraceStep;

function sortedEntries(freq: Map<string, number>) {
  return [...freq.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

export function generateTrace(inputs: Record<string, string>): ValidAnagramTraceStep[] {
  const s = normalizeString(inputs.s ?? "");
  const t = normalizeString(inputs.t ?? "");
  const freq = new Map<string, number>();

  let builtCount = 0;
  let consumedCount = 0;
  let verdict: boolean | null = null;
  let failure = "";

  const initialState: HashmapTraceState = {
    hero:
      "Anagrams have identical character multisets. The first pass counts s, and the second pass removes the same characters using t.",
    primaryLabel: "Source String s",
    primaryItems: [],
    secondaryLabel: "Target String t",
    secondaryItems: [],
    mapLabel: "Frequency Delta Ledger",
    mapEntries: [],
    stats: [],
    resultLabel: "isAnagram",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "If the counts return cleanly to zero after consuming t, both strings contain exactly the same letters with the same multiplicities.",
    footer:
      "The length check is a fast fail. After that, the decrement pass is enough because equal lengths guarantee no positive leftovers can hide.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      verdict === false
        ? failure
        : verdict === true
        ? "Every decrement landed on a matching count, so the character ledger balances perfectly."
        : "The first string fills the hash map, and the second string tries to cancel every count back down.";

    state.primaryItems = s.split("").map((char, index) => ({
      id: `s-${index}`,
      label: char,
      sublabel: `index ${index}`,
      tone:
        pointers.primaryIndex === index
          ? "cyan"
          : index < builtCount
          ? "green"
          : "slate",
      tags:
        pointers.primaryIndex === index
          ? ["count"]
          : index < builtCount
          ? ["stored"]
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
          : index < consumedCount
          ? "green"
          : "slate",
      tags:
        pointers.secondaryIndex === index && verdict === false
          ? ["missing"]
          : pointers.secondaryIndex === index
          ? ["consume"]
          : index < consumedCount
          ? ["matched"]
          : undefined,
    }));

    state.mapEntries = sortedEntries(freq).map(([char, count]) => ({
      id: `freq-${char}`,
      key: `'${char}'`,
      value: `${count}`,
      note:
        count === 0
          ? "Balanced so far"
          : count > 0
          ? `${count} extra copy${count === 1 ? "" : "ies"} from s still unmatched`
          : `${Math.abs(count)} too many copies appeared in t`,
      tone:
        pointers.focusKey === char && verdict === false
          ? "red"
          : pointers.focusKey === char
          ? "yellow"
          : count === 0
          ? "green"
          : "purple",
    }));

    state.stats = [
      { label: "Build Pass", value: `${builtCount}/${s.length}`, tone: "cyan" },
      { label: "Consume Pass", value: `${consumedCount}/${t.length}`, tone: "yellow" },
      {
        label: "Balanced Keys",
        value: `${state.mapEntries.filter((entry) => entry.value === "0").length}/${state.mapEntries.length}`,
        tone: "green",
      },
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
        ? "Matching strings keep driving every frequency bucket back toward zero."
        : verdict
        ? "All counts balanced to zero, so the strings are anagrams."
        : failure;
  }

  syncState();

  pushStep({
    action:
      "Parse both strings and prepare a frequency map that will count characters from s before t tries to cancel them out.",
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    explanationBeginner:
      "Anagrams use the same letters the same number of times, so counting is the simplest way to compare them.",
    explanationExpert:
      "A frequency difference map converts multiset equality into a linear scan with O(1) average updates.",
    done: false,
  });

  if (s.length !== t.length) {
    verdict = false;
    failure =
      "The strings have different lengths, so they cannot possibly contain the exact same multiset of characters.";
    syncState();

    pushStep({
      action: failure,
      actionKind: "length-mismatch",
      codeLines: [2],
      explanationBeginner:
        "If one string has more characters, the counts can never match perfectly.",
      explanationExpert:
        "Equal multisets must have equal cardinality, so unequal lengths are an immediate contradiction.",
      done: true,
    });

    return trace;
  }

  for (let index = 0; index < s.length; index += 1) {
    const char = s[index];
    freq.set(char, (freq.get(char) ?? 0) + 1);
    builtCount = index + 1;
    pointers.primaryIndex = index;
    pointers.focusKey = char;
    pointers.focusValue = `${freq.get(char) ?? 0}`;
    pointers.activeEntryId = `freq-${char}`;
    syncState();

    pushStep({
      action: `Count '${char}' from s, raising its bucket to ${freq.get(char)}.`,
      actionKind: "count-source",
      codeLines: [4],
      explanationBeginner:
        "The first string fills the ledger so we know how many copies each letter should have.",
      explanationExpert:
        "After the build pass, each bucket stores the exact multiplicity of its character in s.",
      done: false,
    });
  }

  pointers.primaryIndex = null;
  pointers.focusValue = null;
  syncState();

  for (let index = 0; index < t.length; index += 1) {
    const char = t[index];
    pointers.secondaryIndex = index;
    pointers.focusKey = char;
    pointers.activeEntryId = `freq-${char}`;
    syncState();

    pushStep({
      action: `Consume '${char}' from t and check whether the ledger still has a matching count to cancel.`,
      actionKind: "inspect-target",
      codeLines: [5, 6],
      explanationBeginner:
        "The second string should remove the same letters that the first string added.",
      explanationExpert:
        "Any missing bucket or zero bucket means t demands a character more times than s supplied it.",
      done: false,
    });

    if ((freq.get(char) ?? 0) === 0) {
      verdict = false;
      failure = `Character '${char}' appears too many times in t, so the ledger cannot stay balanced.`;
      syncState();

      pushStep({
        action: failure,
        actionKind: "frequency-conflict",
        codeLines: [6],
        explanationBeginner:
          "The target string asked for a letter that the source string did not have left to match.",
        explanationExpert:
          "A zero count means the frequency difference would go negative, disproving multiset equality immediately.",
        done: true,
      });

      return trace;
    }

    freq.set(char, (freq.get(char) ?? 0) - 1);
    consumedCount = index + 1;
    pointers.focusValue = `${freq.get(char) ?? 0}`;
    syncState();

    pushStep({
      action: `Lower bucket '${char}' to ${freq.get(char)} after matching one copy from t.`,
      actionKind: "consume-target",
      codeLines: [7],
      explanationBeginner:
        "A successful match lowers the count because one copy from each string has now been paired.",
      explanationExpert:
        "The map represents the remaining frequency difference s - t over the processed prefixes.",
      done: false,
    });
  }

  verdict = true;
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action:
      "The entire second string cancelled the first string exactly, so the two strings are anagrams.",
    actionKind: "done",
    codeLines: [9],
    explanationBeginner:
      "All letters matched cleanly, so the answer is true.",
    explanationExpert:
      "No bucket ever went negative, and equal lengths ensure the final zeroed ledger proves multiset equality.",
    done: true,
  });

  return trace;
}
