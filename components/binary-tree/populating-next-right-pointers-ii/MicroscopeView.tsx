import LevelChainStrip from "./LevelChainStrip";
import type { ConnectTraceStep } from "./generateTrace";

type Props = {
  step: ConnectTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: ConnectTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the moving pointers that make the O(1)-space trick work.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Level Start
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.levelStartId)}
          </p>
        </div>

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
            Tail
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {labelOf(step, step.pointers.tailId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Head
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.nextLevelHeadId)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <LevelChainStrip
          title="Current Level"
          ids={step.state.currentLevelIds}
          nodes={step.state.nodes}
          accent="purple"
          emptyLabel="No level is being scanned."
        />
        <LevelChainStrip
          title="Next Level"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="green"
          emptyLabel="The next level chain is still empty."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "Once a level is already connected, we can walk sideways with current.next and build the following level without a queue."
          : "tail always points to the last child in the next frontier, and levelStart is reassigned to dummy.next after each completed level."}
      </div>
    </div>
  );
}
