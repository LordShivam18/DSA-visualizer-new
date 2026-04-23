import InputNumberCell from "./InputNumberCell";
import MinHeapTree from "./MinHeapTree";
import type { KthLargestTraceStep } from "./generateTrace";

export default function KthLargestWorkbench({
  step,
}: {
  step: KthLargestTraceStep;
}) {
  const heapBySource = new Map(
    step.state.heap.map((entry) => [entry.sourceIndex, entry])
  );
  const removedIndex = step.state.lastRemoved?.sourceIndex ?? null;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Heap / Streaming Order Statistic
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Keep only the top-k survivors in a min-heap
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The heap stays small on purpose. Whenever it grows past k, the root
            is the weakest survivor and gets ejected.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            k = {step.state.k}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            processed {step.state.processedIndices.length}/{step.state.nums.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            root {step.state.heapTop?.value ?? "none"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.scan ?? "done"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.currentValue ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.heap.length}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best Answer
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.answer ?? step.state.heapTop?.value ?? "building"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: value under inspection
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: still inside top-k
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: evicted after overflow
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: heap comparison target
        </span>
      </div>

      <div className="mt-6 rounded-[1.3rem] border border-slate-800/80 bg-[#050916] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Input Stream
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {step.state.nums.map((value, index) => (
            <InputNumberCell
              key={`${index}-${value}`}
              index={index}
              value={value}
              current={step.pointers.scan === index}
              inHeap={heapBySource.has(index)}
              removed={removedIndex === index}
              processed={step.state.processedIndices.includes(index)}
              heapEntry={heapBySource.get(index)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <MinHeapTree
          heap={step.state.heap}
          heapIndex={step.pointers.heapIndex}
          compareIndex={step.pointers.compareIndex}
          topIndex={step.pointers.topIndex}
        />

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Survivor Rule
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The heap never stores more than <span className="text-cyan-200">k</span>{" "}
              numbers. That means any value below the root is already too small
              to become the kth largest answer.
            </p>
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Live Heap Snapshot
            </p>
            {step.state.heap.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                No survivors are stored yet.
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {step.state.heap.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`rounded-xl border px-3 py-2 ${
                      index === 0
                        ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                        : index === step.pointers.heapIndex
                        ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                        : index === step.pointers.compareIndex
                        ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                        : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">heap[{index}]</span>
                      <span className="font-mono text-sm">
                        {entry.value} from nums[{entry.sourceIndex}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Last Ejected
            </p>
            <p className="mt-3 text-2xl font-semibold text-rose-200">
              {step.state.lastRemoved?.value ?? "none"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              If the heap overflows, this is the smallest survivor that gets
              removed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
