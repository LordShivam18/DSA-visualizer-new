import type { DpProblemMeta } from "./types";

export const oneDimensionalDpProblems: DpProblemMeta[] = [
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description:
      "Watch the staircase grow like a Fibonacci corridor where each landing inherits its path count from the previous two landings.",
    taxonomy: "1D DP / Fibonacci recurrence / stair counting",
    route: "/dp-1d/climbing-stairs",
  },
  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    description:
      "Follow the heist planner as it compares rob-vs-skip at every house and locks the best safe prefix into the DP table.",
    taxonomy: "1D DP / take-or-skip / prefix maximization",
    route: "/dp-1d/house-robber",
  },
  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    description:
      "Trace reachable cut positions through the string and see dictionary words snap into place as valid segments.",
    taxonomy: "1D DP / prefix reachability / string segmentation",
    route: "/dp-1d/word-break",
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    description:
      "Forge each amount from smaller reachable totals and watch denominations compete to minimize the coin count.",
    taxonomy: "1D DP / unbounded knapsack / minimum coins",
    route: "/dp-1d/coin-change",
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    description:
      "Build a skyline of subsequence lengths where each index searches left for a smaller launch point and rises higher.",
    taxonomy: "1D DP / subsequence extension / quadratic scan",
    route: "/dp-1d/longest-increasing-subsequence",
  },
];

export const multidimensionalDpProblems: DpProblemMeta[] = [
  {
    slug: "triangle",
    title: "Triangle",
    difficulty: "Medium",
    description:
      "Collapse the crystal lattice from top to bottom and compare the two child choices underneath every triangle cell.",
    taxonomy: "2D DP / triangular grid / minimum path sum",
    route: "/dp-2d/triangle",
  },
  {
    slug: "minimum-path-sum",
    title: "Minimum Path Sum",
    difficulty: "Medium",
    description:
      "Accumulate path costs through a grid while each cell chooses the cheaper incoming route from above or left.",
    taxonomy: "2D DP / grid path cost / right and down transitions",
    route: "/dp-2d/minimum-path-sum",
  },
  {
    slug: "unique-paths-ii",
    title: "Unique Paths II",
    difficulty: "Medium",
    description:
      "Let path counts flow around blocked cells and see how obstacles cut off branches of the grid instantly.",
    taxonomy: "2D DP / obstacle grid / path counting",
    route: "/dp-2d/unique-paths-ii",
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description:
      "Paint a palindrome table over the string and watch valid mirrored windows reveal the longest glowing substring.",
    taxonomy: "2D DP / substring windows / palindrome table",
    route: "/dp-2d/longest-palindromic-substring",
  },
  {
    slug: "interleaving-string",
    title: "Interleaving String",
    difficulty: "Medium",
    description:
      "Weave two source strings into a target tapestry by checking whether each DP cell can be reached from above or left.",
    taxonomy: "2D DP / string weave / prefix compatibility",
    route: "/dp-2d/interleaving-string",
  },
  {
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "Medium",
    description:
      "Compare insert, delete, and replace costs inside the edit matrix and watch the cheapest operation win cell by cell.",
    taxonomy: "2D DP / string transformation / operation cost matrix",
    route: "/dp-2d/edit-distance",
  },
  {
    slug: "best-time-to-buy-and-sell-stock-iii",
    title: "Best Time to Buy and Sell Stock III",
    difficulty: "Hard",
    description:
      "Animate the two-transaction trading state machine and watch profit flow through buy and sell phases in sequence.",
    taxonomy: "DP state machine / at most two transactions / profit optimization",
    route: "/dp-2d/best-time-to-buy-and-sell-stock-iii",
  },
  {
    slug: "best-time-to-buy-and-sell-stock-iv",
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "Hard",
    description:
      "Scale the trading control room to k transactions and track buy and sell layers across days and transaction counts.",
    taxonomy: "DP state machine / k transactions / layered optimization",
    route: "/dp-2d/best-time-to-buy-and-sell-stock-iv",
  },
  {
    slug: "maximal-square",
    title: "Maximal Square",
    difficulty: "Medium",
    description:
      "Grow square sizes from each 1-cell and watch the DP radar reveal the largest all-ones square hidden in the matrix.",
    taxonomy: "2D DP / square growth / binary matrix",
    route: "/dp-2d/maximal-square",
  },
];
