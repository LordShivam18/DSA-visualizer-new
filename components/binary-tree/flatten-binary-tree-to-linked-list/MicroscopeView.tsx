import FlattenChainStrip from "./FlattenChainStrip";
import type { FlattenTraceStep } from "./generateTrace";

type Props = {
  step: FlattenTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: FlattenTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function buildBeginnerFocus(step: FlattenTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "We are just preparing the tree. No pointers have been rewired yet.";
    case "visit":
      return "The algorithm pauses at one node and decides whether its left side needs to be moved into the future linked list.";
    case "pick-left":
      return "The left child is about to become the next node in preorder, so we start looking for the tail of that left side.";
    case "move-predecessor":
      return "predecessor keeps walking right until it reaches the last node of the left subtree.";
    case "stitch-right":
      return "The old right subtree is safely attached after the left subtree so no nodes are lost.";
    case "reroute-right":
      return "Now the current node points right to its old left child, which matches preorder order.";
    case "clear-left":
      return "The left pointer is cleared because the finished list may only use right pointers.";
    case "mark-flat":
      return "This node is now locked into the final flattened prefix and will not need more surgery.";
    case "advance":
      return "current moves along the right chain, which is gradually becoming the answer.";
    case "no-left":
      return "There is no left subtree to move, so this node already fits the final shape.";
    case "done":
      return "Every node now points right to the next preorder node, so the flattening is complete.";
    default:
      return step.explanationBeginner;
  }
}

function buildExpertFocus(step: FlattenTraceStep) {
  if (step.done) {
    return "Invariant satisfied globally: every processed node has left = null, and the full right chain matches preorder in O(n) time with O(1) auxiliary space.";
  }

  const flattened = step.state.flattenedIds.length;
  const total = step.state.targetPreorderIds.length;

  switch (step.actionKind) {
    case "pick-left":
    case "move-predecessor":
    case "stitch-right":
    case "reroute-right":
    case "clear-left":
      return `Local splice phase. The prefix of length ${flattened}/${total} is already valid, and the current rewrite preserves preorder by placing current.left before the preserved original right subtree.`;
    case "mark-flat":
      return `Prefix commit. After this snapshot, ${flattened}/${total} nodes form a correct right-only preorder prefix.`;
    case "advance":
      return "Traversal progresses only through right pointers, which double as the evolving linked-list backbone.";
    case "no-left":
      return "No splice is required because the current node already satisfies the local flatten invariant.";
    default:
      return step.explanationExpert;
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const currentNode = step.state.nodes.find(
    (node) => node.id === step.pointers.currentId
  );
  const predecessorNode = step.state.nodes.find(
    (node) => node.id === step.pointers.predecessorId
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the exact pointer relationships that make the in-place
            preorder splice work.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left Head
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.leftHeadId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Predecessor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {labelOf(step, step.pointers.predecessorId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Flattened Prefix
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.flattenedIds.length}/{step.state.targetPreorderIds.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? buildBeginnerFocus(step)
            : buildExpertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Local Pointer Snapshot
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <span className="font-mono text-cyan-200">current-&gt;left</span>
              <span className="font-mono text-slate-100">
                {labelOf(step, currentNode?.leftId ?? null)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <span className="font-mono text-amber-200">current-&gt;right</span>
              <span className="font-mono text-slate-100">
                {labelOf(step, currentNode?.rightId ?? null)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <span className="font-mono text-yellow-200">
                predecessor-&gt;right
              </span>
              <span className="font-mono text-slate-100">
                {labelOf(step, predecessorNode?.rightId ?? null)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Why This Step Matters
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {mode === "beginner"
              ? "Flattening works because we never lose the old right subtree. We first tuck it behind the tail of the left subtree, then slide the entire left subtree over to the right."
              : "The splice order is critical: preserve current.right on predecessor.right before assigning current.right = current.left, then null out current.left to maintain the output invariant."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Scan Trail
              </p>
              <p className="mt-1 font-mono text-sm text-yellow-200">
                {step.pointers.scanTrailIds.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Live Right Chain
              </p>
              <p className="mt-1 font-mono text-sm text-amber-200">
                {step.state.liveRightChainIds.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <FlattenChainStrip
          title="Predecessor Scan"
          ids={step.pointers.scanTrailIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No predecessor scan is active on this step."
          helperText="When a left subtree exists, predecessor walks its right edge to find the node that should receive the old right subtree."
        />
        <FlattenChainStrip
          title="Flattened Prefix"
          ids={step.state.flattenedIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No node has been locked into the final list yet."
          helperText="These nodes already form the final preorder-linked prefix."
        />
      </div>
    </div>
  );
}
