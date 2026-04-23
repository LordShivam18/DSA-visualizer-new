import HeapBucket from "./HeapBucket";
import StreamValueChip from "./StreamValueChip";
import type { MedianStreamTraceStep } from "./generateTrace";

export default function MedianStreamWorkbench({
  step,
}: {
  step: MedianStreamTraceStep;
}) {
  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Heap / Streaming Median / Balanced Halves
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Two heaps keep the middle visible at all times
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The lower max-heap stores the smaller half, the upper min-heap
            stores the larger half, and rebalancing keeps the split centered.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            lower {step.state.lowerHeap.length}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            upper {step.state.upperHeap.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            last median {step.state.lastMedian ?? "none"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Op
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentOpIndex !== null
              ? step.state.currentOpIndex + 1
              : "done"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Last Added
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.lastAdded ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Lower Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.lowerHeap[0] ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Upper Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.upperHeap[0] ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: active operation or moving heap node
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: lower max-heap root
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: upper min-heap root
        </span>
      </div>

      <div className="mt-6 rounded-[1.3rem] border border-slate-800/80 bg-[#050916] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Operation Timeline
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {step.state.operations.map((operation, index) => (
            <StreamValueChip
              key={`${operation.label}-${index}`}
              operation={operation}
              active={step.state.currentOpIndex === index}
              output={step.state.outputs[index]}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <HeapBucket
          title="Lower Half"
          subtitle="Max-heap root is the biggest low-side value"
          heap={step.state.lowerHeap}
          side="lower"
          activeIndex={step.pointers.heapSide === "lower" ? step.pointers.lowerIndex : null}
          role="max"
        />
        <HeapBucket
          title="Upper Half"
          subtitle="Min-heap root is the smallest high-side value"
          heap={step.state.upperHeap}
          side="upper"
          activeIndex={step.pointers.heapSide === "upper" ? step.pointers.upperIndex : null}
          role="min"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Balance Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The lower heap is allowed to have exactly one more element than the
            upper heap. That makes the median either the lower root alone or
            the average of both roots.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Output Ledger
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {step.state.outputs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                No operations have finished yet.
              </div>
            ) : (
              step.state.outputs.map((value, index) => (
                <div
                  key={`out-${index}`}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    value === null
                      ? "border-slate-800/80 bg-slate-950/70 text-slate-400"
                      : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                  }`}
                >
                  {value === null ? "null" : value}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
