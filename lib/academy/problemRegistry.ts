import type { AccentTone } from "./models";

export type RegistryDifficulty = "easy" | "medium" | "hard";

export type Problem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: RegistryDifficulty;
  path: string;
  description: string;
  taxonomy: string;
  tags: string[];
};

export type Category = {
  id: string;
  label: string;
  path: string;
  accent: AccentTone;
  icon: string;
  summary: string;
};

type ProblemSeed = Omit<Problem, "id" | "path" | "tags"> & {
  tags?: string[];
};

export const categoryRegistry: Category[] = [
  {
    id: "array-string",
    label: "Array / String",
    path: "/array-string",
    accent: "cyan",
    icon: "ARR",
    summary: "Greedy scans, string transforms, in-place compaction, and simulation.",
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    path: "/two-pointers",
    accent: "violet",
    icon: "2P",
    summary: "Converging indices, partition scans, and inward proof strategies.",
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    path: "/sliding-window",
    accent: "emerald",
    icon: "WIN",
    summary: "Dynamic ranges, frequency maps, and expandable constraints.",
  },
  {
    id: "matrix",
    label: "Matrix",
    path: "/matrix",
    accent: "amber",
    icon: "MAT",
    summary: "Grid simulation, rotations, in-place transforms, and boundary traversals.",
  },
  {
    id: "hashmap",
    label: "Hashmap",
    path: "/hashmap",
    accent: "blue",
    icon: "MAP",
    summary: "Frequency ledgers, complement lookup, bijections, and membership tests.",
  },
  {
    id: "stack",
    label: "Stack",
    path: "/stack",
    accent: "cyan",
    icon: "STK",
    summary: "Last-in-first-out state, delimiter matching, and controlled unwinding.",
  },
  {
    id: "linked-list",
    label: "Linked List",
    path: "/linked-list",
    accent: "violet",
    icon: "LL",
    summary: "Pointer rewiring, dummy nodes, cycle detection, and linked structures.",
  },
  {
    id: "binary-tree",
    label: "Binary Tree",
    path: "/binary-tree",
    accent: "emerald",
    icon: "TREE",
    summary: "Recursive tree structure, depth, path reasoning, and subtree rewiring.",
  },
  {
    id: "binary-tree-bfs",
    label: "Binary Tree BFS",
    path: "/binary-tree-bfs",
    accent: "blue",
    icon: "BFS",
    summary: "Level-order traversal, frontier queues, and breadth-first tree views.",
  },
  {
    id: "bst",
    label: "Binary Search Tree",
    path: "/bst",
    accent: "amber",
    icon: "BST",
    summary: "Ordered tree invariants, inorder traversal, and bounded recursion.",
  },
  {
    id: "graph-traversal",
    label: "Graph Traversal",
    path: "/graph-traversal",
    accent: "rose",
    icon: "GRT",
    summary: "DFS/BFS graph state, visited sets, dependency edges, and flood fill.",
  },
  {
    id: "graph-bfs",
    label: "Graph BFS",
    path: "/graph-bfs",
    accent: "cyan",
    icon: "GBFS",
    summary: "Shortest-path layers, queues, and breadth-first state expansion.",
  },
  {
    id: "backtracking",
    label: "Backtracking",
    path: "/backtracking",
    accent: "emerald",
    icon: "BT",
    summary: "Choice trees, recursive constraints, branch pruning, and undo steps.",
  },
  {
    id: "divide-conquer",
    label: "Divide & Conquer",
    path: "/divide-conquer",
    accent: "amber",
    icon: "D&C",
    summary: "Recursive splits, merge phases, balanced construction, and quad partitions.",
  },
  {
    id: "kadane",
    label: "Kadane's Algorithm",
    path: "/kadane",
    accent: "cyan",
    icon: "KAD",
    summary: "Running subarray state, local recovery, and global best tracking.",
  },
  {
    id: "binary-search",
    label: "Binary Search",
    path: "/binary-search",
    accent: "rose",
    icon: "BS",
    summary: "Monotonic structure, partition logic, and boundary targeting.",
  },
  {
    id: "heap",
    label: "Heap",
    path: "/heap",
    accent: "blue",
    icon: "HEAP",
    summary: "Priority queues, stream medians, k-way candidates, and greedy selection.",
  },
  {
    id: "math",
    label: "Math",
    path: "/math",
    accent: "emerald",
    icon: "MATH",
    summary: "Digit transforms, carry propagation, and numeric invariants.",
  },
  {
    id: "dp-1d",
    label: "1D DP",
    path: "/dp-1d",
    accent: "amber",
    icon: "DP1",
    summary: "State compression, recurrence spotting, and optimal substructure.",
  },
  {
    id: "dp-2d",
    label: "Multidimensional DP",
    path: "/dp-2d",
    accent: "rose",
    icon: "DP2",
    summary: "Matrix states, string alignment, grid recurrence, and layered decisions.",
  },
];

const problemSeeds: ProblemSeed[] = [
  { category: "array-string", slug: "best-time-to-buy-and-sell-stock-ii", title: "Best Time to Buy and Sell Stock II", difficulty: "medium", description: "Trace every profitable upward price edge and accumulate unlimited transaction profit.", taxonomy: "Array / String / Greedy Profit" },
  { category: "array-string", slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "easy", description: "Scan prices once, keep the cheapest buy day seen so far, and evaluate every later day as a possible sell.", taxonomy: "Array / String / Greedy Profit" },
  { category: "array-string", slug: "candy", title: "Candy", difficulty: "hard", description: "Distribute the fewest candies by enforcing rating inequalities once from the left and once from the right.", taxonomy: "Array / String / Greedy Two-Pass Constraints" },
  { category: "array-string", slug: "find-the-index-of-the-first-occurrence-in-a-string", title: "Find the Index of the First Occurrence in a String", difficulty: "easy", description: "Return the first index where the needle appears in the haystack by testing candidate windows left to right.", taxonomy: "Array / String / Substring Search / Sliding Alignment" },
  { category: "array-string", slug: "gas-station", title: "Gas Station", difficulty: "medium", description: "Find the unique start index by combining a global balance check with a local running tank that resets on failure.", taxonomy: "Array / String / Greedy Circuit Proof" },
  { category: "array-string", slug: "h-index", title: "H-Index", difficulty: "medium", description: "Sort citations in descending order and locate the largest threshold where citations[i] still supports h = i + 1.", taxonomy: "Array / String / Threshold Logic" },
  { category: "array-string", slug: "insert-delete-getrandom-o1", title: "Insert Delete GetRandom O(1)", difficulty: "medium", description: "Replay a full RandomizedSet operation log and watch how the dense array and hashmap cooperate to preserve average O(1) operations.", taxonomy: "Array / String / Hashmap + Array" },
  { category: "array-string", slug: "integer-to-roman", title: "Integer to Roman", difficulty: "medium", description: "Convert an integer into a Roman numeral by greedily minting the largest denomination that still fits the remaining value.", taxonomy: "Array / String / Greedy Denominations / Roman Numerals" },
  { category: "array-string", slug: "jump-game-ii", title: "Jump Game II", difficulty: "medium", description: "Interpret the array as BFS layers: currentEnd closes the current jump window, and farthest builds the next one.", taxonomy: "Array / String / Minimum Jump Layers" },
  { category: "array-string", slug: "jump-game", title: "Jump Game", difficulty: "medium", description: "Keep a single farthest-reachable frontier and decide whether the last index ever becomes reachable.", taxonomy: "Array / String / Greedy Frontier" },
  { category: "array-string", slug: "length-of-last-word", title: "Length of Last Word", difficulty: "easy", description: "Return the length of the last word in a string by scanning from the end, trimming spaces, and counting the final non-space stretch.", taxonomy: "Array / String / Reverse Scan / Whitespace" },
  { category: "array-string", slug: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "easy", description: "Find the longest shared prefix across a list of strings by comparing one character column at a time.", taxonomy: "Array / String / Prefix Scan / Column Comparison" },
  { category: "array-string", slug: "majority-element", title: "Majority Element", difficulty: "easy", description: "Watch Boyer-Moore pair off competing values until the majority element remains as the final survivor.", taxonomy: "Array / String / Voting Invariant" },
  { category: "array-string", slug: "merge-sorted-array", title: "Merge Sorted Array", difficulty: "easy", description: "Merge two sorted arrays directly into nums1 and watch how the rightmost free slot makes in-place merging safe.", taxonomy: "Array / String / In-Place Merge" },
  { category: "array-string", slug: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "medium", description: "Compute the product for every index without division by first storing left products and then multiplying in right products.", taxonomy: "Array / String / Prefix and Suffix Products" },
  { category: "array-string", slug: "remove-duplicates-from-sorted-array-ii", title: "Remove Duplicates from Sorted Array II", difficulty: "medium", description: "Keep a valid prefix where every value appears at most twice, using the write-2 lookback to block third copies.", taxonomy: "Array / String / Bounded Duplicates" },
  { category: "array-string", slug: "remove-duplicates-from-sorted-array", title: "Remove Duplicates from Sorted Array", difficulty: "easy", description: "Use the sorted order to keep a compact unique prefix and skip repeated values with a single comparison.", taxonomy: "Array / String / Sorted Array Prefix" },
  { category: "array-string", slug: "remove-element", title: "Remove Element", difficulty: "easy", description: "Compact every non-target value into the front of the array and treat the remaining tail as irrelevant.", taxonomy: "Array / String / In-Place Filtering" },
  { category: "array-string", slug: "reverse-words-in-a-string", title: "Reverse Words in a String", difficulty: "medium", description: "Normalize the input into clean tokens, then rebuild the sentence from the last token back to the first with exactly one space between words.", taxonomy: "Array / String / Tokenization / Reverse Assembly" },
  { category: "array-string", slug: "roman-to-integer", title: "Roman to Integer", difficulty: "easy", description: "Convert a Roman numeral into an integer by comparing each glyph to its immediate lookahead and turning it into a signed contribution.", taxonomy: "Array / String / Roman Numerals / Lookahead" },
  { category: "array-string", slug: "rotate-array", title: "Rotate Array", difficulty: "medium", description: "Rotate right by k steps using the classic reverse-all, reverse-front, reverse-back strategy.", taxonomy: "Array / String / Reversal Trick" },
  { category: "array-string", slug: "text-justification", title: "Text Justification", difficulty: "hard", description: "Greedily pack words into each line, distribute the remaining spaces across the gaps, and left-justify the final line.", taxonomy: "Array / String / Greedy Packing / Formatting" },
  { category: "array-string", slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "hard", description: "Count trapped water in one pass by always resolving the shorter side and maintaining left and right boundary maxima.", taxonomy: "Array / String / Two-Pointer Boundary Maxima" },
  { category: "array-string", slug: "zigzag-conversion", title: "Zigzag Conversion", difficulty: "medium", description: "Route characters through a bouncing row pointer, then read the row buffers back in order to form the zigzag-converted string.", taxonomy: "Array / String / Simulation / Zigzag Routing" },
  { category: "backtracking", slug: "combination-sum", title: "Combination Sum", difficulty: "medium", description: "Trace the Combination Sum algorithm from parsed input through each decision point.", taxonomy: "Backtracking / Trace-driven lesson" },
  { category: "backtracking", slug: "combinations", title: "Combinations", difficulty: "medium", description: "Trace the Combinations algorithm from parsed input through each decision point.", taxonomy: "Backtracking / Trace-driven lesson" },
  { category: "backtracking", slug: "generate-parentheses", title: "Generate Parentheses", difficulty: "medium", description: "Trace the Generate Parentheses algorithm from parsed input through each decision point.", taxonomy: "Backtracking / Trace-driven lesson" },
  { category: "backtracking", slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "medium", description: "Trace the Letter Combinations of a Phone Number algorithm from parsed input through each decision point.", taxonomy: "Backtracking / Trace-driven lesson" },
  { category: "backtracking", slug: "n-queens-ii", title: "N-Queens II", difficulty: "hard", description: "Trace the N-Queens II algorithm from parsed input through each decision point.", taxonomy: "Backtracking / Trace-driven lesson" },
  { category: "backtracking", slug: "permutations", title: "Permutations", difficulty: "medium", description: "Fill the next slot with one unused value, recurse until every slot is occupied, then undo the placement so a different ordering can be explored cleanly.", taxonomy: "Backtracking / Used Mask / Slot Filling" },
  { category: "backtracking", slug: "word-search", title: "Word Search", difficulty: "medium", description: "Try each board cell as a start, walk orthogonal neighbors that match the next character, and backtrack the path the moment a branch cannot continue the word.", taxonomy: "Backtracking / Grid DFS / Path Reuse Constraint" },
  { category: "binary-search", slug: "find-first-last-position", title: "Find First and Last Position", difficulty: "medium", description: "Trace the Find First and Last Position algorithm from parsed input through each decision point.", taxonomy: "Binary Search / Trace-driven lesson" },
  { category: "binary-search", slug: "find-minimum-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "medium", description: "Trace the Find Minimum in Rotated Sorted Array algorithm from parsed input through each decision point.", taxonomy: "Binary Search / Trace-driven lesson" },
  { category: "binary-search", slug: "find-peak-element", title: "Find Peak Element", difficulty: "medium", description: "Trace the Find Peak Element algorithm from parsed input through each decision point.", taxonomy: "Binary Search / Trace-driven lesson" },
  { category: "binary-search", slug: "median-two-sorted", title: "Median of Two Sorted Arrays", difficulty: "hard", description: "Binary-search the smaller array until both partitions agree on the median boundary.", taxonomy: "Binary Search / Partition Search" },
  { category: "binary-search", slug: "search-2d-matrix", title: "Search a 2D Matrix", difficulty: "medium", description: "Trace the Search a 2D Matrix algorithm from parsed input through each decision point.", taxonomy: "Binary Search / Trace-driven lesson" },
  { category: "binary-search", slug: "search-insert-position", title: "Search Insert Position", difficulty: "easy", description: "Trace the lower-bound binary search that returns the found index or insertion point.", taxonomy: "Binary Search / Lower Bound" },
  { category: "binary-search", slug: "search-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "medium", description: "This visualizer shows why rotation does not break binary search: one half of the current window is always still sorted, and that is enough information to throw half the window away.", taxonomy: "Binary Search / Rotation / Sorted Half Test" },
  { category: "binary-tree-bfs", slug: "average-of-levels-in-binary-tree", title: "Average of Levels in Binary Tree", difficulty: "easy", description: "Trace the Average of Levels in Binary Tree algorithm from parsed input through each decision point.", taxonomy: "Binary Tree BFS / Trace-driven lesson" },
  { category: "binary-tree-bfs", slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "medium", description: "Trace the Binary Tree Level Order Traversal algorithm from parsed input through each decision point.", taxonomy: "Binary Tree BFS / Trace-driven lesson" },
  { category: "binary-tree-bfs", slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "medium", description: "Trace the Binary Tree Right Side View algorithm from parsed input through each decision point.", taxonomy: "Binary Tree BFS / Trace-driven lesson" },
  { category: "binary-tree-bfs", slug: "binary-tree-zigzag-level-order-traversal", title: "Binary Tree Zigzag Level Order Traversal", difficulty: "medium", description: "Trace the Binary Tree Zigzag Level Order Traversal algorithm from parsed input through each decision point.", taxonomy: "Binary Tree BFS / Trace-driven lesson" },
  { category: "binary-tree", slug: "binary-search-tree-iterator", title: "Binary Search Tree Iterator", difficulty: "medium", description: "Trace the Binary Search Tree Iterator algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "construct-from-pre-in", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "medium", description: "Trace recursive root selection from preorder and subtree boundaries from inorder.", taxonomy: "Binary Tree / Recursive Construction" },
  { category: "binary-tree", slug: "count-complete-tree-nodes", title: "Count Complete Tree Nodes", difficulty: "easy", description: "Trace the Count Complete Tree Nodes algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "flatten-binary-tree-to-linked-list", title: "Flatten Binary Tree to Linked List", difficulty: "medium", description: "Trace the Flatten Binary Tree to Linked List algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "invert-tree", title: "Invert Binary Tree", difficulty: "easy", description: "Trace the recursive swaps that mirror every subtree.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "lowest-common-ancestor-binary-tree", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "medium", description: "Trace the Lowest Common Ancestor of a Binary Tree algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "max-depth", title: "Maximum Depth of Binary Tree", difficulty: "easy", description: "Trace level-order BFS as each completed frontier increments the depth.", taxonomy: "Binary Tree / BFS Depth" },
  { category: "binary-tree", slug: "maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "hard", description: "Trace the Binary Tree Maximum Path Sum algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "path-sum", title: "Path Sum", difficulty: "easy", description: "Trace the Path Sum algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "populating-next-right-pointers-ii", title: "Populating Next Right Pointers II", difficulty: "medium", description: "Trace the Populating Next Right Pointers II algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "same-tree", title: "Same Tree", difficulty: "easy", description: "Trace paired recursive comparisons between two binary trees.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "sum-root-to-leaf-numbers", title: "Sum Root to Leaf Numbers", difficulty: "medium", description: "Trace the Sum Root to Leaf Numbers algorithm from parsed input through each decision point.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "binary-tree", slug: "symmetric-tree", title: "Symmetric Tree", difficulty: "easy", description: "Trace mirror comparisons between left and right subtrees.", taxonomy: "Binary Tree / Trace-driven lesson" },
  { category: "bst", slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", difficulty: "medium", description: "Trace the Kth Smallest Element in a BST algorithm from parsed input through each decision point.", taxonomy: "BST / Trace-driven lesson" },
  { category: "bst", slug: "minimum-absolute-difference-in-bst", title: "Minimum Absolute Difference in BST", difficulty: "easy", description: "Trace the Minimum Absolute Difference in BST algorithm from parsed input through each decision point.", taxonomy: "BST / Trace-driven lesson" },
  { category: "bst", slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "medium", description: "Trace the Validate Binary Search Tree algorithm from parsed input through each decision point.", taxonomy: "BST / Trace-driven lesson" },
  { category: "divide-conquer", slug: "construct-quad-tree", title: "Construct Quad Tree", difficulty: "medium", description: "Trace the Construct Quad Tree algorithm from parsed input through each decision point.", taxonomy: "Divide & Conquer / Trace-driven lesson" },
  { category: "divide-conquer", slug: "convert-sorted-array-to-binary-search-tree", title: "Convert Sorted Array to Binary Search Tree", difficulty: "easy", description: "Trace the Convert Sorted Array to Binary Search Tree algorithm from parsed input through each decision point.", taxonomy: "Divide & Conquer / Trace-driven lesson" },
  { category: "divide-conquer", slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "hard", description: "Trace the Merge k Sorted Lists algorithm from parsed input through each decision point.", taxonomy: "Divide & Conquer / Trace-driven lesson" },
  { category: "divide-conquer", slug: "sort-list", title: "Sort List", difficulty: "medium", description: "Trace the Sort List algorithm from parsed input through each decision point.", taxonomy: "Divide & Conquer / Trace-driven lesson" },
  { category: "dp-1d", slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "easy", description: "Climb a cinematic staircase where each landing resolves from the previous two answers, making the Fibonacci recurrence feel spatial and inevitable.", taxonomy: "1D DP / Fibonacci recurrence / stair counting" },
  { category: "dp-1d", slug: "coin-change", title: "Coin Change", difficulty: "medium", description: "Step inside the coin forge as denominations sweep across the amount table, competing to produce the cheapest assembly for every target.", taxonomy: "1D DP / unbounded knapsack / minimum coins" },
  { category: "dp-1d", slug: "house-robber", title: "House Robber", difficulty: "medium", description: "Plan a silent heist one house at a time and watch the DP planner choose between taking the current house or preserving the previous best prefix.", taxonomy: "1D DP / take-or-skip / prefix maximization" },
  { category: "dp-1d", slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "medium", description: "Build a skyline of subsequence lengths and watch each number search left for a lower tower that can launch a longer increasing chain.", taxonomy: "1D DP / subsequence extension / quadratic scan" },
  { category: "dp-1d", slug: "word-break", title: "Word Break", difficulty: "medium", description: "See segmentation as a timeline of reachable cut positions, where dictionary words bridge one valid cut to the next across the source string.", taxonomy: "1D DP / prefix reachability / string segmentation" },
  { category: "dp-2d", slug: "best-time-to-buy-and-sell-stock-iii", title: "Best Time to Buy and Sell Stock III", difficulty: "hard", description: "Watch profit flow through a four-stage trading control room where each day can upgrade the first buy, first sell, second buy, or second sell state.", taxonomy: "DP state machine / at most two transactions / profit optimization" },
  { category: "dp-2d", slug: "best-time-to-buy-and-sell-stock-iv", title: "Best Time to Buy and Sell Stock IV", difficulty: "hard", description: "Scale the trading ladder to k transactions and watch each price update a full stack of buy and sell layers.", taxonomy: "DP state machine / k transactions / layered optimization" },
  { category: "dp-2d", slug: "edit-distance", title: "Edit Distance", difficulty: "medium", description: "Step through an edit laboratory where insert, delete, and replace compete cell by cell inside the transformation matrix.", taxonomy: "2D DP / string transformation / operation cost matrix" },
  { category: "dp-2d", slug: "interleaving-string", title: "Interleaving String", difficulty: "medium", description: "Use a weave loom to track whether prefixes of two source strings can interlace cleanly into the target ribbon.", taxonomy: "2D DP / string weave / prefix compatibility" },
  { category: "dp-2d", slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "medium", description: "Scan a resonance table of substring windows and watch mirrored endpoints light up the longest valid palindrome in the string.", taxonomy: "2D DP / substring windows / palindrome table" },
  { category: "dp-2d", slug: "maximal-square", title: "Maximal Square", difficulty: "medium", description: "Use a square radar to grow all-ones squares from every valid cell and watch the largest area emerge from the DP field.", taxonomy: "2D DP / square growth / binary matrix" },
  { category: "dp-2d", slug: "minimum-path-sum", title: "Minimum Path Sum", difficulty: "medium", description: "Traverse a luminous atlas where every cell chooses the cheaper path from above or left until the destination cost stabilizes.", taxonomy: "2D DP / grid path cost / right and down transitions" },
  { category: "dp-2d", slug: "triangle", title: "Triangle", difficulty: "medium", description: "Descend through a crystal lattice where each cell inherits the cheaper of its two parents above and the minimum path reveals itself in the bottom row.", taxonomy: "2D DP / triangular grid / minimum path sum" },
  { category: "dp-2d", slug: "unique-paths-ii", title: "Unique Paths II", difficulty: "medium", description: "Watch path counts flow around obstacles as the robot's reachable field expands through the grid one open cell at a time.", taxonomy: "2D DP / obstacle grid / path counting" },
  { category: "graph-bfs", slug: "minimum-genetic-mutation", title: "Minimum Genetic Mutation", difficulty: "medium", description: "Trace the Minimum Genetic Mutation algorithm from parsed input through each decision point.", taxonomy: "Graph BFS / Trace-driven lesson" },
  { category: "graph-bfs", slug: "snakes-and-ladders", title: "Snakes and Ladders", difficulty: "medium", description: "Trace the Snakes and Ladders algorithm from parsed input through each decision point.", taxonomy: "Graph BFS / Trace-driven lesson" },
  { category: "graph-bfs", slug: "word-ladder", title: "Word Ladder", difficulty: "hard", description: "Trace the Word Ladder algorithm from parsed input through each decision point.", taxonomy: "Graph BFS / Trace-driven lesson" },
  { category: "graph-traversal", slug: "clone-graph", title: "Clone Graph", difficulty: "medium", description: "Trace the Clone Graph algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "graph-traversal", slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "medium", description: "Trace the Course Schedule II algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "graph-traversal", slug: "course-schedule", title: "Course Schedule", difficulty: "medium", description: "Trace the Course Schedule algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "graph-traversal", slug: "evaluate-division", title: "Evaluate Division", difficulty: "medium", description: "Trace the Evaluate Division algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "graph-traversal", slug: "number-of-islands", title: "Number of Islands", difficulty: "medium", description: "Trace the Number of Islands algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "graph-traversal", slug: "surrounded-regions", title: "Surrounded Regions", difficulty: "medium", description: "Trace the Surrounded Regions algorithm from parsed input through each decision point.", taxonomy: "Graph Traversal / Trace-driven lesson" },
  { category: "hashmap", slug: "contains-duplicate-ii", title: "Contains Duplicate II", difficulty: "easy", description: "Store the latest index for each number, then let every repeat instantly measure its gap to the previous occurrence and compare that gap with k.", taxonomy: "Hashmap / Index Gap" },
  { category: "hashmap", slug: "group-anagrams", title: "Group Anagrams", difficulty: "medium", description: "Normalize each word into a sorted signature and use that signature as the hash-map key. Words with identical signatures collapse into the same group.", taxonomy: "Hashmap / Signature Buckets" },
  { category: "hashmap", slug: "happy-number", title: "Happy Number", difficulty: "easy", description: "Transform the number into the sum of the squares of its digits and use a hash set to decide whether the sequence converges to 1 or loops forever.", taxonomy: "Hashmap / Cycle Detection" },
  { category: "hashmap", slug: "isomorphic-strings", title: "Isomorphic Strings", difficulty: "easy", description: "Walk the strings together and enforce a one-to-one character mapping in both directions. The first mismatch or target collision ends the trace.", taxonomy: "Hashmap / Bijection" },
  { category: "hashmap", slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "medium", description: "Deduplicate values into a set, then expand consecutive runs only from numbers whose predecessor is missing. That single idea is what makes the solution linear.", taxonomy: "Hashmap / Set Expansion" },
  { category: "hashmap", slug: "ransom-note", title: "Ransom Note", difficulty: "easy", description: "Build a frequency table from the magazine, then spend those counts while the ransom note asks for letters. The moment a count hits zero too early, the answer becomes false.", taxonomy: "Hashmap / Frequency Counting" },
  { category: "hashmap", slug: "two-sum", title: "Two Sum", difficulty: "easy", description: "Scan the array once, compute the missing complement for the current value, and let the hash map tell you whether that partner has already appeared.", taxonomy: "Hashmap / Complement Lookup" },
  { category: "hashmap", slug: "valid-anagram", title: "Valid Anagram", difficulty: "easy", description: "Visualize the classic two-pass frequency trick: count characters from the first string, then cancel those counts using the second string until the ledger balances or breaks.", taxonomy: "Hashmap / Frequency Delta" },
  { category: "hashmap", slug: "word-pattern", title: "Word Pattern", difficulty: "easy", description: "Treat each pattern letter like a symbol that must consistently map to one whole word, while each word stays owned by exactly one symbol.", taxonomy: "Hashmap / Word Bijection" },
  { category: "heap", slug: "find-k-pairs-with-smallest-sums", title: "Find K Pairs with Smallest Sums", difficulty: "medium", description: "Trace the Find K Pairs with Smallest Sums algorithm from parsed input through each decision point.", taxonomy: "Heap / Trace-driven lesson" },
  { category: "heap", slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "hard", description: "Trace the Find Median from Data Stream algorithm from parsed input through each decision point.", taxonomy: "Heap / Trace-driven lesson" },
  { category: "heap", slug: "ipo", title: "IPO", difficulty: "hard", description: "Trace the IPO algorithm from parsed input through each decision point.", taxonomy: "Heap / Trace-driven lesson" },
  { category: "heap", slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "medium", description: "Trace the Kth Largest Element in an Array algorithm from parsed input through each decision point.", taxonomy: "Heap / Trace-driven lesson" },
  { category: "kadane", slug: "max-subarray", title: "Maximum Subarray", difficulty: "medium", description: "Trace Kadane's running sum and best range updates.", taxonomy: "Kadane / Running Best Subarray" },
  { category: "linked-list", slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "medium", description: "Trace digit-by-digit linked-list addition with carry propagation.", taxonomy: "Linked List / Digit Carry" },
  { category: "linked-list", slug: "cycle", title: "Linked List Cycle", difficulty: "easy", description: "Trace slow and fast pointers until they meet or fast reaches the end.", taxonomy: "Linked List / Floyd Cycle Detection" },
  { category: "linked-list", slug: "lru-cache", title: "LRU Cache", difficulty: "medium", description: "Trace O(1) cache access by coordinating a hashmap with recency ordering.", taxonomy: "Linked List / Hash Map + Doubly Linked List" },
  { category: "linked-list", slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "easy", description: "Trace the smaller-head selection that builds one sorted linked list.", taxonomy: "Linked List / Merge" },
  { category: "linked-list", slug: "remove-duplicates-ii", title: "Remove Duplicates from Sorted List II", difficulty: "medium", description: "Trace the Remove Duplicates from Sorted List II pointer algorithm through each mutation.", taxonomy: "Linked List / Pointer Trace" },
  { category: "linked-list", slug: "remove-nth", title: "Remove Nth Node From End of List", difficulty: "medium", description: "Trace the Remove Nth Node From End of List pointer algorithm through each mutation.", taxonomy: "Linked List / Pointer Trace" },
  { category: "linked-list", slug: "reverse-k-group", title: "Reverse Nodes in k-Group", difficulty: "hard", description: "Trace scanning, reversing, and reconnecting each complete k-sized group.", taxonomy: "Linked List / K-group reversal" },
  { category: "linked-list", slug: "reverse-linked-list-ii", title: "Reverse Linked List II", difficulty: "medium", description: "Trace the Reverse Linked List II pointer algorithm through each mutation.", taxonomy: "Linked List / Pointer Trace" },
  { category: "linked-list", slug: "rotate-list", title: "Rotate List", difficulty: "medium", description: "Trace the Rotate List pointer algorithm through each mutation.", taxonomy: "Linked List / Pointer Trace" },
  { category: "math", slug: "palindrome-number", title: "Palindrome Number", difficulty: "easy", description: "Trace half-number reversal and final comparison.", taxonomy: "Math / Digit Reversal" },
  { category: "math", slug: "plus-one", title: "Plus One", difficulty: "easy", description: "Trace carry propagation from the final digit toward the front.", taxonomy: "Math / Carry Propagation" },
  { category: "matrix", slug: "game-of-life", title: "Game of Life", difficulty: "medium", description: "Update the board in place by counting live neighbors, writing transition markers, and then finalizing the next generation.", taxonomy: "Matrix / Cellular automaton / Neighbor simulation" },
  { category: "matrix", slug: "rotate-image", title: "Rotate Image", difficulty: "medium", description: "Rotate an n x n matrix clockwise by 90 degrees in place using a transpose pass followed by row reversals.", taxonomy: "Matrix / In-place transform / Transpose + reverse" },
  { category: "matrix", slug: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "medium", description: "If any cell is zero, set its entire row and column to zero while reusing the first row and first column as marker storage.", taxonomy: "Matrix / In-place markers / Row and column propagation" },
  { category: "matrix", slug: "spiral-matrix", title: "Spiral Matrix", difficulty: "medium", description: "Return all elements in spiral order by shrinking the outer rectangle after each directional sweep.", taxonomy: "Matrix / Simulation / Boundary contraction" },
  { category: "matrix", slug: "valid-sudoku", title: "Valid Sudoku", difficulty: "medium", description: "Determine whether the filled cells obey Sudoku uniqueness rules by validating each digit against its row, column, and 3 x 3 sub-box.", taxonomy: "Matrix / Constraint validation / Set bookkeeping" },
  { category: "sliding-window", slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "medium", description: "Let the right edge inject new characters into the substring, and whenever a repeat appears, watch the left edge sweep just far enough to restore uniqueness.", taxonomy: "Sliding Window / Unique Window" },
  { category: "sliding-window", slug: "minimum-size-subarray-sum", title: "Minimum Size Subarray Sum", difficulty: "medium", description: "Watch the live window grow until its sum reaches the target, then contract immediately to squeeze out the smallest valid answer.", taxonomy: "Sliding Window / Sum Constraint" },
  { category: "sliding-window", slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "hard", description: "Build a live coverage window over s, track exactly when each required character count from t becomes satisfied, then tighten the window until it is as short as possible.", taxonomy: "Sliding Window / Coverage Map" },
  { category: "sliding-window", slug: "substring-with-concatenation-of-all-words", title: "Substring with Concatenation of All Words", difficulty: "hard", description: "Split the source string into offset-aligned word chunks, run one sliding window per lane, and watch valid concatenation starts appear whenever the word multiset matches exactly.", taxonomy: "Sliding Window / Word Multiset" },
  { category: "stack", slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "easy", description: "Trace stack pushes and pops while validating balanced brackets.", taxonomy: "Stack / Delimiter Matching" },
  { category: "two-pointers", slug: "container-most-water", title: "Container With Most Water", difficulty: "medium", description: "Trace inward pointer movement from the limiting wall while tracking best area.", taxonomy: "Two Pointers / Area Optimization" },
  { category: "two-pointers", slug: "is-subsequence", title: "Is Subsequence", difficulty: "easy", description: "Trace pointer i through s while pointer j scans t.", taxonomy: "Two Pointers / Subsequence Matching" },
  { category: "two-pointers", slug: "three-sum", title: "3Sum", difficulty: "medium", description: "Trace each pivot and two-pointer sweep that discovers unique zero-sum triplets.", taxonomy: "Two Pointers / Sorted Triplet Search" },
  { category: "two-pointers", slug: "two-sum-sorted", title: "Two Sum II - Input Array Is Sorted", difficulty: "medium", description: "Trace inward pointer movement based on comparing the current sum to target.", taxonomy: "Two Pointers / Sorted Pair Search" },
  { category: "two-pointers", slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "easy", description: "Trace normalized character comparisons from both ends toward the center.", taxonomy: "Two Pointers / Normalized Mirror Scan" },
];

function tagsFromTaxonomy(taxonomy: string) {
  return taxonomy
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

export const categoryRegistryById = Object.fromEntries(
  categoryRegistry.map((category) => [category.id, category])
) as Record<string, Category>;

export const problemRegistry: Problem[] = problemSeeds.map((problem) => ({
  ...problem,
  id: `${problem.category}:${problem.slug}`,
  path: `/${problem.category}/${problem.slug}`,
  tags: problem.tags ?? tagsFromTaxonomy(problem.taxonomy),
}));

export const problemRegistryById = Object.fromEntries(
  problemRegistry.map((problem) => [problem.id, problem])
) as Record<string, Problem>;

export const problemRegistryByPath = Object.fromEntries(
  problemRegistry.map((problem) => [problem.path, problem])
) as Record<string, Problem>;

export function getProblemsByCategory(categoryId: string) {
  return problemRegistry.filter((problem) => problem.category === categoryId);
}

export function getCategoryProblemCount(categoryId: string) {
  return getProblemsByCategory(categoryId).length;
}

export function getProblemById(problemId: string) {
  return problemRegistryById[problemId] ?? null;
}

export function getProblemByPath(path: string) {
  return problemRegistryByPath[path] ?? null;
}

export function formatRegistryDifficulty(
  difficulty: RegistryDifficulty
): "Easy" | "Medium" | "Hard" {
  if (difficulty === "easy") {
    return "Easy";
  }

  if (difficulty === "hard") {
    return "Hard";
  }

  return "Medium";
}
