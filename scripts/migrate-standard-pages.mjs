import fs from "node:fs";

const pages = [
  ["app/backtracking/combination-sum/page.tsx", "/backtracking", "Backtracking", "Combination Sum", "Medium", "../../../components/backtracking/combination-sum", "CombinationSumWorkbench", { candidates: "[2,3,6,7]", target: "7" }, "values.candidates, values.target"],
  ["app/backtracking/combinations/page.tsx", "/backtracking", "Backtracking", "Combinations", "Medium", "../../../components/backtracking/combinations", "CombinationsWorkbench", { n: "4", k: "2" }, "values.n, values.k"],
  ["app/backtracking/generate-parentheses/page.tsx", "/backtracking", "Backtracking", "Generate Parentheses", "Medium", "../../../components/backtracking/generate-parentheses", "GenerateParenthesesWorkbench", { n: "3" }, "values.n"],
  ["app/backtracking/letter-combinations-of-a-phone-number/page.tsx", "/backtracking", "Backtracking", "Letter Combinations of a Phone Number", "Medium", "../../../components/backtracking/letter-combinations-of-a-phone-number", "LetterCombinationsWorkbench", { digits: "23" }, "values.digits"],
  ["app/backtracking/n-queens-ii/page.tsx", "/backtracking", "Backtracking", "N-Queens II", "Hard", "../../../components/backtracking/n-queens-ii", "NQueensWorkbench", { n: "4" }, "values.n"],
  ["app/binary-search/find-first-last-position/page.tsx", "/binary-search", "Binary Search", "Find First and Last Position", "Medium", "../../../components/binary-search/find-first-last-position", "RangeSearchVisualizer", { nums: "5 7 7 8 8 10", target: "8" }, "values.nums, values.target"],
  ["app/binary-search/find-minimum-rotated-sorted-array/page.tsx", "/binary-search", "Binary Search", "Find Minimum in Rotated Sorted Array", "Medium", "../../../components/binary-search/find-minimum-rotated-sorted-array", "MinimumSearchVisualizer", { nums: "3 4 5 1 2" }, "values.nums"],
  ["app/binary-search/find-peak-element/page.tsx", "/binary-search", "Binary Search", "Find Peak Element", "Medium", "../../../components/binary-search/find-peak-element", "PeakSearchVisualizer", { nums: "1 2 3 1" }, "values.nums"],
  ["app/binary-search/search-2d-matrix/page.tsx", "/binary-search", "Binary Search", "Search a 2D Matrix", "Medium", "../../../components/binary-search/search-2d-matrix", "MatrixSearchVisualizer", { matrix: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]", target: "3" }, "values.matrix, values.target"],
  ["app/binary-tree-bfs/average-of-levels-in-binary-tree/page.tsx", "/binary-tree-bfs", "Binary Tree BFS", "Average of Levels in Binary Tree", "Easy", "../../../components/binary-tree-bfs/average-of-levels-in-binary-tree", "AverageLevelsWorkbench", { root: "[3,9,20,null,null,15,7]" }, "values.root"],
  ["app/binary-tree-bfs/binary-tree-level-order-traversal/page.tsx", "/binary-tree-bfs", "Binary Tree BFS", "Binary Tree Level Order Traversal", "Medium", "../../../components/binary-tree-bfs/binary-tree-level-order-traversal", "LevelOrderTraversalWorkbench", { root: "[3,9,20,null,null,15,7]" }, "values.root"],
  ["app/binary-tree-bfs/binary-tree-right-side-view/page.tsx", "/binary-tree-bfs", "Binary Tree BFS", "Binary Tree Right Side View", "Medium", "../../../components/binary-tree-bfs/binary-tree-right-side-view", "BinaryTreeRightSideViewWorkbench", { root: "[1,2,3,null,5,null,4]" }, "values.root"],
  ["app/binary-tree-bfs/binary-tree-zigzag-level-order-traversal/page.tsx", "/binary-tree-bfs", "Binary Tree BFS", "Binary Tree Zigzag Level Order Traversal", "Medium", "../../../components/binary-tree-bfs/binary-tree-zigzag-level-order-traversal", "ZigzagLevelOrderWorkbench", { root: "[3,9,20,null,null,15,7]" }, "values.root"],
  ["app/binary-tree/binary-search-tree-iterator/page.tsx", "/binary-tree", "Binary Tree", "Binary Search Tree Iterator", "Medium", "@/components/binary-tree/binary-search-tree-iterator", "IteratorWorkbench", { root: "[7,3,15,null,null,9,20]", operations: "[\"BSTIterator\",\"next\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\"]" }, "values.root, values.operations", true],
  ["app/binary-tree/count-complete-tree-nodes/page.tsx", "/binary-tree", "Binary Tree", "Count Complete Tree Nodes", "Easy", "../../../components/binary-tree/count-complete-tree-nodes", "CountCompleteTreeNodesWorkbench", { root: "[1,2,3,4,5,6]" }, "values.root"],
  ["app/binary-tree/flatten-binary-tree-to-linked-list/page.tsx", "/binary-tree", "Binary Tree", "Flatten Binary Tree to Linked List", "Medium", "../../../components/binary-tree/flatten-binary-tree-to-linked-list", "FlattenWorkbench", { root: "1,2,5,3,4,null,6" }, "values.root"],
  ["app/binary-tree/lowest-common-ancestor-binary-tree/page.tsx", "/binary-tree", "Binary Tree", "Lowest Common Ancestor of a Binary Tree", "Medium", "../../../components/binary-tree/lowest-common-ancestor-binary-tree", "LowestCommonAncestorWorkbench", { root: "[3,5,1,6,2,0,8,null,null,7,4]", p: "5", q: "1" }, "values.root, values.p, values.q"],
  ["app/binary-tree/maximum-path-sum/page.tsx", "/binary-tree", "Binary Tree", "Binary Tree Maximum Path Sum", "Hard", "../../../components/binary-tree/maximum-path-sum", "MaximumPathSumWorkbench", { root: "-10,9,20,null,null,15,7" }, "values.root"],
  ["app/binary-tree/path-sum/page.tsx", "/binary-tree", "Binary Tree", "Path Sum", "Easy", "../../../components/binary-tree/path-sum", "PathSumWorkbench", { root: "5,4,8,11,null,13,4,7,2,null,null,null,1", target: "22" }, "values.root, values.target"],
  ["app/binary-tree/populating-next-right-pointers-ii/page.tsx", "/binary-tree", "Binary Tree", "Populating Next Right Pointers II", "Medium", "../../../components/binary-tree/populating-next-right-pointers-ii", "NextPointerTree", { root: "1,2,3,4,5,null,7" }, "values.root"],
  ["app/binary-tree/sum-root-to-leaf-numbers/page.tsx", "/binary-tree", "Binary Tree", "Sum Root to Leaf Numbers", "Medium", "../../../components/binary-tree/sum-root-to-leaf-numbers", "SumRootToLeafWorkbench", { root: "4,9,0,5,1" }, "values.root"],
  ["app/bst/kth-smallest-element-in-a-bst/page.tsx", "/bst", "BST", "Kth Smallest Element in a BST", "Medium", "../../../components/bst/kth-smallest-element-in-a-bst", "KthSmallestWorkbench", { root: "[3,1,4,null,2]", k: "1" }, "values.root, values.k"],
  ["app/bst/minimum-absolute-difference-in-bst/page.tsx", "/bst", "BST", "Minimum Absolute Difference in BST", "Easy", "../../../components/bst/minimum-absolute-difference-in-bst", "MinimumDifferenceWorkbench", { root: "[4,2,6,1,3]" }, "values.root"],
  ["app/bst/validate-binary-search-tree/page.tsx", "/bst", "BST", "Validate Binary Search Tree", "Medium", "../../../components/bst/validate-binary-search-tree", "ValidateBSTWorkbench", { root: "[2,1,3]" }, "values.root"],
  ["app/divide-conquer/construct-quad-tree/page.tsx", "/divide-conquer", "Divide & Conquer", "Construct Quad Tree", "Medium", "../../../components/divide-conquer/construct-quad-tree", "ConstructQuadTreeWorkbench", { grid: "[[0,1],[1,0]]" }, "values.grid"],
  ["app/divide-conquer/convert-sorted-array-to-binary-search-tree/page.tsx", "/divide-conquer", "Divide & Conquer", "Convert Sorted Array to Binary Search Tree", "Easy", "../../../components/divide-conquer/convert-sorted-array-to-binary-search-tree", "SortedArrayToBSTWorkbench", { nums: "-10, -3, 0, 5, 9" }, "values.nums"],
  ["app/divide-conquer/merge-k-sorted-lists/page.tsx", "/divide-conquer", "Divide & Conquer", "Merge k Sorted Lists", "Hard", "../../../components/divide-conquer/merge-k-sorted-lists", "MergeKSortedListsWorkbench", { lists: "[[1,4,5],[1,3,4],[2,6]]" }, "values.lists"],
  ["app/divide-conquer/sort-list/page.tsx", "/divide-conquer", "Divide & Conquer", "Sort List", "Medium", "../../../components/divide-conquer/sort-list", "SortListWorkbench", { list: "4, 2, 1, 3" }, "values.list"],
  ["app/graph-bfs/minimum-genetic-mutation/page.tsx", "/graph-bfs", "Graph BFS", "Minimum Genetic Mutation", "Medium", "../../../components/graph-bfs/minimum-genetic-mutation", "MinimumGeneticMutationWorkbench", { startGene: "AACCGGTT", endGene: "AACCGGTA", bank: "[\"AACCGGTA\"]" }, "values"],
  ["app/graph-bfs/snakes-and-ladders/page.tsx", "/graph-bfs", "Graph BFS", "Snakes and Ladders", "Medium", "../../../components/graph-bfs/snakes-and-ladders", "SnakesAndLaddersWorkbench", { board: "[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]" }, "values.board"],
  ["app/graph-bfs/word-ladder/page.tsx", "/graph-bfs", "Graph BFS", "Word Ladder", "Hard", "../../../components/graph-bfs/word-ladder", "WordLadderWorkbench", { beginWord: "hit", endWord: "cog", wordList: "[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]" }, "values"],
  ["app/graph-traversal/clone-graph/page.tsx", "/graph-traversal", "Graph Traversal", "Clone Graph", "Medium", "../../../components/graph-traversal/clone-graph", "CloneGraphWorkbench", { graph: "[[2,4],[1,3],[2,4],[1,3]]" }, "values.graph"],
  ["app/graph-traversal/course-schedule-ii/page.tsx", "/graph-traversal", "Graph Traversal", "Course Schedule II", "Medium", "../../../components/graph-traversal/course-schedule-ii", "CourseScheduleIIWorkbench", { numCourses: "4", prerequisites: "[[1,0],[2,0],[3,1],[3,2]]" }, "values"],
  ["app/graph-traversal/course-schedule/page.tsx", "/graph-traversal", "Graph Traversal", "Course Schedule", "Medium", "../../../components/graph-traversal/course-schedule", "CourseScheduleWorkbench", { numCourses: "2", prerequisites: "[[1,0]]" }, "values"],
  ["app/graph-traversal/evaluate-division/page.tsx", "/graph-traversal", "Graph Traversal", "Evaluate Division", "Medium", "../../../components/graph-traversal/evaluate-division", "EvaluateDivisionWorkbench", { equations: "[[\"a\",\"b\"],[\"b\",\"c\"]]", values: "[2.0,3.0]", queries: "[[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]" }, "values"],
  ["app/graph-traversal/number-of-islands/page.tsx", "/graph-traversal", "Graph Traversal", "Number of Islands", "Medium", "../../../components/graph-traversal/number-of-islands", "IslandsWorkbench", { grid: "11110\n11010\n11000\n00000" }, "values.grid"],
  ["app/graph-traversal/surrounded-regions/page.tsx", "/graph-traversal", "Graph Traversal", "Surrounded Regions", "Medium", "../../../components/graph-traversal/surrounded-regions", "SurroundedRegionsWorkbench", { board: "XXXX\nXOOX\nXXOX\nXOXX" }, "values.board"],
  ["app/heap/find-k-pairs-with-smallest-sums/page.tsx", "/heap", "Heap", "Find K Pairs with Smallest Sums", "Medium", "../../../components/heap/find-k-pairs-with-smallest-sums", "SmallestPairsWorkbench", { nums1: "1, 7, 11", nums2: "2, 4, 6", k: "3" }, "values.nums1, values.nums2, values.k"],
  ["app/heap/find-median-from-data-stream/page.tsx", "/heap", "Heap", "Find Median from Data Stream", "Hard", "../../../components/heap/find-median-from-data-stream", "MedianStreamWorkbench", { operations: "add 1\nadd 2\nmedian\nadd 3\nmedian" }, "values.operations"],
  ["app/heap/ipo/page.tsx", "/heap", "Heap", "IPO", "Hard", "../../../components/heap/ipo", "IPOWorkbench", { k: "2", capital: "0", profits: "1, 2, 3", requirements: "0, 1, 1" }, "values.k, values.capital, values.profits, values.requirements"],
  ["app/heap/kth-largest-element-in-an-array/page.tsx", "/heap", "Heap", "Kth Largest Element in an Array", "Medium", "../../../components/heap/kth-largest-element-in-an-array", "KthLargestWorkbench", { numbers: "3, 2, 1, 5, 6, 4", k: "2" }, "values.numbers, values.k"],
];

function typeName(filePath) {
  return filePath
    .split("/")
    .at(-2)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function fieldFor(key, value) {
  const long = value.length > 32 || value.includes("\n");
  return `{ id: ${JSON.stringify(key)}, label: ${JSON.stringify(key)}, placeholder: ${JSON.stringify(value)}, ${long ? "multiline: true, rows: 4, " : ""}}`;
}

function renderPage([
  filePath,
  categoryHref,
  categoryLabel,
  title,
  difficulty,
  base,
  visual,
  defaultInputs,
  args,
  noMicroscope,
]) {
  const inputs = JSON.stringify(defaultInputs, null, 2).replace(
    /"([^"\n]+)":/g,
    "$1:"
  );
  const fields = Object.entries(defaultInputs)
    .map(([key, value]) => fieldFor(key, value))
    .join(",\n        ");
  const pageName = `${typeName(filePath)}Page`;
  const microscope = noMicroscope
    ? "      renderMicroscope={() => null}"
    : "      renderMicroscope={({ step, teachingMode }) => (\n        <MicroscopeView step={step} mode={teachingMode} />\n      )}";

  const imports = [
    "\"use client\";",
    "",
    "import TraceLessonPage from \"@/components/academy/TraceLessonPage\";",
    "import { toLessonTrace } from \"@/components/academy/traceAdapters\";",
    "",
    `import CodePanel from \"${base}/CodePanel\";`,
  ];
  if (!noMicroscope) {
    imports.push(`import MicroscopeView from \"${base}/MicroscopeView\";`);
  }
  imports.push(`import ${visual} from \"${base}/${visual}\";`);
  imports.push(`import TracePanel from \"${base}/TracePanel\";`);
  imports.push(`import { generateTrace } from \"${base}/generateTrace\";`);

  return `${imports.join("\n")}

const defaultInputs = ${inputs};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(${args}));
}

export default function ${pageName}() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref=${JSON.stringify(categoryHref)}
      categoryLabel=${JSON.stringify(categoryLabel)}
      taxonomy=${JSON.stringify(`${categoryLabel} / Trace-driven lesson`)}
      title=${JSON.stringify(title)}
      difficulty=${JSON.stringify(difficulty)}
      description=${JSON.stringify(
        `Trace the ${title} algorithm from parsed input through each decision point.`
      )}
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        ${fields}
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <${visual} step={step} />}
${microscope}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
`;
}

for (const page of pages) {
  fs.writeFileSync(page[0], renderPage(page));
}

console.log(`Migrated ${pages.length} standard trace pages.`);
