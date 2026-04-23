import CandidateHeap from "./CandidateHeap";
import PairMatrixCell from "./PairMatrixCell";
import type { KSmallestPairsTraceStep } from "./generateTrace";

export default function SmallestPairsWorkbench({
  step,
}: {
  step: KSmallestPairsTraceStep;
}) {
  const heapIds = new Set(step.state.heap.map((candidate) => candidate.id));
  const resultIds = new Set(step.state.resultPairs.map((candidate) => candidate.id));
  const currentId = step.state.currentPair?.id ?? null;
  const nextId =
    step.pointers.row !== null &&
    step.pointers.nextCol !== null &&
    step.pointers.row < step.state.nums1.length
      ? `${step.pointers.row}-${step.pointers.nextCol}`
      : null;

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Heap / Monotone Pair Frontier
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Expand only the next candidate in each row
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The grid is sorted both by rows and columns, so the heap only needs
            one active candidate per row to reveal the next smallest pair.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            k = {step.state.k}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            heap {step.state.heap.length}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            output {step.state.resultPairs.length}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Row
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.row ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Col
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.col ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Col
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.nextCol ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.heap[0]?.sum ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: pair under discussion
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: waiting in heap
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: already output
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: next pair in same row
        </span>
      </div>

      <div className="mt-6 rounded-[1.3rem] border border-slate-800/80 bg-[#050916] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Pair Sum Matrix
        </p>
        <div className="mt-4 overflow-auto">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `120px repeat(${step.state.nums2.length}, minmax(92px, 1fr))`,
            }}
          >
            <div className="rounded-[1rem] border border-slate-800/80 bg-slate-950/70 px-3 py-3 text-center text-xs uppercase tracking-[0.18em] text-slate-500">
              nums1 / nums2
            </div>
            {step.state.nums2.map((value, index) => (
              <div
                key={`col-${index}`}
                className="rounded-[1rem] border border-slate-800/80 bg-slate-950/70 px-3 py-3 text-center text-sm font-semibold text-slate-200"
              >
                nums2[{index}] = {value}
              </div>
            ))}

            {step.state.nums1.map((leftValue, i) => (
              <div key={`row-${i}`} className="contents">
                <div className="rounded-[1rem] border border-slate-800/80 bg-slate-950/70 px-3 py-3 text-sm font-semibold text-slate-200">
                  nums1[{i}] = {leftValue}
                </div>
                {step.state.nums2.map((rightValue, j) => {
                  const id = `${i}-${j}`;
                  let tone: "idle" | "heap" | "result" | "current" | "next" = "idle";

                  if (resultIds.has(id)) {
                    tone = "result";
                  } else if (id === nextId) {
                    tone = "next";
                  } else if (id === currentId) {
                    tone = "current";
                  } else if (heapIds.has(id)) {
                    tone = "heap";
                  }

                  return (
                    <PairMatrixCell
                      key={id}
                      leftValue={leftValue}
                      rightValue={rightValue}
                      sum={leftValue + rightValue}
                      tone={tone}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <CandidateHeap
          heap={step.state.heap}
          heapIndex={step.pointers.heapIndex}
          compareIndex={step.pointers.compareIndex}
        />

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Output Strip
            </p>
            {step.state.resultPairs.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                No answer pairs have been emitted yet.
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {step.state.resultPairs.map((candidate, index) => (
                  <div
                    key={`${candidate.id}-${index}`}
                    className="rounded-xl border border-emerald-400/45 bg-emerald-500/10 px-3 py-2 text-emerald-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">#{index + 1}</span>
                      <span className="font-mono text-sm">
                        [{candidate.leftValue}, {candidate.rightValue}] = {candidate.sum}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Frontier Rule
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Each row contributes at most one live frontier node. After
              popping (i, j), only (i, j + 1) can become that row&apos;s next best
              unseen candidate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
