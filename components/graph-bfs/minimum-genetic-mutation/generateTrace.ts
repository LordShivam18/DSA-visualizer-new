export type GeneQueueEntry = {
  gene: string;
  mutations: number;
};

export type DepthEntry = {
  gene: string;
  depth: number;
};

export type DifferenceInfo = {
  count: number;
  indices: number[];
};

export type MinimumGeneticMutationState = {
  startGene: string;
  endGene: string;
  bank: string[];
  queue: GeneQueueEntry[];
  visited: string[];
  processed: string[];
  depths: DepthEntry[];
  path: string[];
  result: number | null;
};

export type MinimumGeneticMutationPointers = {
  currentGene: string | null;
  candidateGene: string | null;
  queueFront: string | null;
  mutationIndex: number | null;
  differenceInfo: DifferenceInfo | null;
};

export type MinimumGeneticMutationActionKind =
  | "parsed"
  | "missing-target"
  | "seed"
  | "dequeue"
  | "inspect"
  | "enqueue"
  | "skip"
  | "done";

export type MinimumGeneticMutationTraceStep = {
  step: number;
  action: string;
  actionKind: MinimumGeneticMutationActionKind;
  codeLines: number[];
  state: MinimumGeneticMutationState;
  pointers: MinimumGeneticMutationPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type MinimumGeneticMutationInput = {
  startGene: string;
  endGene: string;
  bank: string;
};

function normalizeGene(raw: string) {
  return raw.trim().replace(/^["'\[]+|["'\]]+$/g, "").toUpperCase();
}

export function parseBankInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [] as string[];
  }

  const deduped = new Set<string>();
  const output: string[] = [];

  function addGene(raw: string) {
    const gene = normalizeGene(raw);
    if (!gene || deduped.has(gene)) {
      return;
    }

    deduped.add(gene);
    output.push(gene);
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      parsed.forEach((value) => {
        if (typeof value === "string") {
          addGene(value);
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
    .forEach(addGene);

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

function buildPath(parent: Map<string, string | null>, endGene: string) {
  if (!parent.has(endGene)) {
    return [] as string[];
  }

  const path: string[] = [];
  let current: string | null | undefined = endGene;

  while (current !== null && current !== undefined) {
    path.push(current);
    current = parent.get(current);
  }

  return path.reverse();
}

function serializeDepths(depths: Map<string, number>) {
  return [...depths.entries()]
    .map(([gene, depth]) => ({ gene, depth }))
    .sort((left, right) => left.depth - right.depth || left.gene.localeCompare(right.gene));
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

export function generateTrace(input: MinimumGeneticMutationInput) {
  const startGene = normalizeGene(input.startGene);
  const endGene = normalizeGene(input.endGene);
  const bank = parseBankInput(input.bank);
  const queue: GeneQueueEntry[] = [];
  const visited = new Set<string>();
  const processed: string[] = [];
  const depths = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const trace: MinimumGeneticMutationTraceStep[] = [];

  let currentGene: string | null = null;
  let candidateGene: string | null = null;
  let mutationIndex: number | null = null;
  let currentDifferenceInfo: DifferenceInfo | null = null;
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
    actionKind: MinimumGeneticMutationActionKind;
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
        startGene,
        endGene,
        bank: [...bank],
        queue: queue.map((entry) => ({ ...entry })),
        visited: [...visited].sort(),
        processed: [...processed],
        depths: serializeDepths(depths),
        path: [...path],
        result,
      },
      pointers: {
        currentGene,
        candidateGene,
        queueFront: queue.length > 0 ? queue[0].gene : null,
        mutationIndex,
        differenceInfo: currentDifferenceInfo
          ? { ...currentDifferenceInfo, indices: [...currentDifferenceInfo.indices] }
          : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      startGene && endGene
        ? `Parse start gene ${startGene}, end gene ${endGene}, and ${bank.length} bank candidate${bank.length === 1 ? "" : "s"}.`
        : "Parse the gene input fields. A valid start and end gene are required.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      startGene && endGene
        ? "Each gene is a BFS node. A legal edge exists when two genes differ by exactly one character and the target is in the bank."
        : "BFS needs both a start gene and an end gene before it can search.",
    explanationExpert:
      startGene && endGene
        ? "The bank induces an implicit unweighted graph over valid gene states with Hamming-distance-1 edges."
        : "Missing endpoints make the state space ill-defined.",
  });

  if (!startGene || !endGene) {
    result = -1;

    pushStep({
      action: "The search cannot begin because the start gene or end gene is missing.",
      actionKind: "done",
      codeLines: [16],
      done: true,
      explanationBeginner:
        "Without both endpoints, there is no mutation journey to compute.",
      explanationExpert:
        "The shortest-path query has no valid source-target pair.",
    });

    return trace;
  }

  if (!bank.includes(endGene)) {
    result = -1;

    pushStep({
      action: `The end gene ${endGene} is not in the bank, so no valid BFS path can ever finish there.`,
      actionKind: "missing-target",
      codeLines: [3],
      done: true,
      explanationBeginner:
        "The finish gene must be in the bank, so the answer is immediately -1.",
      explanationExpert:
        "The end vertex is absent from the valid-state graph, which disconnects the query before traversal begins.",
    });

    return trace;
  }

  queue.push({ gene: startGene, mutations: 0 });
  visited.add(startGene);
  depths.set(startGene, 0);
  parent.set(startGene, null);
  currentGene = startGene;

  pushStep({
    action: `Seed BFS with ${startGene} at mutation depth 0.`,
    actionKind: "seed",
    codeLines: [4, 5, 6],
    done: false,
    explanationBeginner:
      "We begin at the start gene before making any mutation.",
    explanationExpert:
      "The source gene enters the queue first and defines layer 0.",
  });

  while (queue.length > 0) {
    const entry = queue.shift();
    if (!entry) {
      break;
    }

    currentGene = entry.gene;
    candidateGene = null;
    mutationIndex = null;
    currentDifferenceInfo = null;
    processed.push(entry.gene);

    pushStep({
      action: `Dequeue gene ${entry.gene} at mutation depth ${entry.mutations} and compare it against the bank.`,
      actionKind: "dequeue",
      codeLines: [7, 8],
      done: false,
      explanationBeginner:
        "Because BFS explores shallow mutation counts first, this is the next gene worth expanding.",
      explanationExpert:
        "Dequeuing processes one BFS layer state whose recorded depth is already optimal.",
    });

    if (entry.gene === endGene) {
      result = entry.mutations;
      path = buildPath(parent, endGene);

      pushStep({
        action: `Gene ${endGene} reached the queue front at depth ${result}, so BFS has found the minimum mutation count.`,
        actionKind: "done",
        codeLines: [9],
        done: true,
        explanationBeginner:
          "The first time BFS pulls the target gene, that route uses the fewest mutations possible.",
        explanationExpert:
          "BFS optimality on unweighted graphs guarantees the first dequeue of the target has minimum distance.",
      });

      return trace;
    }

    for (const candidate of bank) {
      const info = differenceInfo(entry.gene, candidate);

      currentGene = entry.gene;
      candidateGene = candidate;
      mutationIndex = info.count === 1 ? info.indices[0] : null;
      currentDifferenceInfo = info;

      pushStep({
        action: `Inspect bank gene ${candidate}. It differs from ${entry.gene} in ${info.count === Number.MAX_SAFE_INTEGER ? "an incompatible number of" : info.count} position${info.count === 1 ? "" : "s"}.`,
        actionKind: "inspect",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "Only genes that differ by exactly one character can be reached in one mutation step.",
        explanationExpert:
          "The BFS adjacency test is HammingDistance(current, candidate) == 1.",
      });

      if (visited.has(candidate) || info.count !== 1) {
        pushStep({
          action: visited.has(candidate)
            ? `Skip ${candidate} because BFS already discovered it earlier at depth ${depths.get(candidate) ?? "?"}.`
            : `Skip ${candidate} because it is not a one-character mutation away from ${entry.gene}.`,
          actionKind: "skip",
          codeLines: [11],
          done: false,
          explanationBeginner: visited.has(candidate)
            ? "A gene only needs to be explored once because BFS already found its best mutation count."
            : "Changing more than one character would not be a legal single mutation.",
          explanationExpert: visited.has(candidate)
            ? "The seen set prevents duplicate states and preserves O(B^2 * L) worst-case comparison work."
            : "Candidates outside Hamming distance 1 are not graph neighbors.",
        });
        continue;
      }

      visited.add(candidate);
      depths.set(candidate, entry.mutations + 1);
      parent.set(candidate, entry.gene);
      queue.push({ gene: candidate, mutations: entry.mutations + 1 });

      pushStep({
        action: `Enqueue ${candidate} with mutation depth ${entry.mutations + 1} because it is a valid unseen one-step mutation from ${entry.gene}.`,
        actionKind: "enqueue",
        codeLines: [12, 13],
        done: false,
        explanationBeginner:
          "This gene becomes part of the next BFS layer because it is one legal mutation away.",
        explanationExpert:
          "The first discovery of this valid neighbor fixes its shortest distance as currentDepth + 1.",
      });
    }
  }

  currentGene = null;
  candidateGene = null;
  mutationIndex = null;
  currentDifferenceInfo = null;
  result = -1;

  pushStep({
    action: "The queue emptied before the end gene was reached, so no valid mutation chain exists.",
    actionKind: "done",
    codeLines: [16],
    done: true,
    explanationBeginner:
      "BFS tried every reachable valid gene and still could not reach the target.",
    explanationExpert:
      "Exhausting the reachable component without dequeuing the target proves the shortest-path distance is undefined.",
  });

  return trace;
}
