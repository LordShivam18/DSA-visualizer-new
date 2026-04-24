export type ArrayStringProblemMeta = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  taxonomy: string;
};

export const arrayStringProblems: ArrayStringProblemMeta[] = [
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    description:
      "Compare each Roman glyph to its lookahead value so subtractive pairs and additive symbols become visually obvious.",
    taxonomy: "String scan / lookahead comparison / subtractive notation",
  },
  {
    slug: "integer-to-roman",
    title: "Integer to Roman",
    difficulty: "Medium",
    description:
      "Greedily peel off the largest Roman denomination, watch the remainder shrink, and build the numeral fragment by fragment.",
    taxonomy: "Greedy decomposition / denomination board / numeral synthesis",
  },
  {
    slug: "length-of-last-word",
    title: "Length of Last Word",
    difficulty: "Easy",
    description:
      "Sweep from the end, skip trailing spaces, and count only the final uninterrupted word segment.",
    taxonomy: "Reverse scan / whitespace trim / tail segment length",
  },
  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    description:
      "Scan one character column at a time and stop the instant any word disagrees or runs out.",
    taxonomy: "Column comparison / string array / early stopping",
  },
  {
    slug: "reverse-words-in-a-string",
    title: "Reverse Words in a String",
    difficulty: "Medium",
    description:
      "Normalize the sentence into clean words, then rebuild the output from the last word back to the first.",
    taxonomy: "Token extraction / reverse assembly / whitespace normalization",
  },
  {
    slug: "zigzag-conversion",
    title: "Zigzag Conversion",
    difficulty: "Medium",
    description:
      "Drop characters through a bouncing row cursor, then read the zigzag rows back in order.",
    taxonomy: "Simulation / row routing / zigzag matrix",
  },
  {
    slug: "find-the-index-of-the-first-occurrence-in-a-string",
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    description:
      "Slide the needle across the haystack, compare character-by-character, and stop on the first full match.",
    taxonomy: "Substring scan / sliding alignment / first match",
  },
  {
    slug: "text-justification",
    title: "Text Justification",
    difficulty: "Hard",
    description:
      "Greedily pack each line, distribute spaces across the gaps, and left-justify the final line with visible width accounting.",
    taxonomy: "Greedy line packing / gap distribution / formatting rules",
  },
  {
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description:
      "Watch three pointers fill nums1 from the back so every write lands in the correct sorted position.",
    taxonomy: "Two arrays / backward merge / in-place write pointer",
  },
  {
    slug: "remove-element",
    title: "Remove Element",
    difficulty: "Easy",
    description:
      "Use a read pointer to inspect every value and a write pointer to compact the kept values into the front.",
    taxonomy: "Array compaction / read-write pointers / in-place filter",
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    description:
      "Keep a unique prefix and copy only values that differ from the last committed number.",
    taxonomy: "Sorted array / slow-fast pointers / unique prefix",
  },
  {
    slug: "remove-duplicates-from-sorted-array-ii",
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    description:
      "Extend the same prefix idea, but allow each value to survive at most twice.",
    taxonomy: "Sorted array / bounded duplicates / prefix control",
  },
  {
    slug: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    description:
      "See Boyer-Moore vote cancellation reveal the value that survives more than half the array.",
    taxonomy: "Voting algorithm / invariant tracking / linear scan",
  },
  {
    slug: "rotate-array",
    title: "Rotate Array",
    difficulty: "Medium",
    description:
      "Animate the reverse-all, reverse-prefix, and reverse-suffix trick that rotates in-place with O(1) extra space.",
    taxonomy: "Array reversal / in-place rotation / swap trace",
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description:
      "Track the cheapest buy day so far and the best profit each future day can unlock.",
    taxonomy: "Greedy scan / minimum so far / profit maximization",
  },
  {
    slug: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    description:
      "Accumulate every upward price slope and see why each positive day-to-day gain belongs in the answer.",
    taxonomy: "Greedy accumulation / rising segments / local gains",
  },
  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    description:
      "Grow the farthest reachable index and spot exactly when the scan stays alive or gets stranded.",
    taxonomy: "Greedy reachability / farthest frontier / linear proof",
  },
  {
    slug: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "Medium",
    description:
      "Treat each jump as a range expansion and commit a new jump only when the current layer is exhausted.",
    taxonomy: "Greedy BFS layer / window end / minimum jumps",
  },
  {
    slug: "h-index",
    title: "H-Index",
    difficulty: "Medium",
    description:
      "Sort the citations, then test candidate h-values until the citation threshold finally breaks.",
    taxonomy: "Sorting / threshold scan / monotonic stopping point",
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description:
      "Build the answer in two sweeps by storing left products first and then folding right products back in.",
    taxonomy: "Prefix and suffix products / two passes / no division",
  },
  {
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    description:
      "Track total net gas and reset the start candidate whenever the running tank goes negative.",
    taxonomy: "Greedy proof / running tank / unique feasible start",
  },
  {
    slug: "candy",
    title: "Candy",
    difficulty: "Hard",
    description:
      "Distribute the minimum candies with one left-to-right pass and one right-to-left correction pass.",
    taxonomy: "Greedy constraints / two passes / local rating rules",
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Use two inward-moving pointers and boundary maxima to count trapped water one bar at a time.",
    taxonomy: "Two pointers / boundary maxima / water accumulation",
  },
  {
    slug: "insert-delete-getrandom-o1",
    title: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    description:
      "Visualize how the array and hashmap stay in sync during insert, remove-with-swap, and deterministic demo random picks.",
    taxonomy: "Hashmap + dynamic array / swap-delete / average O(1)",
  },
];
