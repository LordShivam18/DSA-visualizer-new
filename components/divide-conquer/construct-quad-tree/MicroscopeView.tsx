import {
  formatRegion,
  type Mode,
  type QuadTreeTraceStep,
} from "./generateTrace";

function beginnerText(step: QuadTreeTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "The whole grid starts as one big square. The algorithm only cuts deeper when that square is mixed.";
    case "enter-region":
      return "We are looking at one square chunk of the grid to decide whether one node can represent it.";
    case "inspect-region":
      return "The region is checked for uniformity. Matching cells become one leaf, mixed cells force a split.";
    case "create-leaf":
      return "Because every cell matched, one leaf node now stands for the whole square.";
    case "split-region":
      return "This square contains both 0 and 1, so it needs four children instead of one leaf.";
    case "recurse-child":
      return "The algorithm is diving into one quadrant to solve that smaller square next.";
    case "return-node":
      return "All four child quadrants are ready, so the parent region is fully represented now.";
    case "invalid":
      return "The board shape must support equal 4-way splits each time, otherwise the quad-tree rules do not fit.";
    default:
      return "The finished tree is just a compressed view of the same grid.";
  }
}

function expertText(step: QuadTreeTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "Construction starts from a single root region and recursively applies the same compression predicate to subregions.";
    case "enter-region":
      return "The frame invariant is: return a quad-tree node that exactly represents this square subgrid.";
    case "inspect-region":
      return "Uniformity is the key predicate. If it fails, the region must recurse on equal quadrants.";
    case "create-leaf":
      return "A uniform region compresses into one leaf with val equal to the shared cell value.";
    case "split-region":
      return "A non-leaf node exists solely to route to four quadrant children; its val is semantically irrelevant when isLeaf is false.";
    case "recurse-child":
      return "The algorithm maintains deterministic child order: top-left, top-right, bottom-left, bottom-right.";
    case "return-node":
      return "The parent node becomes valid only after all four child pointers are assigned.";
    case "invalid":
      return "The classical LeetCode formulation assumes equal quartering, which requires a power-of-two square dimension.";
    default:
      return "The serialized output is a breadth-first listing of [isLeaf, val] pairs from the constructed tree.";
  }
}

export default function MicroscopeView({
  step,
  mode,
}: {
  step: QuadTreeTraceStep;
  mode: Mode;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on the compression rule behind each region decision.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Action Kind
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-200">
            {step.actionKind}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Region
          </p>
          <p className="mt-2 text-sm font-semibold text-cyan-200">
            {formatRegion(step.pointers.activeRegion)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Child Preview
          </p>
          <p className="mt-2 text-sm font-semibold text-yellow-200">
            {step.pointers.childQuadrant ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Uniform Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.uniformValue ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "Plain-English View" : "Invariant View"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner" ? beginnerText(step) : expertText(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Compression recipe
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
              1. Inspect one square region.
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
              2. If uniform, return a leaf.
            </div>
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
              3. Otherwise split into four equal quadrants.
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
              4. Return an internal node with four children.
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Serialization hint
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The final output is not the grid again. It is a level-order view of
            the tree using pairs of <span className="text-cyan-200">[isLeaf, val]</span>.
            That is why the tree panel and output panel mirror each other.
          </p>
        </div>
      </div>
    </div>
  );
}
