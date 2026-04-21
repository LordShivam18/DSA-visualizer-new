import CallStackRail from "./CallStackRail";
import LinkedListLane from "./LinkedListLane";
import type { SortListTraceStep } from "./generateTrace";

function pointerMap(step: SortListTraceStep) {
  const map: Record<string, string[]> = {};

  function add(id: string | null, label: string) {
    if (!id) {
      return;
    }

    if (!map[id]) {
      map[id] = [];
    }

    map[id].push(label);
  }

  add(step.pointers.slowId, "SLOW");
  add(step.pointers.fastId, "FAST");
  add(step.pointers.leftHeadId, "L");
  add(step.pointers.rightHeadId, "R");
  add(step.pointers.mergeTailId, "TAIL");

  return map;
}

export default function SortListWorkbench({
  step,
}: {
  step: SortListTraceStep;
}) {
  const pointers = pointerMap(step);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Linked-List Merge Sort
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Split the list, sort the halves, then merge them back
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Yellow tracks slow and fast pointer splitting, cyan highlights the
            active segment, violet shows sorted child runs entering a merge, and
            green marks nodes already placed into the merged output.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Active Run: {step.pointers.activeLabel ?? "none"}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
            Comparisons: {step.state.comparisons}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Merges: {step.state.mergeCount}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Original Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.original.length}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Split Count
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.splitCount}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Merge Output
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.mergedSegment.length}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Resolved Runs
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.resolvedSegments.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: slow / fast split
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active segment
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Violet: merge inputs
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: merged output
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_300px]">
        <div className="space-y-4">
          <LinkedListLane
            title="Original List"
            tokens={step.state.original}
            accent="cyan"
            pointerLabels={pointers}
            emptyLabel="The original list is empty."
          />

          <LinkedListLane
            title={`Active Segment${step.pointers.activeLabel ? ` • ${step.pointers.activeLabel}` : ""}`}
            tokens={step.state.activeSegment}
            accent="yellow"
            pointerLabels={pointers}
            emptyLabel="No active segment right now."
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <LinkedListLane
              title="Left Run"
              tokens={step.state.leftSegment}
              accent="violet"
              pointerLabels={pointers}
              emptyLabel="Left half not ready yet."
            />
            <LinkedListLane
              title="Right Run"
              tokens={step.state.rightSegment}
              accent="violet"
              pointerLabels={pointers}
              emptyLabel="Right half not ready yet."
            />
          </div>

          <LinkedListLane
            title="Merged Output"
            tokens={step.state.mergedSegment}
            accent="emerald"
            pointerLabels={pointers}
            emptyLabel="Merged nodes will appear here as the tail grows."
          />
        </div>

        <CallStackRail
          frames={step.state.frames}
          resolvedSegments={step.state.resolvedSegments}
          activeLabel={step.pointers.activeLabel}
        />
      </div>
    </section>
  );
}
