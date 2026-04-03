"use client";

import { useState } from "react";

// ✅ Correct imports (matching your actual components)
import ModeToggleBT, { ModeBT } from "@/components/binary-tree/max-depth/ModeToggleBT";
import TreeView, {
  TreeNodeMeta,
  TREE_NODES,
  NODES_BY_ID,
  TREE_STRUCTURE,
} from "@/components/binary-tree/max-depth/TreeView";
import StatsPanelBT from "@/components/binary-tree/max-depth/StatsPanelBT";
import CodePanelBT from "@/components/binary-tree/max-depth/CodePanelBT";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

type Status = "ready" | "running" | "done";

type LastAction =
  | {
      kind: "start-level";
      level: number;
      queueSnapshot: string[];
    }
  | {
      kind: "visit-node";
      nodeId: string;
      level: number;
      added: string[];
      queueSnapshot: string[];
    }
  | {
      kind: "done";
      depth: number;
    }
  | null;

const ROOT_ID = "root";
const MAX_THEORETICAL_DEPTH = 3;

export default function MaxDepthBinaryTreePage() {
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<ModeBT>("beginner");

  const [depth, setDepth] = useState(0);
  const [queue, setQueue] = useState<string[]>([ROOT_ID]);
  const [levelRemaining, setLevelRemaining] = useState(0);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<LastAction>(null);

  function reset() {
    setStatus("ready");
    setDepth(0);
    setQueue([ROOT_ID]);
    setLevelRemaining(0);
    setCurrentId(null);
    setVisited([]);
    setLastAction(null);
  }

  function step() {
    if (status === "done") return;

    if (status === "ready") {
      setStatus("running");
      setDepth(1);
      setLevelRemaining(queue.length);
      setCurrentId(null);
      setLastAction({
        kind: "start-level",
        level: 1,
        queueSnapshot: [...queue],
      });
      return;
    }

    if (levelRemaining === 0) {
      if (queue.length === 0) {
        setStatus("done");
        setCurrentId(null);
        setLastAction({
          kind: "done",
          depth,
        });
        return;
      } else {
        const newDepth = depth + 1;
        setDepth(newDepth);
        setLevelRemaining(queue.length);
        setCurrentId(null);
        setLastAction({
          kind: "start-level",
          level: newDepth,
          queueSnapshot: [...queue],
        });
        return;
      }
    }

    const nodeId = queue[0];
    const rest = queue.slice(1);
    const children: string[] = [];

    const struct = TREE_STRUCTURE[nodeId];
    if (struct?.left) children.push(struct.left);
    if (struct?.right) children.push(struct.right);

    const newQueue = [...rest, ...children];

    setQueue(newQueue);
    setLevelRemaining(levelRemaining - 1);
    setCurrentId(nodeId);
    setVisited((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
    setLastAction({
      kind: "visit-node",
      nodeId,
      level: depth,
      added: children,
      queueSnapshot: newQueue,
    });
  }

  function activeCodeLine(): number {
    if (status === "ready") return 2;
    if (!lastAction) return 5;

    if (lastAction.kind === "start-level") return 6;

    if (lastAction.kind === "visit-node") {
      if (lastAction.added.length === 0) return 10;
      if (lastAction.added.length === 1) return 11;
      return 12;
    }

    if (lastAction.kind === "done") return 15;

    return 5;
  }

  function explanation(): string {
    if (status === "ready") {
      return mode === "beginner"
        ? "We’ll walk the tree level by level using a queue. Each layer of nodes we fully process adds +1 to the depth."
        : "Compute the height using a BFS traversal. Each complete frontier represents one full level.";
    }

    if (!lastAction) return "Click Step to advance the BFS.";

    if (lastAction.kind === "start-level") {
      return mode === "beginner"
        ? `We are starting level ${lastAction.level}. All nodes currently in the queue belong to this depth.`
        : `Queue before this level: [${lastAction.queueSnapshot
            .map((id) => NODES_BY_ID[id]?.label)
            .join(", ")}].`;
    }

    if (lastAction.kind === "visit-node") {
      const node = NODES_BY_ID[lastAction.nodeId];
      const addedLabels = lastAction.added
        .map((id) => NODES_BY_ID[id]?.label)
        .join(", ");

      if (mode === "beginner") {
        if (lastAction.added.length === 0)
          return `Node ${node.label} has no children, so nothing new is added to the queue.`;
        return `We visit node ${node.label}. Its children (${addedLabels}) are added to the queue.`;
      }

      return `Visited ${node.label}. Frontier updated: [${lastAction.queueSnapshot
        .map((id) => NODES_BY_ID[id]?.label)
        .join(", ")}].`;
    }

    if (lastAction.kind === "done") {
      return mode === "beginner"
        ? `Traversal completed — maximum depth is ${lastAction.depth}.`
        : `BFS ended when queue emptied. Depth = ${lastAction.depth}.`;
    }

    return "";
  }

  const maxTheoreticalDepth: number = 3;
  const depthPercent =
    maxTheoreticalDepth === 0
      ? 0
      : Math.min(1, depth / maxTheoreticalDepth);

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-8">
      <div className="w-full max-w-3xl"><BackButton href="/binary-tree" label="Binary Tree" /></div>
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]">
            Maximum Depth
          </span>{" "}
          of{" "}
          <span className="text-violet-400 drop-shadow-[0_0_18px_rgba(167,139,250,0.9)]">
            Binary Tree
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Neon visualization of computing the height of a binary tree via BFS.
        </p>
      </header>

      <ModeToggleBT mode={mode} onChange={setMode} />

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-1">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          Nodes:{" "}
          <span className="text-cyan-300">
            {TREE_NODES.map((n) => n.label).join(", ")}
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          Current depth: <span className="text-emerald-300">{depth}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          Queue:{" "}
          <span className="text-violet-300">
            {queue.length === 0
              ? "∅"
              : queue.map((id) => NODES_BY_ID[id]?.label).join(", ")}
          </span>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            status === "done"
              ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
              : status === "running"
              ? "border-cyan-500/60 text-cyan-300 bg-cyan-500/10"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status:{" "}
          {status === "ready"
            ? "Ready"
            : status === "running"
            ? "Running"
            : "Done"}
        </div>
      </div>

      <div className="w-full max-w-4xl flex items-center gap-3 mt-2">
        <div className="flex flex-col items-center w-16">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1">
            Depth
          </span>
          <div className="relative w-2 h-28 md:h-32 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-emerald-400 via-cyan-400 to-violet-400 shadow-[0_0_24px_rgba(52,211,153,0.9)] transition-all duration-500"
              style={{ height: `${depthPercent * 100}%` }}
            />
          </div>
          <span className="mt-1 text-xs font-mono text-emerald-300">{depth}</span>
        </div>

        <div className="flex-1 flex flex-col gap-5">
          <TreeView currentId={currentId} queue={queue} visited={visited} mode={mode} />

          <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-4 text-sm text-slate-200 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
            {explanation()}
          </div>

          <section className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-4">
            <StatsPanelBT depth={depth} queue={queue} currentId={currentId} mode={mode} />
            <CodePanelBT activeLine={activeCodeLine()} mode={mode} />
          </section>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400
                     text-slate-950
                     hover:shadow-[0_0_32px_rgba(56,189,248,0.9)]
                     disabled:bg-slate-700 disabled:text-slate-300
                     transition-all duration-200"
        >
          {status === "done" ? "Completed ✅" : "Step →"}
        </button>

        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-900/90 border border-slate-700
                     hover:bg-slate-800 hover:border-cyan-500
                     hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]
                     transition-all duration-200"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={status === "done" ? `Max depth = ${depth}` : null}
        success={status === "done" ? true : null} stepCount={0} complexity="O(n)" visible={status === "done"} />
    </div>
  );
}
