import {
  categoryRegistryById,
  problemRegistry,
  type Problem,
} from "./problemRegistry";

export type PatternRecognitionInsight = {
  label: string;
  summary: string;
  whyItFits: string;
  whenToUse: string[];
  watchFor: string[];
  similarProblems: Problem[];
};

type PatternProfile = {
  id: string;
  label: string;
  matches: RegExp[];
  whyItWins: string;
  whenToUse: string[];
  watchFor: string[];
};

const fallbackProfile: PatternProfile = {
  id: "trace",
  label: "Invariant-driven trace",
  matches: [],
  whyItWins:
    "locking each state transition to a local invariant instead of guessing across the whole input at once",
  whenToUse: [
    "Each step updates a small piece of state while preserving a rule.",
    "You can explain the algorithm as a sequence of local transitions.",
    "A visual trace helps more than a one-shot formula.",
  ],
  watchFor: [
    "Do not skip the state variable that proves the next move is safe.",
    "If a step feels magical, restate the invariant before moving on.",
    "Use a smaller replay case whenever the transition chain feels blurry.",
  ],
};

const patternProfiles: PatternProfile[] = [
  {
    id: "backtracking",
    label: "Backtracking DFS",
    matches: [/backtracking/i, /\bundo\b/i, /\bchoice\b/i, /\bgrid dfs\b/i],
    whyItWins:
      "exploring one candidate path at a time, rejecting dead branches early, and undoing the path state cleanly before trying the next option",
    whenToUse: [
      "You must try many candidate constructions but only some satisfy the constraints.",
      "The state can be built incrementally and undone after each branch.",
      "You need all valid answers or a proof that no branch works.",
    ],
    watchFor: [
      "Mark and unmark path state symmetrically.",
      "Reject invalid branches before recursing deeper.",
      "Separate move generation from the condition that makes a move legal.",
    ],
  },
  {
    id: "sliding-window",
    label: "Sliding window",
    matches: [/sliding window/i, /\bwindow\b/i, /\bcoverage\b/i],
    whyItWins:
      "maintaining a live contiguous range whose statistics can be updated in constant time as the edges move",
    whenToUse: [
      "The answer lives inside a contiguous subarray or substring.",
      "A constraint becomes true or false as the left and right edges move.",
      "You can update counts, sums, or duplicates incrementally.",
    ],
    watchFor: [
      "Only shrink after the window is already valid or overfull.",
      "Track exactly which condition makes the window legal again.",
      "Do not recompute the whole window after each move.",
    ],
  },
  {
    id: "two-pointers",
    label: "Two pointers",
    matches: [/two pointers/i, /\binward\b/i, /\bmirror\b/i],
    whyItWins:
      "using structure in the input to discard one side safely after each comparison",
    whenToUse: [
      "You can reason from both ends or from two moving indices.",
      "The input is sorted or the constraint depends on relative pointer movement.",
      "One local comparison tells you which pointer is safe to move next.",
    ],
    watchFor: [
      "Move the pointer that limits progress, not the one that merely looks worse.",
      "Keep the invariant explicit before advancing either side.",
      "Do not lose track of whether the indices are inclusive or exclusive.",
    ],
  },
  {
    id: "greedy",
    label: "Greedy invariant",
    matches: [/greedy/i, /\bprofit\b/i, /\bfrontier\b/i, /\bvoting invariant\b/i],
    whyItWins:
      "making the locally safe move immediately because the invariant proves waiting would not improve the final answer",
    whenToUse: [
      "A local improvement can be committed without harming the global optimum.",
      "The proof revolves around an invariant, frontier, or exchange argument.",
      "The state is small and monotonic as you scan the input once.",
    ],
    watchFor: [
      "Do not postpone a gain the invariant already justifies.",
      "Separate a harmless local choice from a choice that closes future options.",
      "Pressure-test the rule on flat, descending, and boundary-heavy cases.",
    ],
  },
  {
    id: "simulation",
    label: "Simulation",
    matches: [/simulation/i, /\broute\b/i, /\bformatting\b/i, /\bcellular automaton\b/i],
    whyItWins:
      "faithfully replaying the process exactly as the problem defines it until the final state emerges",
    whenToUse: [
      "The problem statement describes a deterministic process step by step.",
      "A direct state machine is simpler than deriving a closed-form shortcut.",
      "Correctness depends on preserving the order of updates.",
    ],
    watchFor: [
      "Keep the state representation simpler than the visual story you show.",
      "Guard edge cases before the main simulation loop begins.",
      "Separate the write phase from the readout phase when both exist.",
    ],
  },
  {
    id: "hashmap",
    label: "Hash map lookup",
    matches: [/hashmap/i, /\bfrequency\b/i, /\bset expansion\b/i, /\bcomplement\b/i],
    whyItWins:
      "turning repeated searches into constant-time membership or frequency checks",
    whenToUse: [
      "You need fast lookup by value, frequency, or signature.",
      "The order of values matters less than whether you have seen them.",
      "A complement, duplicate, or mapping check appears repeatedly.",
    ],
    watchFor: [
      "Be precise about whether the map stores counts, latest indices, or ownership.",
      "Update the ledger after the check if the current item should not match itself.",
      "Watch for collisions between one-way and two-way constraints.",
    ],
  },
  {
    id: "binary-search",
    label: "Binary search on structure",
    matches: [/binary search/i, /\bpartition\b/i, /\blower bound\b/i, /\bmonotonic\b/i],
    whyItWins:
      "using a monotonic boundary or sorted half test so each comparison discards half the search space",
    whenToUse: [
      "The input or answer space has a monotonic property.",
      "One comparison reveals which half can be discarded safely.",
      "You care about a boundary, insertion point, or partition location.",
    ],
    watchFor: [
      "Decide whether the midpoint belongs to the left or right survivor set.",
      "Write the loop invariant before writing the mid update.",
      "Boundary bugs usually come from mixing closed and half-open intervals.",
    ],
  },
  {
    id: "dp",
    label: "Dynamic programming",
    matches: [/dp/i, /dynamic programming/i, /\brecurrence\b/i, /\bpath sum\b/i],
    whyItWins:
      "reusing solved subproblems so each larger state becomes a small recurrence instead of a full recomputation",
    whenToUse: [
      "The answer can be built from smaller overlapping subproblems.",
      "There is a clear state definition and transition rule.",
      "A brute-force search repeats the same suffix, prefix, or cell states.",
    ],
    watchFor: [
      "Write the state meaning in words before filling the table.",
      "Base cases are part of the recurrence, not setup clutter.",
      "Check whether the transition depends on previous row, previous column, or previous prefix.",
    ],
  },
  {
    id: "tree-graph",
    label: "Traversal and frontier management",
    matches: [/graph/i, /\btree\b/i, /\bbfs\b/i, /\bdfs\b/i, /\bfrontier\b/i],
    whyItWins:
      "maintaining a disciplined frontier so every reachable state is explored exactly when the invariant expects it",
    whenToUse: [
      "The problem is naturally a tree, graph, grid, or dependency graph.",
      "Reachability, layering, or subtree structure drives the answer.",
      "Visited state or traversal order changes correctness.",
    ],
    watchFor: [
      "Decide whether discovery time or pop time should mark a node visited.",
      "Keep the frontier representation consistent with the traversal style.",
      "Match the traversal order to the property you are measuring.",
    ],
  },
];

const difficultyWeight = {
  easy: 1,
  medium: 2,
  hard: 3,
} as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function registryText(problem: Problem) {
  return `${problem.category} ${problem.taxonomy} ${problem.tags.join(" ")}`.toLowerCase();
}

function resolvePatternProfile(problem: Problem) {
  const text = registryText(problem);

  return (
    patternProfiles.find((profile) =>
      profile.matches.some((pattern) => pattern.test(text))
    ) ?? fallbackProfile
  );
}

function sharedTagScore(left: Problem, right: Problem) {
  const rightTags = new Set(right.tags.map(normalize));

  return left.tags.filter((tag) => rightTags.has(normalize(tag))).length;
}

function similarProblemScore(current: Problem, candidate: Problem) {
  const sharedTags = sharedTagScore(current, candidate);
  const sameCategory = current.category === candidate.category ? 3 : 0;
  const difficultyGap =
    Math.abs(
      difficultyWeight[current.difficulty] - difficultyWeight[candidate.difficulty]
    ) * -1;

  return sharedTags * 4 + sameCategory + difficultyGap;
}

export function buildPatternRecognition(problem: Problem): PatternRecognitionInsight {
  const profile = resolvePatternProfile(problem);
  const categoryLabel =
    categoryRegistryById[problem.category]?.label ?? problem.category;
  const similarProblems = problemRegistry
    .filter((candidate) => candidate.id !== problem.id)
    .sort((left, right) => {
      const leftScore = similarProblemScore(problem, left);
      const rightScore = similarProblemScore(problem, right);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, 3);

  return {
    label: profile.label,
    summary: `${problem.title} sits in the ${categoryLabel} track and trains ${profile.label.toLowerCase()} thinking through ${problem.taxonomy.toLowerCase()}.`,
    whyItFits: `The registry tags this lesson as ${problem.taxonomy}, so the winning move comes from ${profile.whyItWins}.`,
    whenToUse: profile.whenToUse,
    watchFor: profile.watchFor,
    similarProblems,
  };
}
