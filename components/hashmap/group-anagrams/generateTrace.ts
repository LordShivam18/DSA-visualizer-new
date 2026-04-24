import { parseWordArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  HashmapTraceState,
  HashmapTraceStep,
  VisualGroup,
} from "../shared/types";

export type GroupAnagramsTraceStep = HashmapTraceStep;

function signatureOf(word: string) {
  return word.split("").sort().join("");
}

function sortedGroups(groups: Map<string, string[]>) {
  return [...groups.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function groupCards(groups: Map<string, string[]>, active: string | null): VisualGroup[] {
  return sortedGroups(groups).map(([signature, words]) => ({
    id: `group-${signature}`,
    title: signature || "(empty)",
    subtitle: `signature length ${signature.length}`,
    items: [...words],
    tone: active === signature ? "purple" : "green",
  }));
}

function formatResult(groups: Map<string, string[]>) {
  return JSON.stringify(sortedGroups(groups).map(([, words]) => words));
}

export function generateTrace(
  inputs: Record<string, string>
): GroupAnagramsTraceStep[] {
  const words = parseWordArray(inputs.strs ?? "");
  const groups = new Map<string, string[]>();

  let processed = 0;
  let currentSignature: string | null = null;

  const initialState: HashmapTraceState = {
    hero:
      "Sort each word into a canonical signature. Anagrams collapse onto the same signature key and therefore land in the same bucket.",
    primaryLabel: "Input Words",
    primaryItems: [],
    secondaryLabel: "Current Signature",
    secondaryItems: [],
    mapLabel: "Signature -> Bucket",
    mapEntries: [],
    groupsLabel: "Grouped Output",
    groups: [],
    stats: [],
    resultLabel: "groupAnagrams",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "Two words are anagrams exactly when their sorted signatures are identical.",
    footer:
      "The hash map key is not the original word. It is the sorted signature, which makes all anagrams collide on purpose.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    const groupList = sortedGroups(groups);
    const largestGroup = groupList.reduce(
      (best, [, bucket]) => Math.max(best, bucket.length),
      0
    );

    state.hero = currentSignature
      ? `Word "${words[pointers.primaryIndex ?? 0] ?? ""}" normalizes to signature "${currentSignature}", so it belongs in that bucket.`
      : "The next word will be normalized into a sorted signature before it is grouped.";

    state.primaryItems = words.map((word, index) => ({
      id: `word-${index}`,
      label: word,
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
          ? ["bucketed"]
          : undefined,
    }));

    state.secondaryItems = currentSignature
      ? [
          {
            id: "signature",
            label: currentSignature || "(empty)",
            sublabel: "sorted key",
            tone: "yellow",
            tags: ["signature"],
          },
        ]
      : [];

    state.mapEntries = groupList.map(([signature, bucket]) => ({
      id: `signature-${signature}`,
      key: signature || "(empty)",
      value: `${bucket.length} word${bucket.length === 1 ? "" : "s"}`,
      note: bucket.join(", "),
      tone: currentSignature === signature ? "yellow" : "purple",
    }));

    state.groups = groupCards(groups, currentSignature);
    state.stats = [
      { label: "Processed", value: `${processed}/${words.length}`, tone: "cyan" },
      { label: "Groups", value: `${groups.size}`, tone: "purple" },
      { label: "Largest Bucket", value: `${largestGroup}`, tone: "green" },
      {
        label: "Result",
        value: processed === words.length ? "ready" : "building",
        tone: processed === words.length ? "green" : "yellow",
      },
    ];

    state.resultValue = processed === words.length ? formatResult(groups) : "building";
    state.resultTone = processed === words.length ? "green" : "cyan";
    state.summary =
      processed === words.length
        ? "Every word is now grouped under its sorted signature."
        : "The current word is about to join the bucket matching its sorted signature.";
  }

  syncState();

  pushStep({
    action:
      "Parse the list of words and prepare a hash map whose keys will be sorted-character signatures.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "We are not grouping by the original word. We are grouping by a normalized version that looks the same for all anagrams.",
    explanationExpert:
      "The sorted signature is a canonical representative of an anagram class, which makes hashing the equivalence classes straightforward.",
    done: false,
  });

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    currentSignature = signatureOf(word);
    pointers.primaryIndex = index;
    pointers.secondaryIndex = currentSignature ? 0 : null;
    pointers.focusKey = currentSignature;
    pointers.focusValue = word;
    pointers.activeEntryId = `signature-${currentSignature}`;
    pointers.activeGroupId = `group-${currentSignature}`;
    syncState();

    pushStep({
      action: `Inspect word "${word}" and sort its characters to produce signature "${currentSignature}".`,
      actionKind: "build-signature",
      codeLines: [3, 4, 5],
      explanationBeginner:
        "Sorting gives every anagram the same fingerprint, no matter how its letters were originally ordered.",
      explanationExpert:
        "Canonicalization collapses each equivalence class of anagrams into a single deterministic hash key.",
      done: false,
    });

    const bucket = groups.get(currentSignature) ?? [];
    bucket.push(word);
    groups.set(currentSignature, bucket);
    processed = index + 1;
    syncState();

    pushStep({
      action: `Append "${word}" to bucket "${currentSignature}", which now contains ${bucket.length} word${
        bucket.length === 1 ? "" : "s"
      }.`,
      actionKind: "append-group",
      codeLines: [6],
      explanationBeginner:
        "Words with the same signature collect in the same group.",
      explanationExpert:
        "The hash map aggregates words by canonical key, so insertion cost is O(1) average after the key is built.",
      done: false,
    });
  }

  currentSignature = null;
  pointers.primaryIndex = null;
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  syncState();

  pushStep({
    action:
      "All words are processed, so the grouped buckets themselves become the final answer.",
    actionKind: "done",
    codeLines: [8, 9, 10],
    explanationBeginner:
      "The groups already live inside the hash map, so the answer is just the collection of those buckets.",
    explanationExpert:
      "Each signature key represents one equivalence class, and the final output is the set of accumulated bucket vectors.",
    done: true,
  });

  return trace;
}
