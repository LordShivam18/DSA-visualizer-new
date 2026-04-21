export type WordQueueEntry = {
  word: string;
  depth: number;
};

export type WordDepthEntry = {
  word: string;
  depth: number;
};

export type WordNodeRecord = {
  word: string;
  kind: "begin" | "end" | "bank";
  inWordList: boolean;
};

export type WordEdgeRecord = {
  from: string;
  to: string;
};

export type DifferenceInfo = {
  count: number;
  indices: number[];
};

export type WordLadderState = {
  beginWord: string;
  endWord: string;
  wordList: string[];
  nodes: WordNodeRecord[];
  edges: WordEdgeRecord[];
  queue: WordQueueEntry[];
  visited: string[];
  processed: string[];
  depths: WordDepthEntry[];
  path: string[];
  result: number | null;
};

export type WordLadderPointers = {
  currentWord: string | null;
  candidateWord: string | null;
  queueFront: string | null;
  differenceIndex: number | null;
  differenceInfo: DifferenceInfo | null;
  edgeFocus: WordEdgeRecord | null;
};

export type WordLadderActionKind =
  | "parsed"
  | "missing-target"
  | "seed"
  | "dequeue"
  | "inspect"
  | "enqueue"
  | "skip"
  | "done";

export type WordLadderTraceStep = {
  step: number;
  action: string;
  actionKind: WordLadderActionKind;
  codeLines: number[];
  state: WordLadderState;
  pointers: WordLadderPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type WordLadderInput = {
  beginWord: string;
  endWord: string;
  wordList: string;
};

function normalizeWord(raw: string) {
  return raw.trim().replace(/^["'\[]+|["'\]]+$/g, "").toLowerCase();
}

export function parseWordListInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [] as string[];
  }

  const output: string[] = [];
  const deduped = new Set<string>();

  function addWord(raw: string) {
    const word = normalizeWord(raw);
    if (!word || deduped.has(word)) {
      return;
    }

    deduped.add(word);
    output.push(word);
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      parsed.forEach((value) => {
        if (typeof value === "string") {
          addWord(value);
        }
      });

      return output;
    }
  } catch {
    // Fall back to loose token parsing below.
  }

  trimmed
    .split(/\r?\n|,|\|/)
    .map((token) => token.replace(/[\[\]]/g, ""))
    .forEach(addWord);

  return output;
}

function differenceInfo(left: string, right: string): DifferenceInfo {
  if (left.length !== right.length) {
    return { count: Number.MAX_SAFE_INTEGER, indices: [] };
  }

  const indices: number[] = [];

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      indices.push(index);
    }
  }

  return { count: indices.length, indices };
}

function buildEdges(words: string[]) {
  const edges: WordEdgeRecord[] = [];

  for (let left = 0; left < words.length; left += 1) {
    for (let right = left + 1; right < words.length; right += 1) {
      if (differenceInfo(words[left], words[right]).count === 1) {
        edges.push({ from: words[left], to: words[right] });
      }
    }
  }

  return edges;
}

function buildNodes(beginWord: string, endWord: string, wordList: string[]) {
  const output: WordNodeRecord[] = [];
  const seen = new Set<string>();

  if (beginWord) {
    output.push({
      word: beginWord,
      kind: "begin",
      inWordList: wordList.includes(beginWord),
    });
    seen.add(beginWord);
  }

  wordList.forEach((word) => {
    if (seen.has(word)) {
      return;
    }

    output.push({
      word,
      kind: word === endWord ? "end" : "bank",
      inWordList: true,
    });
    seen.add(word);
  });

  if (endWord && !seen.has(endWord)) {
    output.push({
      word: endWord,
      kind: "end",
      inWordList: false,
    });
  }

  return output;
}

function buildPath(parent: Map<string, string | null>, endWord: string) {
  if (!parent.has(endWord)) {
    return [] as string[];
  }

  const path: string[] = [];
  let current: string | null | undefined = endWord;

  while (current !== null && current !== undefined) {
    path.push(current);
    current = parent.get(current);
  }

  return path.reverse();
}

function serializeDepths(depths: Map<string, number>) {
  return [...depths.entries()]
    .map(([word, depth]) => ({ word, depth }))
    .sort((left, right) => left.depth - right.depth || left.word.localeCompare(right.word));
}

export function formatResult(value: number | null) {
  if (value === null) {
    return "building";
  }

  return String(value);
}

export function formatPath(path: string[]) {
  if (path.length === 0) {
    return "unresolved";
  }

  return path.join(" -> ");
}

export function generateTrace(input: WordLadderInput) {
  const beginWord = normalizeWord(input.beginWord);
  const endWord = normalizeWord(input.endWord);
  const rawWordList = parseWordListInput(input.wordList);
  const wordLength = beginWord.length || endWord.length;
  const wordList = rawWordList.filter(
    (word) => wordLength === 0 || word.length === wordLength
  );
  const graphWords = beginWord ? [beginWord, ...wordList.filter((word) => word !== beginWord)] : [...wordList];
  const nodes = buildNodes(beginWord, endWord, wordList);
  const edges = buildEdges(graphWords);
  const queue: WordQueueEntry[] = [];
  const visited = new Set<string>();
  const processed: string[] = [];
  const depths = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const trace: WordLadderTraceStep[] = [];

  let currentWord: string | null = null;
  let candidateWord: string | null = null;
  let differenceIndex: number | null = null;
  let currentDifferenceInfo: DifferenceInfo | null = null;
  let edgeFocus: WordEdgeRecord | null = null;
  let result: number | null = null;
  let path: string[] = [];

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: WordLadderActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        beginWord,
        endWord,
        wordList: [...wordList],
        nodes: nodes.map((node) => ({ ...node })),
        edges: edges.map((edge) => ({ ...edge })),
        queue: queue.map((entry) => ({ ...entry })),
        visited: [...visited].sort(),
        processed: [...processed],
        depths: serializeDepths(depths),
        path: [...path],
        result,
      },
      pointers: {
        currentWord,
        candidateWord,
        queueFront: queue.length > 0 ? queue[0].word : null,
        differenceIndex,
        differenceInfo: currentDifferenceInfo
          ? { ...currentDifferenceInfo, indices: [...currentDifferenceInfo.indices] }
          : null,
        edgeFocus: edgeFocus ? { ...edgeFocus } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      beginWord && endWord
        ? `Parse begin word ${beginWord}, end word ${endWord}, and ${wordList.length} usable dictionary word${wordList.length === 1 ? "" : "s"}.`
        : "Parse the word ladder input fields. A valid begin and end word are required.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      beginWord && endWord
        ? "Every word is a BFS state. Two words are connected when they differ by exactly one letter."
        : "BFS needs both endpoints before it can search for a transformation chain.",
    explanationExpert:
      beginWord && endWord
        ? "The dictionary induces an implicit unweighted graph with Hamming-distance-1 edges."
        : "Missing endpoints leave the state graph undefined for the query.",
  });

  if (!beginWord || !endWord) {
    result = 0;

    pushStep({
      action: "The search cannot begin because the begin word or end word is missing.",
      actionKind: "done",
      codeLines: [16],
      done: true,
      explanationBeginner:
        "Without both endpoints, there is no word ladder to search for.",
      explanationExpert:
        "The source-target shortest-path query is incomplete.",
    });

    return trace;
  }

  if (!wordList.includes(endWord)) {
    result = 0;

    pushStep({
      action: `The end word ${endWord} is not in the dictionary, so no valid transformation sequence can finish there.`,
      actionKind: "missing-target",
      codeLines: [3],
      done: true,
      explanationBeginner:
        "The finish word must be in the word list, so the answer is immediately 0.",
      explanationExpert:
        "The target vertex is absent from the valid graph, so the path query fails before traversal starts.",
    });

    return trace;
  }

  queue.push({ word: beginWord, depth: 1 });
  visited.add(beginWord);
  depths.set(beginWord, 1);
  parent.set(beginWord, null);
  currentWord = beginWord;

  pushStep({
    action: `Seed BFS with ${beginWord} at ladder length 1 because the sequence counts the starting word itself.`,
    actionKind: "seed",
    codeLines: [4, 5, 6],
    done: false,
    explanationBeginner:
      "The ladder length starts at 1 because the begin word already counts as the first word in the sequence.",
    explanationExpert:
      "Depth is initialized to 1 to match the problem's definition of sequence length instead of edge count.",
  });

  while (queue.length > 0) {
    const entry = queue.shift();
    if (!entry) {
      break;
    }

    currentWord = entry.word;
    candidateWord = null;
    differenceIndex = null;
    currentDifferenceInfo = null;
    edgeFocus = null;
    processed.push(entry.word);

    pushStep({
      action: `Dequeue word ${entry.word} at ladder length ${entry.depth} and compare it with every dictionary word.`,
      actionKind: "dequeue",
      codeLines: [7, 8],
      done: false,
      explanationBeginner:
        "Because BFS explores shorter ladders first, this is the next word that could lead to the shortest answer.",
      explanationExpert:
        "Dequeuing expands one state whose shortest transformation distance is already fixed.",
    });

    if (entry.word === endWord) {
      result = entry.depth;
      path = buildPath(parent, endWord);

      pushStep({
        action: `Word ${endWord} reached the queue front at ladder length ${result}, so BFS has found a shortest transformation sequence.`,
        actionKind: "done",
        codeLines: [9],
        done: true,
        explanationBeginner:
          "The first time BFS reaches the target word, that ladder length is the answer.",
        explanationExpert:
          "BFS optimality on unweighted graphs guarantees the first dequeued target has minimum path length.",
      });

      return trace;
    }

    for (const candidate of wordList) {
      const info = differenceInfo(entry.word, candidate);

      currentWord = entry.word;
      candidateWord = candidate;
      differenceIndex = info.count === 1 ? info.indices[0] : null;
      currentDifferenceInfo = info;
      edgeFocus =
        info.count === 1
          ? { from: entry.word, to: candidate }
          : null;

      pushStep({
        action: `Inspect word ${candidate}. It differs from ${entry.word} in ${info.count === Number.MAX_SAFE_INTEGER ? "an incompatible number of" : info.count} position${info.count === 1 ? "" : "s"}.`,
        actionKind: "inspect",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "Only one-letter changes are allowed, so we count how many letters differ.",
        explanationExpert:
          "The adjacency predicate is HammingDistance(current, candidate) == 1.",
      });

      if (visited.has(candidate) || info.count !== 1) {
        pushStep({
          action: visited.has(candidate)
            ? `Skip ${candidate} because BFS already discovered it at ladder length ${depths.get(candidate) ?? "?"}.`
            : `Skip ${candidate} because it is not exactly one letter away from ${entry.word}.`,
          actionKind: "skip",
          codeLines: [11],
          done: false,
          explanationBeginner: visited.has(candidate)
            ? "A word only needs to be discovered once because BFS already found the shortest route to it."
            : "Changing more than one letter would break the rule for a single ladder step.",
          explanationExpert: visited.has(candidate)
            ? "The seen set prevents duplicate expansions and preserves BFS optimality."
            : "Words outside Hamming distance 1 are not neighbors in the implicit graph.",
        });
        continue;
      }

      visited.add(candidate);
      depths.set(candidate, entry.depth + 1);
      parent.set(candidate, entry.word);
      queue.push({ word: candidate, depth: entry.depth + 1 });

      pushStep({
        action: `Enqueue ${candidate} with ladder length ${entry.depth + 1} because it is a valid unseen neighbor of ${entry.word}.`,
        actionKind: "enqueue",
        codeLines: [12, 13],
        done: false,
        explanationBeginner:
          "This word joins the next BFS layer because we can reach it with one more legal transformation.",
        explanationExpert:
          "The first discovery of this neighbor fixes its shortest sequence length as currentDepth + 1.",
      });
    }
  }

  currentWord = null;
  candidateWord = null;
  differenceIndex = null;
  currentDifferenceInfo = null;
  edgeFocus = null;
  result = 0;

  pushStep({
    action: "The queue emptied before the end word was reached, so no valid transformation sequence exists.",
    actionKind: "done",
    codeLines: [16],
    done: true,
    explanationBeginner:
      "BFS tried every reachable dictionary word and still could not reach the target.",
    explanationExpert:
      "Exhausting the reachable component without dequeuing the target proves the shortest-path distance is undefined.",
  });

  return trace;
}
