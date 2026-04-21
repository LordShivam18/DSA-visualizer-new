import LadderQueue from "./LadderQueue";
import WordEdge from "./WordEdge";
import WordNodeCard from "./WordNodeCard";
import WordPathStrip from "./WordPathStrip";
import type {
  WordEdgeRecord,
  WordLadderTraceStep,
  WordNodeRecord,
} from "./generateTrace";

type Point = {
  x: number;
  y: number;
};

function edgeKey(edge: WordEdgeRecord) {
  const [left, right] = [edge.from, edge.to].sort((a, b) =>
    a.localeCompare(b)
  );
  return `${left}::${right}`;
}

function buildAdjacency(edges: WordEdgeRecord[]) {
  const map = new Map<string, string[]>();

  edges.forEach((edge) => {
    const fromList = map.get(edge.from) ?? [];
    fromList.push(edge.to);
    map.set(edge.from, fromList);

    const toList = map.get(edge.to) ?? [];
    toList.push(edge.from);
    map.set(edge.to, toList);
  });

  return map;
}

function buildDisplayLayers(
  nodes: WordNodeRecord[],
  edges: WordEdgeRecord[],
  beginWord: string
) {
  const adjacency = buildAdjacency(edges);
  const distances = new Map<string, number>();
  const queue: string[] = [];

  if (beginWord) {
    queue.push(beginWord);
    distances.set(beginWord, 0);
  }

  while (queue.length > 0) {
    const word = queue.shift();
    if (!word) {
      break;
    }

    const currentDistance = distances.get(word) ?? 0;
    const neighbors = adjacency.get(word) ?? [];

    neighbors.forEach((neighbor) => {
      if (distances.has(neighbor)) {
        return;
      }

      distances.set(neighbor, currentDistance + 1);
      queue.push(neighbor);
    });
  }

  const maxDistance = distances.size === 0 ? 0 : Math.max(...distances.values());
  const layerMap = new Map<string, number>();

  nodes.forEach((node) => {
    layerMap.set(node.word, distances.get(node.word) ?? maxDistance + 1);
  });

  return layerMap;
}

function buildPositionMap(
  nodes: WordNodeRecord[],
  edges: WordEdgeRecord[],
  beginWord: string,
  width: number,
  height: number
) {
  const layers = buildDisplayLayers(nodes, edges, beginWord);
  const map = new Map<string, Point>();
  const groups = new Map<number, WordNodeRecord[]>();

  nodes.forEach((node) => {
    const layer = layers.get(node.word) ?? 0;
    const bucket = groups.get(layer) ?? [];
    bucket.push(node);
    groups.set(layer, bucket);
  });

  const orderedLayers = [...groups.keys()].sort((left, right) => left - right);
  const maxLayer = orderedLayers.length > 1 ? orderedLayers.length - 1 : 1;
  const horizontalPadding = 64;
  const usableWidth = width - horizontalPadding * 2;

  orderedLayers.forEach((layerValue, layerIndex) => {
    const bucket = (groups.get(layerValue) ?? []).sort((left, right) =>
      left.word.localeCompare(right.word)
    );
    const x =
      orderedLayers.length === 1
        ? width / 2
        : horizontalPadding + (layerIndex * usableWidth) / maxLayer;
    const gap = height / (bucket.length + 1);

    bucket.forEach((node, index) => {
      map.set(node.word, {
        x,
        y: gap * (index + 1),
      });
    });
  });

  return map;
}

function edgeMatches(edge: WordEdgeRecord, focus: WordEdgeRecord | null) {
  if (!focus) {
    return false;
  }

  const key = edgeKey(edge);
  const focusKey = edgeKey(focus);
  return key === focusKey;
}

export default function WordLadderWorkbench({
  step,
}: {
  step: WordLadderTraceStep;
}) {
  const width = 620;
  const height = 340;
  const positions = buildPositionMap(
    step.state.nodes,
    step.state.edges,
    step.state.beginWord,
    width,
    height
  );
  const visitedSet = new Set(step.state.visited);
  const processedSet = new Set(step.state.processed);
  const queueSet = new Set(step.state.queue.map((entry) => entry.word));
  const pathSet = new Set(step.state.path);
  const pathEdges = new Set<string>();

  for (let index = 0; index < step.state.path.length - 1; index += 1) {
    pathEdges.add(
      edgeKey({ from: step.state.path[index], to: step.state.path[index + 1] })
    );
  }

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Word Graph BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Traverse one-letter edges until the target word appears in the earliest BFS layer
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the current word, yellow marks the neighbor candidate
            being tested, purple marks the queued frontier, green marks words
            whose shortest layer is already fixed, and red keeps the target easy
            to spot when it is still unresolved.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Nodes: {step.state.nodes.length}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            Queue: {step.state.queue.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Visited: {step.state.visited.length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Word
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {step.pointers.currentWord ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Candidate
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-yellow-200">
            {step.pointers.candidateWord ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Difference Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.differenceIndex ?? "--"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best Answer
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.result ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: current node
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: neighbor check
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued frontier
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: confirmed shortest chain
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: target focus
        </span>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-50">Word Graph</h3>
            <p className="mt-1 text-sm text-slate-400">
              Each edge connects two words that differ by exactly one letter.
            </p>
          </div>

          <div
            className="relative mx-auto overflow-hidden rounded-[1.2rem] border border-slate-800/80 bg-slate-950/50"
            style={{ width, height }}
          >
            <svg className="absolute inset-0 h-full w-full">
              {step.state.edges.map((edge) => {
                const source = positions.get(edge.from);
                const target = positions.get(edge.to);
                if (!source || !target) {
                  return null;
                }

                const isActive = edgeMatches(edge, step.pointers.edgeFocus);
                const isPathEdge = pathEdges.has(edgeKey(edge));

                return (
                  <WordEdge
                    key={edgeKey(edge)}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={
                      isActive
                        ? "#facc15"
                        : isPathEdge
                        ? "#34d399"
                        : "#334155"
                    }
                    width={isActive ? 3.4 : isPathEdge ? 3 : 2.2}
                    opacity={isActive ? 0.95 : isPathEdge ? 0.9 : 0.72}
                  />
                );
              })}
            </svg>

            {step.state.nodes.map((node) => {
              const position = positions.get(node.word);
              if (!position) {
                return null;
              }

              const isCurrent = step.pointers.currentWord === node.word;
              const isCandidate = step.pointers.candidateWord === node.word;
              const isQueued = queueSet.has(node.word);
              const isProcessed = processedSet.has(node.word);
              const isVisited = visitedSet.has(node.word);
              const onPath = pathSet.has(node.word);
              const badges: string[] = [];
              let toneClass =
                "border-slate-700/80 bg-slate-900/80 text-slate-100";

              if (node.kind === "begin") {
                badges.push("BEGIN");
              } else if (node.kind === "end") {
                badges.push("END");
                toneClass =
                  "border-rose-400/40 bg-rose-500/10 text-rose-50 shadow-[0_0_20px_rgba(251,113,133,0.12)]";
              }

              if (!node.inWordList && node.kind === "end") {
                badges.push("MISSING");
                toneClass =
                  "border-dashed border-rose-400/45 bg-rose-500/8 text-rose-100";
              }

              if (isVisited) {
                toneClass =
                  "border-emerald-400/35 bg-emerald-500/10 text-emerald-50";
                badges.push("SEEN");
              }

              if (isQueued) {
                toneClass =
                  "border-violet-400/45 bg-violet-500/12 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.14)]";
                badges.unshift(
                  step.pointers.queueFront === node.word ? "FRONT" : "Q"
                );
              }

              if (isProcessed) {
                toneClass =
                  "border-emerald-400/45 bg-emerald-500/12 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.16)]";
                badges.unshift("DONE");
              }

              if (onPath && step.done && step.state.result !== 0) {
                toneClass =
                  "border-emerald-400/60 bg-emerald-500/16 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.18)]";
                badges.unshift("PATH");
              }

              if (isCandidate) {
                toneClass =
                  "border-yellow-400/60 bg-yellow-500/14 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.18)]";
                badges.unshift("CHK");
              }

              if (isCurrent) {
                toneClass =
                  "border-cyan-400/65 bg-cyan-500/16 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.2)]";
                badges.unshift("CUR");
              }

              return (
                <WordNodeCard
                  key={node.word}
                  x={position.x}
                  y={position.y}
                  label={node.word}
                  caption={node.kind === "bank" ? "dictionary" : node.kind}
                  toneClass={toneClass}
                  badges={badges}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <LadderQueue
            queue={step.state.queue}
            activeWord={step.pointers.currentWord}
          />
          <WordPathStrip path={step.state.path} result={step.state.result} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Depth Ledger
          </p>
          {step.state.depths.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              BFS depths will appear here as soon as words are discovered.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {step.state.depths.map((entry) => (
                <div
                  key={entry.word}
                  className={`rounded-xl border px-3 py-2 ${
                    step.pointers.currentWord === entry.word
                      ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                      : step.pointers.candidateWord === entry.word
                      ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm">{entry.word}</span>
                    <span className="font-mono text-sm">{entry.depth}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Dictionary Snapshot
          </p>
          {step.state.wordList.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              Add dictionary words to build the ladder graph.
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {step.state.wordList.map((word) => (
                <span
                  key={word}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                    step.pointers.candidateWord === word
                      ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                      : visitedSet.has(word)
                      ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
