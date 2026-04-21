import KListLane from "./KListLane";
import RoundBracket from "./RoundBracket";
import type { MergeKTraceStep } from "./generateTrace";

function pointerMap(step: MergeKTraceStep) {
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

  add(step.pointers.leftHeadId, "L");
  add(step.pointers.rightHeadId, "R");
  add(step.pointers.mergeTailId, "TAIL");

  return map;
}

export default function MergeKSortedListsWorkbench({
  step,
}: {
  step: MergeKTraceStep;
}) {
  const pointers = pointerMap(step);

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Pairwise Tournament Merge
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Merge the lists in rounds until one sorted winner remains
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan shows the active pair in the current round, yellow marks a list
            that advances without a partner, violet shows the competing runs,
            and green grows the merged winner that moves forward.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Round: {step.state.currentRound + 1}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
            Comparisons: {step.state.comparisons}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Merges: {step.state.mergesCompleted}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Lists
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.workingLists.length}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Pair Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.activePairIndex === null
              ? "-"
              : step.pointers.activePairIndex + 1}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Round Lists
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.nextRoundLists.length}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Winner Length
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.mergedList.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active pair in this round
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: unpaired carry-over
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Violet: current merge inputs
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: merged winner
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_320px]">
        <div className="space-y-4">
          <RoundBracket
            title="Current Round Bracket"
            lists={step.state.workingLists}
            activePairIndex={step.pointers.activePairIndex}
            carryListIndex={step.pointers.carryListIndex}
            roundLabel={`round ${step.state.currentRound + 1}`}
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <KListLane
              title="Left Merge Input"
              tokens={step.state.leftList}
              accent="violet"
              pointerLabels={pointers}
              emptyLabel="No left input selected right now."
            />
            <KListLane
              title="Right Merge Input"
              tokens={step.state.rightList}
              accent="violet"
              pointerLabels={pointers}
              emptyLabel="No right input selected right now."
            />
          </div>

          <KListLane
            title="Merged Winner"
            tokens={step.state.mergedList}
            accent="emerald"
            pointerLabels={pointers}
            emptyLabel="Merged values will appear here as the pair resolves."
          />
        </div>

        <div className="space-y-4">
          <RoundBracket
            title="Next Round Bracket"
            lists={step.state.nextRoundLists}
            activePairIndex={null}
            carryListIndex={null}
            roundLabel={`after round ${step.state.currentRound + 1}`}
          />

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Round recipe
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
                1. Pair nearby lists.
              </div>
              <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
                2. Merge each pair into one winner.
              </div>
              <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
                3. Carry over any unpaired list.
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
                4. Repeat until one list remains.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
