import fs from "node:fs";

function write(file, source) {
  fs.writeFileSync(file, `${source.trim()}\n`);
}

write(
  "app/array-string/best-time-to-buy-and-sell-stock-ii/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/CodePanel";
import MicroscopeView from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/MicroscopeView";
import StockProfitIIVisualizer from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/StockProfitIIVisualizer";
import TracePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/TracePanel";
import { generateTrace } from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/generateTrace";

const defaultInputs = { prices: "[7,1,5,3,6,4]" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.prices);
}

export default function BestTimeToBuyAndSellStockIIPage() {
  return (
    <TraceLessonPage
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Profit"
      title="Best Time to Buy and Sell Stock II"
      difficulty="Medium"
      description="Trace every profitable upward price edge and accumulate unlimited transaction profit."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "prices", label: "prices", placeholder: "[7,1,5,3,6,4]" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <StockProfitIIVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
`
);

write(
  "app/binary-search/median-two-sorted/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayBar from "@/components/binary-search/median-two-sorted/ArrayBar";
import CodePanelM2 from "@/components/binary-search/median-two-sorted/CodePanelM2";
import PartitionView from "@/components/binary-search/median-two-sorted/PartitionView";
import StatsPanelM2 from "@/components/binary-search/median-two-sorted/StatsPanelM2";
import { generateTrace } from "@/components/binary-search/median-two-sorted/generateTrace";

const defaultInputs = { nums1: "1,3", nums2: "2" };
const presets = [{ name: "Default", summary: "median = 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums1, values.nums2));
}

export default function MedianTwoSortedPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Partition Search"
      title="Median of Two Sorted Arrays"
      difficulty="Hard"
      description="Binary-search the smaller array until both partitions agree on the median boundary."
      complexity="O(log min(m,n)) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums1", label: "nums1", placeholder: "1,3" },
        { id: "nums2", label: "nums2", placeholder: "2" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-4">
          <ArrayBar nums1={step.state.nums1} nums2={step.state.nums2} i={step.state.i} j={step.state.j} status={step.state.status} />
          <PartitionView nums1={step.state.nums1} nums2={step.state.nums2} i={step.state.i} j={step.state.j} relation={step.state.relation} />
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelM2
          nums1={step.state.nums1}
          nums2={step.state.nums2}
          i={step.state.i}
          j={step.state.j}
          status={step.state.status}
          median={step.state.median}
          relation={step.state.relation}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => (
        <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>
      )}
      renderCodePanel={({ step, teachingMode }) => <CodePanelM2 activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
`
);

write(
  "app/binary-search/search-insert-position/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import BarView from "@/components/binary-search/search-insert-position/BarView";
import CodePanelBS from "@/components/binary-search/search-insert-position/CodePanelBS";
import StatsPanelBS from "@/components/binary-search/search-insert-position/StatsPanelBS";
import { generateTrace } from "@/components/binary-search/search-insert-position/generateTrace";

const defaultInputs = { nums: "1,3,5,6", target: "5" };
const presets = [{ name: "Default", summary: "index 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums, values.target));
}

export default function SearchInsertPositionPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Lower Bound"
      title="Search Insert Position"
      difficulty="Easy"
      description="Trace the lower-bound binary search that returns the found index or insertion point."
      complexity="O(log n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "1,3,5,6" },
        { id: "target", label: "target", placeholder: "5" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <BarView
          nums={step.state.nums}
          left={step.state.left}
          right={step.state.right}
          mid={step.state.mid}
          target={step.state.target}
          insertPos={step.state.insertPos}
          status={step.state.status}
        />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelBS
          nums={step.state.nums}
          left={step.state.left}
          right={step.state.right}
          mid={step.state.mid}
          target={step.state.target}
          insertPos={step.state.insertPos}
          status={step.state.status}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step, teachingMode }) => <CodePanelBS activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
`
);

write(
  "app/binary-tree/construct-from-pre-in/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/construct-from-pre-in/CodePanelCT";
import InorderBar from "@/components/binary-tree/construct-from-pre-in/InorderBar";
import PreorderBar from "@/components/binary-tree/construct-from-pre-in/PreorderBar";
import RecursionStack from "@/components/binary-tree/construct-from-pre-in/RecursionStack";
import TreeCanvas from "@/components/binary-tree/construct-from-pre-in/TreeCanvas";
import { buildNodeLayouts, computeBarsLayout } from "@/components/binary-tree/construct-from-pre-in/layoutEngine";
import { generateTrace } from "@/components/binary-tree/construct-from-pre-in/generateTrace";

const defaultInputs = { preorder: "3,9,20,15,7", inorder: "9,3,15,20,7" };
const presets = [{ name: "Default", summary: "Build sample tree", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.preorder, values.inorder));
}

function buildLayouts(trace: any[]) {
  const nodesFound = trace
    .filter((step) => step.nodeId)
    .map((step) => {
      const parts = String(step.nodeId).split("-");
      const value = Number(parts[1]);
      const preorderIndex = Number(parts[2]);
      return {
        id: step.nodeId,
        value,
        preorderIndex,
        inorderIndex: step.state.inorder.indexOf(value),
        depth: step.snapshot?.depth ?? 0,
      };
    });
  const unique = Array.from(new Map(nodesFound.map((node) => [node.id, node])).values());
  return buildNodeLayouts(unique, computeBarsLayout(940, trace[0]?.state.preorder.length ?? 0));
}

export default function ConstructFromPreInPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Recursive Construction"
      title="Construct Binary Tree from Preorder and Inorder"
      difficulty="Medium"
      description="Trace recursive root selection from preorder and subtree boundaries from inorder."
      complexity="O(n) time / O(n) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "preorder", label: "preorder", placeholder: "3,9,20,15,7" },
        { id: "inorder", label: "inorder", placeholder: "9,3,15,20,7" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => {
        const cursor = timeline.activeIndex;
        const first = trace[0];
        return (
          <div className="space-y-3 overflow-x-auto rounded-2xl border border-slate-800 bg-[#050817] p-4">
            <PreorderBar pre={first.state.preorder} cursor={cursor} trace={trace} />
            <InorderBar ino={first.state.inorder} cursor={cursor} trace={trace} />
            <TreeCanvas trace={trace} cursor={cursor} nodeLayouts={buildLayouts(trace)} />
          </div>
        );
      }}
      renderMicroscope={({ trace, timeline }) => <RecursionStack trace={trace} cursor={timeline.activeIndex} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ trace, timeline, teachingMode }) => <CodePanel trace={trace} cursor={timeline.activeIndex} mode={teachingMode} />}
    />
  );
}
`
);

function treeCursorPage(file, title, traceImport, visualImport, tracePanelImport, codeImport, generateCall, description, codeExtra = "") {
  write(
    file,
    String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "${codeImport}";
import TracePanel from "${tracePanelImport}";
import TreeCanvas from "${visualImport}";
import { generateTrace } from "${traceImport}";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace() {
  return toLessonTrace(generateTrace(${generateCall}));
}

export default function ${title.replace(/[^A-Za-z0-9]/g, "")}Page() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title=${JSON.stringify(title)}
      difficulty="Easy"
      description=${JSON.stringify(description)}
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => <TreeCanvas trace={trace} cursor={timeline.activeIndex} />}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline, teachingMode }) => <CodePanel trace={trace} cursor={timeline.activeIndex} ${codeExtra} />}
    />
  );
}
`
  );
}

treeCursorPage(
  "app/binary-tree/invert-tree/page.tsx",
  "Invert Binary Tree",
  "@/components/binary-tree/invert-tree/generateTrace",
  "@/components/binary-tree/invert-tree/TreeCanvas",
  "@/components/binary-tree/invert-tree/TracePanel",
  "@/components/binary-tree/invert-tree/CodePanel",
  "",
  "Trace the recursive swaps that mirror every subtree.",
  "mode={teachingMode}"
);

treeCursorPage(
  "app/binary-tree/same-tree/page.tsx",
  "Same Tree",
  "@/components/binary-tree/same-tree/generateTrace",
  "@/components/binary-tree/same-tree/TreeCanvas",
  "@/components/binary-tree/same-tree/TracePanel",
  "@/components/binary-tree/same-tree/CodePanel",
  "",
  "Trace paired recursive comparisons between two binary trees."
);

treeCursorPage(
  "app/binary-tree/symmetric-tree/page.tsx",
  "Symmetric Tree",
  "@/components/binary-tree/symmetric-tree/generateTrace",
  "@/components/binary-tree/symmetric-tree/TreeCanvas",
  "@/components/binary-tree/symmetric-tree/TracePanel",
  "@/components/binary-tree/symmetric-tree/CodePanel",
  "",
  "Trace mirror comparisons between left and right subtrees."
);

write(
  "app/binary-tree/max-depth/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanelBT from "@/components/binary-tree/max-depth/CodePanelBT";
import StatsPanelBT from "@/components/binary-tree/max-depth/StatsPanelBT";
import TreeView from "@/components/binary-tree/max-depth/TreeView";
import { generateTrace } from "@/components/binary-tree/max-depth/generateTrace";

const defaultInputs = { sample: "default" };
const presets = [{ name: "Default", summary: "Static BFS tree", values: defaultInputs }];

function generateLessonTrace() {
  return generateTrace();
}

export default function MaxDepthPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / BFS Depth"
      title="Maximum Depth of Binary Tree"
      difficulty="Easy"
      description="Trace level-order BFS as each completed frontier increments the depth."
      complexity="O(n) time / O(w) space"
      defaultInputs={defaultInputs}
      inputFields={[]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step, teachingMode }) => (
        <TreeView currentId={step.state.currentId} queue={step.state.queue} visited={step.state.visited} mode={teachingMode} />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelBT depth={step.state.depth} queue={step.state.queue} currentId={step.state.currentId} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step, teachingMode }) => <CodePanelBT activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
`
);

write(
  "app/kadane/max-subarray/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayViz from "@/components/kadane/ArrayViz";
import ChartViz from "@/components/kadane/ChartViz";
import CodePanel from "@/components/kadane/CodePanel";
import TracePanel from "@/components/kadane/TracePanel";
import { generateTrace } from "@/components/kadane/generateTrace";

const defaultInputs = { nums: "-2,1,-3,4,-1,2,1,-5,4" };
const presets = [{ name: "Default", summary: "max = 6", values: defaultInputs }];

function parseNums(raw: string) {
  const values = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  return values.length ? values : undefined;
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseNums(values.nums)));
}

export default function MaxSubarrayPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/kadane"
      categoryLabel="Kadane"
      taxonomy="Kadane / Running Best Subarray"
      title="Maximum Subarray"
      difficulty="Medium"
      description="Trace Kadane's running sum and best range updates."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "-2,1,-3,4,-1,2,1,-5,4" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => (
        <div className="space-y-4">
          <ArrayViz trace={trace} cursor={timeline.activeIndex} />
          <ChartViz trace={trace} cursor={timeline.activeIndex} />
        </div>
      )}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline }) => <CodePanel trace={trace} cursor={timeline.activeIndex} />}
    />
  );
}
`
);

write(
  "app/linked-list/lru-cache/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CacheTrack from "@/components/linked-list/lru-cache/CacheTrack";
import CodePanel from "@/components/linked-list/lru-cache/CodePanel";
import HashMapViz from "@/components/linked-list/lru-cache/HashMapViz";
import MicroscopeView from "@/components/linked-list/lru-cache/MicroscopeView";
import TracePanel from "@/components/linked-list/lru-cache/TracePanel";
import { generateTrace, type LRUOperation } from "@/components/linked-list/lru-cache/generateTrace";

const defaultInputs = { capacity: "2", operations: "put 1 1\nput 2 2\nget 1\nput 3 3\nget 2" };
const presets = [{ name: "Default", summary: "LRU flow", values: defaultInputs }];

function parseOperations(raw: string): LRUOperation[] {
  return raw.split(/\r?\n|;/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [type, key, value] = line.split(/[\s,()]+/).filter(Boolean);
    return type === "get"
      ? { type: "get", key: Number(key) || 0 }
      : { type: "put", key: Number(key) || 0, value: Number(value) || 0 };
  });
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(Number(values.capacity) || 2, parseOperations(values.operations)));
}

export default function LruCachePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Hash Map + Doubly Linked List"
      title="LRU Cache"
      difficulty="Medium"
      description="Trace O(1) cache access by coordinating a hashmap with recency ordering."
      complexity="O(1) get / O(1) put"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "capacity", label: "capacity", placeholder: "2" },
        { id: "operations", label: "operations", placeholder: "put 1 1", multiline: true, rows: 5 },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-4">
          <CacheTrack step={step} />
          <HashMapViz keys={step.mapKeys} activeKey={step.activeKey} />
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
`
);

function writeLinkedListTracePage(file, title, folder, defaults, args, visual = "LinkedListTrack", microscopeMode = true) {
  const inputs = JSON.stringify(defaults, null, 2).replace(/"([^"\n]+)":/g, "$1:");
  const fields = Object.keys(defaults)
    .map((key) => `{ id: "${key}", label: "${key}", placeholder: ${JSON.stringify(defaults[key])} }`)
    .join(",\n        ");
  write(
    file,
    String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/linked-list/${folder}/CodePanel";
import ${visual} from "@/components/linked-list/${folder}/${visual}";
import MicroscopeView from "@/components/linked-list/${folder}/MicroscopeView";
import TracePanel from "@/components/linked-list/${folder}/TracePanel";
import { generateTrace } from "@/components/linked-list/${folder}/generateTrace";

const defaultInputs = ${inputs};
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function parseNums(raw: string) {
  return raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(${args}));
}

export default function ${title.replace(/[^A-Za-z0-9]/g, "")}Page() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Pointer Trace"
      title=${JSON.stringify(title)}
      difficulty="Medium"
      description=${JSON.stringify(`Trace the ${title} pointer algorithm through each mutation.`)}
      complexity="O(n) time"
      defaultInputs={defaultInputs}
      inputFields={[
        ${fields}
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <${visual} step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} ${microscopeMode ? "mode={teachingMode}" : ""} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
`
  );
}

writeLinkedListTracePage("app/linked-list/remove-duplicates-ii/page.tsx", "Remove Duplicates from Sorted List II", "remove-duplicates-ii", { nodes: "1,2,3,3,4,4,5" }, "parseNums(values.nodes)", "LinkedListTrack", false);
writeLinkedListTracePage("app/linked-list/remove-nth/page.tsx", "Remove Nth Node From End of List", "remove-nth", { nodes: "1,2,3,4,5", n: "2" }, "parseNums(values.nodes), Number(values.n) || 1", "LinkedListTrack", false);
writeLinkedListTracePage("app/linked-list/reverse-linked-list-ii/page.tsx", "Reverse Linked List II", "reverse-linked-list-ii", { nodes: "1,2,3,4,5", left: "2", right: "4" }, "parseNums(values.nodes), Number(values.left) || 1, Number(values.right) || 1");
writeLinkedListTracePage("app/linked-list/rotate-list/page.tsx", "Rotate List", "rotate-list", { nodes: "1,2,3,4,5", k: "2" }, "parseNums(values.nodes), Number(values.k) || 0");

write(
  "app/linked-list/add-two-numbers/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import AddArrow from "@/components/linked-list/add-two-numbers/AddArrow";
import AddNode from "@/components/linked-list/add-two-numbers/AddNode";
import AddPointer from "@/components/linked-list/add-two-numbers/AddPointer";
import { generateTrace } from "@/components/linked-list/add-two-numbers/generateTrace";

const defaultInputs = { l1: "2,4,3", l2: "5,6,4" };
const presets = [{ name: "Default", summary: "342 + 465", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.l1, values.l2);
}

function ListRow({ label, values }: { label: string; values: number[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 text-xs uppercase tracking-wider text-cyan-300">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <AddNode value={value} />
          {index < values.length - 1 ? <AddArrow /> : null}
        </div>
      ))}
    </div>
  );
}

export default function AddTwoNumbersPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Digit Carry"
      title="Add Two Numbers"
      difficulty="Medium"
      description="Trace digit-by-digit linked-list addition with carry propagation."
      complexity="O(max(m,n)) time / O(max(m,n)) output"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "l1", label: "l1", placeholder: "2,4,3" },
        { id: "l2", label: "l2", placeholder: "5,6,4" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => {
        const pos1 = step.state.i1 * 90;
        const pos2 = step.state.i2 * 90;
        return (
          <div className="glass-card p-6">
            <div className="relative mb-3 h-12">
              <AddPointer type="p1" position={pos1} />
              <AddPointer type="p2" position={pos2} />
            </div>
            <div className="space-y-3">
              <ListRow label="L1" values={step.state.l1} />
              <ListRow label="L2" values={step.state.l2} />
              <ListRow label="Result" values={step.state.result} />
            </div>
          </div>
        );
      }}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">carry = {step.state.carry}; last sum = {step.state.sum}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (l1 || l2 || carry) {"\n"}  sum = x + y + carry{"\n"}  append(sum % 10){"\n"}  carry = Math.floor(sum / 10){"\n"}</pre>}
    />
  );
}
`
);

write(
  "app/linked-list/cycle/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import Arrow from "@/components/Arrow";
import Node from "@/components/Node";
import Pointer from "@/components/Pointer";
import { generateTrace } from "@/components/linked-list/cycle/generateTrace";

const defaultInputs = { nodes: "1,2,3,4,5", cyclePos: "2" };
const presets = [{ name: "Default", summary: "Cycle at index 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nodes, values.cyclePos);
}

export default function CyclePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Floyd Cycle Detection"
      title="Linked List Cycle"
      difficulty="Easy"
      description="Trace slow and fast pointers until they meet or fast reaches the end."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,4,5" },
        { id: "cyclePos", label: "cyclePos", placeholder: "2" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="glass-card p-6">
          <div className="relative mb-4 h-12">
            <Pointer type="slow" position={step.state.slowIndex * 110} />
            <Pointer type="fast" position={step.state.fastIndex * 110} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {step.state.nodes.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <Node value={value} isCycleNode={step.state.cycleFound && index === step.state.slowIndex} />
                {index < step.state.nodes.length - 1 ? <Arrow /> : step.state.hasCycle ? <Arrow type="cycle" /> : null}
              </div>
            ))}
          </div>
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">slow = {step.state.slowIndex}; fast = {step.state.fastIndex}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (fast && fast.next) {"\n"}  slow = slow.next{"\n"}  fast = fast.next.next{"\n"}  if (slow === fast) return true{"\n"}</pre>}
    />
  );
}
`
);

write(
  "app/linked-list/merge-two-sorted-lists/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import MergeArrow from "@/components/linked-list/merge-two-sorted-lists/MergeArrow";
import MergeNode from "@/components/linked-list/merge-two-sorted-lists/MergeNode";
import MergePointer from "@/components/linked-list/merge-two-sorted-lists/MergePointer";
import { generateTrace } from "@/components/linked-list/merge-two-sorted-lists/generateTrace";

const defaultInputs = { l1: "1,3,5", l2: "2,4,6" };
const presets = [{ name: "Default", summary: "Merge sorted lists", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.l1, values.l2);
}

function Row({ label, values }: { label: string; values: number[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 text-xs uppercase tracking-wider text-cyan-300">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <MergeNode value={value} />
          {index < values.length - 1 ? <MergeArrow /> : null}
        </div>
      ))}
    </div>
  );
}

export default function MergeTwoSortedListsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Merge"
      title="Merge Two Sorted Lists"
      difficulty="Easy"
      description="Trace the smaller-head selection that builds one sorted linked list."
      complexity="O(m+n) time / O(1) pointer space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "l1", label: "l1", placeholder: "1,3,5" }, { id: "l2", label: "l2", placeholder: "2,4,6" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="grid gap-4">
          <div className="glass-card p-5">
            <div className="relative mb-2 h-10"><MergePointer type="p1" position={step.state.i1 * 80} /></div>
            <Row label="List 1" values={step.state.l1} />
          </div>
          <div className="glass-card p-5">
            <div className="relative mb-2 h-10"><MergePointer type="p2" position={step.state.i2 * 80} /></div>
            <Row label="List 2" values={step.state.l2} />
          </div>
          <div className="glass-card p-5"><Row label="Merged" values={step.state.result} /></div>
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">picked = {step.state.pickedValue ?? "none"} from {step.state.pickedFrom ?? "-"}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (l1 && l2) append(smaller head){"\n"}append(remaining list)</pre>}
    />
  );
}
`
);

write(
  "app/linked-list/reverse-k-group/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import MicroscopeView from "@/components/kgroup/MicroscopeView";
import Node3D from "@/components/kgroup/Node3D";
import { generateTrace } from "@/components/linked-list/reverse-k-group/generateTrace";

const defaultInputs = { nodes: "1,2,3,4,5,6", k: "3" };
const presets = [{ name: "Default", summary: "Reverse k groups", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nodes, values.k);
}

export default function ReverseKGroupPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / K-group reversal"
      title="Reverse Nodes in k-Group"
      difficulty="Hard"
      description="Trace scanning, reversing, and reconnecting each complete k-sized group."
      complexity="O(n) time / O(1) extra pointer space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nodes", label: "nodes", placeholder: "1,2,3,4,5,6" }, { id: "k", label: "k", placeholder: "3" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="glass-card flex flex-wrap items-center justify-center gap-6 p-6">
          {step.state.nodes.map((value, index) => {
            const inGroup = index >= step.state.start && index < step.state.end && step.state.stage !== "done";
            return <Node3D key={index} value={value} isInGroup={inGroup} isReversing={step.state.stage === "apply-reverse" && inGroup} />;
          })}
        </div>
      )}
      renderMicroscope={({ step }) => <MicroscopeView chunk={step.state.currentChunk} loopStep={step.state.loopStep} stage={step.state.stage} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">find kth node{"\n"}reverse group{"\n"}reconnect group</pre>}
    />
  );
}
`
);

write(
  "app/math/palindrome-number/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/math/palindrome/CodePanel";
import NumberCanvas from "@/components/math/palindrome/NumberCanvas";
import TracePanel from "@/components/math/palindrome/TracePanel";
import { generateTrace } from "@/components/math/palindrome/generateTrace";

const defaultInputs = { n: "121" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.n));
}

export default function PalindromeNumberPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/math"
      categoryLabel="Math"
      taxonomy="Math / Digit Reversal"
      title="Palindrome Number"
      difficulty="Easy"
      description="Trace half-number reversal and final comparison."
      complexity="O(log n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "n", label: "n", placeholder: "121" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <NumberCanvas step={step} />}
      renderMicroscope={() => null}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel highlight={step.highlight} />}
    />
  );
}
`
);

write(
  "app/math/plus-one/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import ArrayViz from "@/components/math/plus-one/ArrayViz";
import CodePanel from "@/components/math/plus-one/CodePanel";
import TracePanel from "@/components/math/plus-one/TracePanel";
import { generateTrace } from "@/components/math/plus-one/generateTrace";

const defaultInputs = { digits: "1,2,3" };
const presets = [{ name: "Default", summary: "[1,2,4]", values: defaultInputs }];

function parseDigits(raw: string) {
  const digits = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite).map((n) => Math.max(0, Math.min(9, Math.trunc(n))));
  return digits.length ? digits : [1, 2, 3];
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(parseDigits(values.digits)));
}

export default function PlusOnePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/math"
      categoryLabel="Math"
      taxonomy="Math / Carry Propagation"
      title="Plus One"
      difficulty="Easy"
      description="Trace carry propagation from the final digit toward the front."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "digits", label: "digits", placeholder: "1,2,3" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ trace, timeline }) => <ArrayViz trace={trace} cursor={timeline.activeIndex} />}
      renderMicroscope={() => null}
      renderTracePanel={({ trace, timeline }) => <TracePanel trace={trace} cursor={timeline.activeIndex} />}
      renderCodePanel={({ trace, timeline }) => <CodePanel trace={trace} cursor={timeline.activeIndex} />}
    />
  );
}
`
);

write(
  "app/stack/valid-parentheses/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import BracketNode from "../../../components/stack/BracketNode";
import StackBox from "../../../components/stack/StackBox";
import { generateTrace } from "../../../components/stack/valid-parentheses/generateTrace";

const defaultInputs = { expression: "({[]})" };
const presets = [{ name: "Default", summary: "valid", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.expression);
}

export default function ValidParenthesesPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/stack"
      categoryLabel="Stack"
      taxonomy="Stack / Delimiter Matching"
      title="Valid Parentheses"
      difficulty="Easy"
      description="Trace stack pushes and pops while validating balanced brackets."
      complexity="O(n) time / O(n) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "expression", label: "expression", placeholder: "({[]})" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {step.state.expression.split("").map((symbol, index) => {
              let state: "default" | "active" | "processed" | "error" = "default";
              if (index < step.state.idx) state = "processed";
              if (index === step.state.idx && step.state.status === "processing") state = "active";
              if ((step.state.lastAction?.kind === "mismatch" || step.state.lastAction?.kind === "emptyPop") && step.state.lastAction.index === index) state = "error";
              return <BracketNode key={index} symbol={symbol} variant="stream" state={state} />;
            })}
          </div>
          <StackBox stack={step.state.stack} lastAction={step.state.lastAction} />
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">stack size = {step.state.stack.length}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}push openers; match closers against stack top</pre>}
    />
  );
}
`
);

write(
  "app/two-pointers/container-most-water/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "@/components/two-pointers/container-most-water/CodePanel";
import StatsPanel from "@/components/two-pointers/container-most-water/StatsPanel";
import WaterChart from "@/components/two-pointers/container-most-water/WaterChart";
import { generateTrace } from "@/components/two-pointers/container-most-water/generateTrace";

const defaultInputs = { heights: "1,8,6,2,5,4,8,3,7" };
const presets = [{ name: "Default", summary: "max area 49", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.heights);
}

export default function ContainerMostWaterPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Area Optimization"
      title="Container With Most Water"
      difficulty="Medium"
      description="Trace inward pointer movement from the limiting wall while tracking best area."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "heights", label: "heights", placeholder: "1,8,6,2,5,4,8,3,7" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <WaterChart
          heights={step.state.heights}
          left={step.state.left}
          right={step.state.right}
          bestLeft={step.state.bestLeft}
          bestRight={step.state.bestRight}
          maxArea={step.state.maxArea}
          currentArea={step.state.currentArea}
          lastAction={step.state.lastAction}
        />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanel
          heights={step.state.heights}
          left={step.state.left}
          right={step.state.right}
          currentArea={step.state.currentArea}
          maxArea={step.state.maxArea}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <CodePanel activeLine={step.state.activeLine} />}
    />
  );
}
`
);

write(
  "app/two-pointers/is-subsequence/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CharNode, { type CharState } from "@/components/two-pointers/is-subsequence/CharacterBox";
import MicroscopeView from "@/components/two-pointers/is-subsequence/MicroscopeView";
import PointerNode from "@/components/two-pointers/is-subsequence/PointerNode";
import { generateTrace } from "@/components/two-pointers/is-subsequence/generateTrace";

const defaultInputs = { s: "abc", t: "ahbgdc" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.s, values.t);
}

export default function IsSubsequencePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Subsequence Matching"
      title="Is Subsequence"
      difficulty="Easy"
      description="Trace pointer i through s while pointer j scans t."
      complexity="O(|t|) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "s", label: "s", placeholder: "abc" }, { id: "t", label: "t", placeholder: "ahbgdc" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-8">
          {[["s", step.state.s], ["t", step.state.t]].map(([label, text]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
              <div className="flex gap-2">
                {String(text).split("").map((ch, index) => {
                  let state: CharState = "idle";
                  if (label === "s" && step.state.matched[index]) state = "matched";
                  if (label === "s" && index === step.state.i && step.state.status !== "done") state = "active";
                  if (label === "t" && index === step.state.j && step.state.status !== "done") state = "active";
                  if (label === "t" && step.state.lastAction?.kind === "skip" && step.state.lastAction.j === index) state = "skipped";
                  return <CharNode key={index} ch={ch} state={state} />;
                })}
              </div>
              <div className="flex gap-2">
                {String(text).split("").map((_, index) => (
                  <div key={index} className="flex w-10 justify-center">
                    <PointerNode label={label === "s" ? "i" : "j"} active={index === (label === "s" ? step.state.i : step.state.j) && step.state.status !== "done"} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView matchedPrefix={step.state.s.slice(0, step.state.matched.filter(Boolean).length)} remaining={step.state.s.slice(step.state.matched.filter(Boolean).length)} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}if s[i] == t[j], advance both; else advance j</pre>}
    />
  );
}
`
);

write(
  "app/two-pointers/three-sum/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import PointerTag from "@/components/three-sum/PointerTag";
import SumBar from "@/components/three-sum/SumBar";
import ValueNode from "@/components/three-sum/ValueNode";
import { generateTrace } from "@/components/two-pointers/three-sum/generateTrace";

const defaultInputs = { nums: "-4,-1,-1,0,1,2" };
const presets = [{ name: "Default", summary: "two triplets", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function ThreeSumPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Sorted Triplet Search"
      title="3Sum"
      difficulty="Medium"
      description="Trace each pivot and two-pointer sweep that discovers unique zero-sum triplets."
      complexity="O(n^2) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "-4,-1,-1,0,1,2" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => {
        const solution = new Set(step.state.triplets.flatMap((triplet) => triplet.indices));
        const currentA = step.state.i >= 0 ? step.state.nums[step.state.i] : null;
        const currentB = step.state.left >= 0 ? step.state.nums[step.state.left] : null;
        const currentC = step.state.right >= 0 ? step.state.nums[step.state.right] : null;
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {step.state.nums.map((value, index) => (
                <ValueNode key={index} value={value} index={index} isPivot={index === step.state.i} isLeft={index === step.state.left} isRight={index === step.state.right} isInSolution={solution.has(index)} />
              ))}
            </div>
            <div className="flex gap-3">
              {step.state.nums.map((_, index) => (
                <div key={index} className="flex w-14 justify-center">
                  {index === step.state.i ? <PointerTag label="i" /> : null}
                  {index === step.state.left ? <PointerTag label="L" /> : null}
                  {index === step.state.right ? <PointerTag label="R" /> : null}
                </div>
              ))}
            </div>
            <SumBar a={currentA} b={currentB} c={currentC} sum={step.state.currentSum} />
          </div>
        );
      }}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">triplets found = {step.state.triplets.length}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}sort; fix pivot; sweep with L/R</pre>}
    />
  );
}
`
);

write(
  "app/two-pointers/two-sum-sorted/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import ArrayCell from "@/components/two-sum/ArrayBox";
import { generateTrace } from "@/components/two-pointers/two-sum-sorted/generateTrace";

const defaultInputs = { nums: "1,2,3,4,6,8,11", target: "10" };
const presets = [{ name: "Default", summary: "found", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums, values.target);
}

export default function TwoSumSortedPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Sorted Pair Search"
      title="Two Sum II - Input Array Is Sorted"
      difficulty="Medium"
      description="Trace inward pointer movement based on comparing the current sum to target."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "1,2,3,4,6,8,11" }, { id: "target", label: "target", placeholder: "10" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="flex flex-wrap justify-center gap-4">
          {step.state.nums.map((value, index) => {
            let role: "default" | "left" | "right" | "both" | "between" | "discarded" | "solution" = "default";
            const inWindow = index >= step.state.left && index <= step.state.right;
            if (step.state.status === "found" && (index === step.state.left || index === step.state.right)) role = "solution";
            else if (!inWindow) role = "discarded";
            else if (index === step.state.left && index === step.state.right) role = "both";
            else if (index === step.state.left) role = "left";
            else if (index === step.state.right) role = "right";
            else role = "between";
            return <ArrayCell key={index} value={value} role={role} />;
          })}
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">current sum = {step.state.currentSum ?? "none"}; target = {step.state.target}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}if sum too small move left; if too large move right</pre>}
    />
  );
}
`
);

write(
  "app/two-pointers/valid-palindrome/page.tsx",
  String.raw`
"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/two-pointers/valid-palindrome/CodePanel";
import MicroscopeView from "@/components/two-pointers/valid-palindrome/MicroscopeView";
import PalindromeBox from "@/components/two-pointers/valid-palindrome/PalindromeBox";
import { generateTrace } from "@/components/two-pointers/valid-palindrome/generateTrace";

const defaultInputs = { s: "A man, a plan, a canal: Panama" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.s));
}

export default function ValidPalindromePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Normalized Mirror Scan"
      title="Valid Palindrome"
      difficulty="Easy"
      description="Trace normalized character comparisons from both ends toward the center."
      complexity="O(n) time / O(n) normalized buffer"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "s", label: "s", placeholder: "A man, a plan, a canal: Panama", multiline: true, rows: 3 }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <PalindromeBox step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.headline}</div>}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
`
);

console.log("Migrated remaining legacy pages.");
