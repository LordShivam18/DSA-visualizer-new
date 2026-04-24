import { normalizeString, parseWordArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  SlidingWindowState,
  SlidingWindowTraceStep,
  WindowGroup,
} from "../shared/types";

export type SubstringWithConcatenationOfAllWordsTraceStep =
  SlidingWindowTraceStep;

type Chunk = {
  word: string;
  start: number;
};

function buildChunks(s: string, wordLength: number, offset: number) {
  const chunks: Chunk[] = [];

  for (let index = offset; index + wordLength <= s.length; index += wordLength) {
    chunks.push({
      word: s.slice(index, index + wordLength),
      start: index,
    });
  }

  return chunks;
}

function sortedWordCounts(map: Map<string, number>) {
  return [...map.entries()].sort((left, right) => left[0].localeCompare(right[0]));
}

function buildGroups(
  chunks: Chunk[],
  leftChunk: number | null,
  rightChunk: number | null,
  answers: number[]
): WindowGroup[] {
  const current =
    leftChunk !== null && rightChunk !== null && rightChunk >= leftChunk
      ? chunks.slice(leftChunk, rightChunk + 1).map((chunk) => chunk.word)
      : [];

  return [
    {
      id: "group-current",
      title: "Current Word Window",
      subtitle: "aligned chunk window for the active offset",
      items: current,
      tone: "cyan",
    },
    {
      id: "group-answers",
      title: "Found Start Indices",
      subtitle: "valid concatenation starts discovered so far",
      items: answers.map((value) => String(value)),
      tone: "yellow",
    },
  ];
}

export function generateTrace(
  inputs: Record<string, string>
): SubstringWithConcatenationOfAllWordsTraceStep[] {
  const s = normalizeString(inputs.s ?? "");
  const words = parseWordArray(inputs.words ?? "");
  const need = new Map<string, number>();
  const answers: number[] = [];

  const wordLength = words[0]?.length ?? 0;
  const totalWords = words.length;
  const totalLength = wordLength * totalWords;

  let latestHitOffset: number | null = null;
  let latestHitStartChunk: number | null = null;
  let latestHitEndChunk: number | null = null;
  let currentOffset = 0;
  let left = 0;
  let matchedCount = 0;
  let currentChunks: Chunk[] = [];
  let currentWindow = new Map<string, number>();

  const initialState: SlidingWindowState = {
    hero:
      "This hard variant runs a separate sliding window for every offset modulo wordLength, because the window must stay aligned to fixed-size chunks.",
    primaryLabel: "Offset Chunk Rail",
    primaryItems: [],
    primarySpan: {
      start: null,
      end: null,
      tone: "emerald",
      label: "Live chunk window",
    },
    bestSpan: {
      start: null,
      end: null,
      tone: "yellow",
      label: "Latest hit",
    },
    secondaryLabel: "Target Words",
    secondaryItems: [],
    ledgerLabel: "Need vs Have Word Ledger",
    ledgerEntries: [],
    groupsLabel: "Chunk Window Story",
    groups: [],
    stats: [],
    resultLabel: "start indices",
    resultValue: "building",
    resultTone: "emerald",
    summary:
      "Every offset keeps its own aligned chunk window, word-frequency ledger, and overflow cleanup loop.",
    footer:
      "The alignment is the key teaching point: valid concatenations can only begin at positions that preserve word boundaries for that offset scan.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function chunkIndex(position: number) {
    if (position < currentOffset) {
      return null;
    }

    return Math.floor((position - currentOffset) / wordLength);
  }

  function syncState(rightChunk: number | null) {
    const leftChunk =
      rightChunk !== null && left <= currentChunks[rightChunk]?.start
        ? chunkIndex(left)
        : rightChunk !== null && left <= currentChunks[rightChunk]?.start + wordLength
        ? chunkIndex(left)
        : rightChunk === null
        ? null
        : chunkIndex(left) !== null && (chunkIndex(left) as number) <= rightChunk
        ? chunkIndex(left)
        : null;

    const activeSpan =
      leftChunk !== null &&
      rightChunk !== null &&
      rightChunk >= leftChunk &&
      currentChunks.length > 0
        ? {
            start: leftChunk,
            end: rightChunk,
            tone: "emerald" as const,
            label: `${matchedCount}/${totalWords} words`,
          }
        : {
            start: null,
            end: null,
            tone: "emerald" as const,
            label: "Live chunk window",
          };

    state.hero =
      currentChunks.length === 0
        ? "This offset does not have any complete chunks to scan."
        : rightChunk !== null &&
          leftChunk !== null &&
          rightChunk >= leftChunk
        ? `Offset ${currentOffset} is scanning chunk window [${currentChunks
            .slice(leftChunk, rightChunk + 1)
            .map((chunk) => chunk.word)
            .join(", ")}].`
        : `Offset ${currentOffset} is ready to scan the next aligned chunk.`;

    state.primaryLabel = `Offset ${currentOffset} chunk stream`;
    state.primaryItems = currentChunks.map((chunk, index) => {
      const inLatestHit =
        latestHitOffset === currentOffset &&
        latestHitStartChunk !== null &&
        latestHitEndChunk !== null &&
        index >= latestHitStartChunk &&
        index <= latestHitEndChunk;
      const inActive =
        activeSpan.start !== null &&
        activeSpan.end !== null &&
        index >= activeSpan.start &&
        index <= activeSpan.end;

      return {
        id: `chunk-${currentOffset}-${chunk.start}`,
        label: chunk.word,
        sublabel: `@${chunk.start}`,
        tone:
          index === pointers.right
            ? "emerald"
            : index === pointers.left
            ? "cyan"
            : inLatestHit
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
            : inLatestHit
            ? ["hit"]
            : inActive
            ? ["live"]
            : undefined,
      };
    });

    state.primarySpan = activeSpan;
    state.bestSpan =
      latestHitOffset === currentOffset &&
      latestHitStartChunk !== null &&
      latestHitEndChunk !== null
        ? {
            start: latestHitStartChunk,
            end: latestHitEndChunk,
            tone: "yellow",
            label: "latest hit",
          }
        : {
            start: null,
            end: null,
            tone: "yellow",
            label: "Latest hit",
          };

    state.secondaryItems = words.map((word, index) => ({
      id: `need-word-${index}-${word}`,
      label: word,
      sublabel: "need",
      tone: word === pointers.focusKey ? "yellow" : "purple",
      tags: ["req"],
    }));

    state.ledgerEntries = sortedWordCounts(need).map(([word, needCount]) => {
      const haveCount = currentWindow.get(word) ?? 0;
      return {
        id: `need-${word}`,
        key: word,
        need: `${needCount}`,
        have: `${haveCount}`,
        delta:
          haveCount === needCount
            ? "met"
            : haveCount > needCount
            ? `+${haveCount - needCount}`
            : `-${needCount - haveCount}`,
        note:
          haveCount === needCount
            ? "aligned frequency is exact"
            : haveCount > needCount
            ? "too many copies, so the left edge must discard words"
            : "still missing copies",
        tone:
          word === pointers.focusKey && haveCount > needCount
            ? "rose"
            : word === pointers.focusKey
            ? "yellow"
            : haveCount === needCount
            ? "emerald"
            : "purple",
      };
    });

    state.groups = buildGroups(currentChunks, leftChunk, rightChunk, answers);
    state.stats = [
      { label: "Offset", value: `${currentOffset}`, tone: "cyan" },
      { label: "Word Length", value: `${wordLength}`, tone: "purple" },
      { label: "Window Words", value: `${matchedCount}`, tone: "emerald" },
      { label: "Answers", value: `${answers.length}`, tone: "yellow" },
    ];

    state.resultValue = answers.length > 0 ? `[${answers.join(", ")}]` : "building";
    state.resultTone = answers.length > 0 ? "yellow" : "emerald";
    state.summary =
      answers.length > 0
        ? `Valid concatenation starts found so far: [${answers.join(", ")}].`
        : "No valid concatenation has been found yet.";
  }

  syncState(null);

  pushStep({
    action:
      "Parse s and words, then prepare the target frequency ledger that each offset-aligned window must satisfy.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "This problem is harder because the window moves in word-sized jumps instead of single characters.",
    explanationExpert:
      "The scan decomposes into wordLength independent offset streams, each processed with its own sliding word window.",
    done: false,
  });

  if (words.length === 0 || wordLength === 0) {
    state.resultValue = "[]";
    state.resultTone = "yellow";
    state.summary = "An empty word list produces no starting indices in this visualizer.";

    pushStep({
      action: "The word list is empty, so there is no concatenation target to search for.",
      actionKind: "done",
      codeLines: [20],
      explanationBeginner:
        "Without target words, there is nothing meaningful to match.",
      explanationExpert:
        "The concatenation multiset is empty, so this implementation returns an empty answer list.",
      done: true,
    });

    return trace;
  }

  const inconsistent = words.some((word) => word.length !== wordLength);
  if (inconsistent) {
    state.resultValue = "[]";
    state.resultTone = "rose";
    state.summary = "All words must have the same length for chunk alignment to work.";

    pushStep({
      action:
        "The input words do not share the same length, so the fixed-size chunk strategy cannot be applied.",
      actionKind: "done",
      codeLines: [20],
      explanationBeginner:
        "This sliding-window method only works when every word has the same size.",
      explanationExpert:
        "Offset partitioning depends on uniform chunk length; heterogeneous word sizes break the alignment invariant.",
      done: true,
    });

    return trace;
  }

  for (const word of words) {
    need.set(word, (need.get(word) ?? 0) + 1);
    pointers.focusKey = word;
    pointers.focusValue = `${need.get(word)}`;
    pointers.activeEntryId = `need-${word}`;
    syncState(null);

    pushStep({
      action: `Record target word "${word}", increasing its required count to ${need.get(
        word
      )}.`,
      actionKind: "build-need",
      codeLines: [2],
      explanationBeginner:
        "Repeated words increase the count for that same target word instead of creating a brand-new requirement.",
      explanationExpert:
        "The need ledger stores multiplicities for the target multiset of words.",
      done: false,
    });
  }

  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState(null);

  if (totalLength > s.length) {
    state.resultValue = "[]";
    state.resultTone = "rose";
    state.summary = "The concatenated target is longer than s, so no starting index can work.";

    pushStep({
      action:
        "The total concatenation length is longer than s, so no valid starting index exists.",
      actionKind: "done",
      codeLines: [20],
      explanationBeginner:
        "If the target is longer than the whole source string, it cannot fit anywhere.",
      explanationExpert:
        "The search space is empty because every feasible window would exceed the source length.",
      done: true,
    });

    return trace;
  }

  for (let offset = 0; offset < wordLength; offset += 1) {
    currentOffset = offset;
    currentChunks = buildChunks(s, wordLength, offset);
    currentWindow = new Map<string, number>();
    left = offset;
    matchedCount = 0;
    latestHitStartChunk = null;
    latestHitEndChunk = null;
    pointers.offset = offset;
    pointers.left = null;
    pointers.right = null;
    syncState(null);

    pushStep({
      action: `Start offset lane ${offset}. This lane reads s in chunks of length ${wordLength} beginning at index ${offset}.`,
      actionKind: "start-offset",
      codeLines: [3, 4, 5, 6],
      explanationBeginner:
        "Different offsets create different chunk alignments, so each alignment gets its own scan.",
      explanationExpert:
        "The algorithm partitions the search into wordLength residue classes modulo the chunk size.",
      done: false,
    });

    for (let right = offset; right + wordLength <= s.length; right += wordLength) {
      const word = s.slice(right, right + wordLength);
      const rightChunk = Math.floor((right - offset) / wordLength);
      pointers.left = chunkIndex(left);
      pointers.right = rightChunk;
      pointers.focusKey = word;
      pointers.focusValue = `start ${right}`;
      pointers.activeEntryId = need.has(word) ? `need-${word}` : null;
      syncState(rightChunk);

      pushStep({
        action: `Inspect chunk "${word}" starting at index ${right} on offset lane ${offset}.`,
        actionKind: "inspect-chunk",
        codeLines: [7, 8],
        explanationBeginner:
          "The window can only move in whole-word jumps on this lane.",
        explanationExpert:
          "Each iteration reads one aligned token of width wordLength from the current residue class.",
        done: false,
      });

      if (!need.has(word)) {
        currentWindow.clear();
        matchedCount = 0;
        left = right + wordLength;
        pointers.left = chunkIndex(left);
        pointers.right = rightChunk;
        pointers.focusValue = "reset";
        syncState(rightChunk);

        pushStep({
          action: `Chunk "${word}" is not in the target multiset, so the aligned window resets immediately after it.`,
          actionKind: "reset-window",
          codeLines: [9, 10, 11, 12],
          explanationBeginner:
            "A forbidden word breaks the whole current attempt, so the window starts over after that chunk.",
          explanationExpert:
            "Encountering a non-target token invalidates every window crossing it, so the lane state can be cleared in O(1) map operations.",
          done: false,
        });

        continue;
      }

      currentWindow.set(word, (currentWindow.get(word) ?? 0) + 1);
      matchedCount += 1;
      pointers.left = chunkIndex(left);
      pointers.right = rightChunk;
      syncState(rightChunk);

      pushStep({
        action: `Accept "${word}" into the aligned window. Its count becomes ${currentWindow.get(
          word
        )}, and the window now holds ${matchedCount} words.`,
        actionKind: "accept-word",
        codeLines: [13, 14],
        explanationBeginner:
          "A target word can join the live window, but it may still overflow if it appears too many times.",
        explanationExpert:
          "The window map tracks multiplicities for the current offset-aligned token window.",
        done: false,
      });

      while ((currentWindow.get(word) ?? 0) > (need.get(word) ?? 0)) {
        const leftWord = s.slice(left, left + wordLength);
        currentWindow.set(leftWord, (currentWindow.get(leftWord) ?? 0) - 1);
        matchedCount -= 1;
        left += wordLength;
        pointers.left = chunkIndex(left);
        pointers.right = rightChunk;
        pointers.focusKey = leftWord;
        pointers.focusValue = `drop -> ${currentWindow.get(leftWord) ?? 0}`;
        pointers.activeEntryId = `need-${word}`;
        syncState(rightChunk);

        pushStep({
          action: `The word "${word}" overflowed its allowed count, so drop "${leftWord}" from the left and advance the aligned left boundary.`,
          actionKind: "shrink-overflow",
          codeLines: [15, 16, 17, 18],
          explanationBeginner:
            "Too many copies of one word means the window must eject words from the left until the counts fit again.",
          explanationExpert:
            "Overflow cleanup restores the invariant window[word] <= need[word] for the just-added token.",
          done: false,
        });
      }

      if (matchedCount === totalWords) {
        answers.push(left);
        latestHitOffset = offset;
        latestHitStartChunk = chunkIndex(left);
        latestHitEndChunk = rightChunk;
        pointers.activeGroupId = "group-answers";
        syncState(rightChunk);

        pushStep({
          action: `Matched exactly ${totalWords} aligned words, so index ${left} is a valid concatenation start.`,
          actionKind: "record-answer",
          codeLines: [19],
          explanationBeginner:
            "The current aligned window now contains every target word with the correct counts, so its left edge is an answer.",
          explanationExpert:
            "Count equality across the full target multiset certifies a valid permutation window.",
          done: false,
        });

        const leftWord = s.slice(left, left + wordLength);
        currentWindow.set(leftWord, (currentWindow.get(leftWord) ?? 0) - 1);
        matchedCount -= 1;
        left += wordLength;
        pointers.left = chunkIndex(left);
        pointers.right = rightChunk;
        pointers.focusKey = leftWord;
        pointers.focusValue = `advance after hit`;
        syncState(rightChunk);

        pushStep({
          action: `Slide the aligned window forward by one word after recording the answer so overlapping matches can still be found.`,
          actionKind: "advance-after-hit",
          codeLines: [19],
          explanationBeginner:
            "The algorithm keeps searching immediately after a hit because valid answers can overlap.",
          explanationExpert:
            "Post-hit contraction preserves O(n) per offset while enabling overlapping concatenation matches.",
          done: false,
        });
      }
    }
  }

  pointers.left = null;
  pointers.right = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  syncState(null);
  state.resultValue = `[${answers.join(", ")}]`;
  state.resultTone = answers.length > 0 ? "yellow" : "rose";
  state.summary =
    answers.length > 0
      ? `All valid concatenation starts: [${answers.join(", ")}].`
      : "No offset lane ever produced a full target multiset match.";

  pushStep({
    action:
      answers.length > 0
        ? `All offset scans are complete. Valid concatenation starts are [${answers.join(", ")}].`
        : "All offset scans are complete, and no valid concatenation window exists for this input.",
    actionKind: "done",
    codeLines: [20],
    explanationBeginner:
      answers.length > 0
        ? "Every answer comes from some aligned chunk lane that matched all target words exactly once."
        : "No aligned word window ever matched the full target list.",
    explanationExpert:
      answers.length > 0
        ? "Collecting answers across all residue classes covers every legal start index without redundant character-by-character scans."
        : "Every offset-maintained window failed the multiset equality test, so the answer set is empty.",
    done: true,
  });

  return trace;
}
