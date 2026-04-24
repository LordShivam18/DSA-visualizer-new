import { normalizeString, parseSentenceWords } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type WordPatternTraceStep = HashmapTraceStep;

function sortedEntries(map: Map<string, string>, prefix: "char" | "word") {
  return [...map.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([key, value]) => ({
      id: `${prefix}-${key}`,
      key: prefix === "char" ? `letter:${key}` : `word:${key}`,
      value,
      note:
        prefix === "char"
          ? `maps to word "${value}"`
          : `claimed by pattern letter "${value}"`,
      tone: prefix === "char" ? "cyan" : "purple",
    }));
}

export function generateTrace(inputs: Record<string, string>): WordPatternTraceStep[] {
  const pattern = normalizeString(inputs.pattern ?? "");
  const words = parseSentenceWords(inputs.s ?? "");
  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  let processed = 0;
  let verdict: boolean | null = null;
  let failure = "";

  const initialState: HashmapTraceState = {
    hero:
      "A valid word pattern is just a bijection between pattern letters and whole words.",
    primaryLabel: "Pattern Letters",
    primaryItems: [],
    secondaryLabel: "Sentence Words",
    secondaryItems: [],
    mapLabel: "Bijection Ledger",
    mapEntries: [],
    stats: [],
    resultLabel: "wordPattern",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "Letters and words must match one-to-one. Reusing an old pair is fine; inventing conflicting pairs is not.",
    footer:
      "This problem is isomorphic strings at the word level: letters play the role of sources and words play the role of destinations.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      verdict === false
        ? failure
        : "Each position checks whether the current letter and word agree with the mappings already stored.";

    state.primaryItems = pattern.split("").map((char, index) => ({
      id: `pattern-${index}`,
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
          ? ["paired"]
          : undefined,
    }));

    state.secondaryItems = words.map((word, index) => ({
      id: `word-${index}`,
      label: word,
      sublabel: `slot ${index}`,
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
          ? ["check"]
          : index < processed
          ? ["matched"]
          : undefined,
    }));

    state.mapEntries = [
      ...sortedEntries(charToWord, "char").map((entry) => ({
        ...entry,
        tone: pointers.activeEntryId === entry.id ? ("yellow" as const) : ("cyan" as const),
      })),
      ...sortedEntries(wordToChar, "word").map((entry) => ({
        ...entry,
        tone: pointers.activeEntryId === entry.id ? ("yellow" as const) : ("purple" as const),
      })),
    ];

    state.stats = [
      { label: "Pairs Checked", value: `${processed}/${pattern.length}`, tone: "cyan" },
      { label: "Words", value: `${words.length}`, tone: "yellow" },
      { label: "Map Size", value: `${charToWord.size}`, tone: "purple" },
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
        ? "Both hash maps stay synchronized so every word choice is reversible."
        : verdict
        ? "The entire sentence matches the pattern because every position obeyed the same bijection."
        : failure;
  }

  syncState();

  pushStep({
    action:
      "Parse the pattern and split the sentence into words, then prepare two hash maps to keep the bijection honest.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    explanationBeginner:
      "We need one map for letter -> word and another for word -> letter.",
    explanationExpert:
      "Two synchronized maps enforce a true bijection rather than just forward consistency.",
    done: false,
  });

  if (pattern.length !== words.length) {
    verdict = false;
    failure =
      "The pattern and the sentence do not have the same number of positions, so they cannot line up one by one.";
    syncState();

    pushStep({
      action: failure,
      actionKind: "length-mismatch",
      codeLines: [3],
      explanationBeginner:
        "A full match is impossible if the letter count and word count are different.",
      explanationExpert:
        "Position-wise bijection requires equal cardinality of both sequences.",
      done: true,
    });

    return trace;
  }

  for (let index = 0; index < pattern.length; index += 1) {
    const letter = pattern[index];
    const word = words[index];
    pointers.primaryIndex = index;
    pointers.secondaryIndex = index;
    pointers.focusKey = letter;
    pointers.focusValue = word;
    syncState();

    pushStep({
      action: `Compare pattern letter '${letter}' with word "${word}" at position ${index}.`,
      actionKind: "inspect-pair",
      codeLines: [6, 7, 8, 9],
      explanationBeginner:
        "This step checks whether the current letter and word still agree with the older pairs we already locked in.",
      explanationExpert:
        "The processed prefix defines a partial bijection. The next pair must extend that same mapping without contradiction.",
      done: false,
    });

    const mappedWord = charToWord.get(letter);
    const mappedLetter = wordToChar.get(word);

    if (
      (mappedWord !== undefined && mappedWord !== word) ||
      (mappedLetter !== undefined && mappedLetter !== letter)
    ) {
      verdict = false;
      failure =
        mappedWord !== undefined && mappedWord !== word
          ? `Pattern letter '${letter}' is already locked to "${mappedWord}", so it cannot switch to "${word}".`
          : `Word "${word}" is already claimed by '${mappedLetter}', so '${letter}' cannot also map to it.`;
      syncState();

      pushStep({
        action: failure,
        actionKind: "mapping-conflict",
        codeLines: [9],
        explanationBeginner:
          "A letter cannot point to two different words, and a word cannot belong to two different letters.",
        explanationExpert:
          "The partial bijection fails, so the algorithm returns false on the first inconsistency.",
        done: true,
      });

      return trace;
    }

    charToWord.set(letter, word);
    wordToChar.set(word, letter);
    processed = index + 1;
    pointers.activeEntryId = `char-${letter}`;
    syncState();

    pushStep({
      action: `Store the pair '${letter}' <-> "${word}" in both directions.`,
      actionKind: "record-pair",
      codeLines: [10, 11],
      explanationBeginner:
        "The pair is safe, so we remember it for every later occurrence.",
      explanationExpert:
        "Persisting both directions ensures future repeated letters and repeated words are validated in O(1) average time.",
      done: false,
    });
  }

  verdict = true;
  pointers.primaryIndex = null;
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action:
      "Every position extended the same bijection, so the sentence follows the pattern.",
    actionKind: "done",
    codeLines: [13],
    explanationBeginner:
      "The pattern fits all the way through, so the answer is true.",
    explanationExpert:
      "The final maps encode a total bijection from pattern symbols to sentence words.",
    done: true,
  });

  return trace;
}
