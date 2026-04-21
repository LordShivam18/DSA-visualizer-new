import GeneSequence from "./GeneSequence";
import MutationPathStrip from "./MutationPathStrip";
import MutationQueue from "./MutationQueue";
import type { MinimumGeneticMutationTraceStep } from "./generateTrace";

export default function MinimumGeneticMutationWorkbench({
  step,
}: {
  step: MinimumGeneticMutationTraceStep;
}) {
  const visitedSet = new Set(step.state.visited);
  const processedSet = new Set(step.state.processed);
  const queueSet = new Set(step.state.queue.map((entry) => entry.gene));
  const highlightIndices = step.pointers.differenceInfo?.indices ?? [];

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Gene BFS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Expand one-character valid mutations layer by layer until the target gene appears
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Cyan marks the gene currently expanding, yellow highlights the
            candidate under comparison, purple marks queued frontier genes, and
            green marks genes whose shortest mutation depth is already locked in.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            Bank: {step.state.bank.length}
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
            Current Gene
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {step.pointers.currentGene ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Candidate
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-yellow-200">
            {step.pointers.candidateGene ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Mutation Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.mutationIndex ?? "--"}
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
          Cyan: current gene
        </span>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]">
          Yellow: candidate under test
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: queued frontier
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: confirmed shortest depth
        </span>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <GeneSequence
              gene={step.pointers.currentGene ?? step.state.startGene}
              label="Current Gene"
              toneClass="border-cyan-400/45 bg-cyan-500/10 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.14)]"
              badges={step.pointers.currentGene ? ["CUR"] : ["START"]}
              highlightIndices={highlightIndices}
              footer="This is the gene currently being expanded from the BFS queue."
            />
            <GeneSequence
              gene={step.pointers.candidateGene ?? step.state.endGene}
              label="Candidate / Target Focus"
              toneClass={
                step.pointers.candidateGene
                  ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.14)]"
                  : "border-rose-400/35 bg-rose-500/8 text-rose-50"
              }
              badges={step.pointers.candidateGene ? ["CHK"] : ["TARGET"]}
              highlightIndices={highlightIndices}
              footer={
                step.pointers.candidateGene
                  ? "Highlighted positions show where this candidate differs from the current gene."
                  : "When no candidate is active, this card stays focused on the target gene."
              }
            />
          </div>

          <div className="rounded-[1.35rem] border border-slate-800/80 bg-[#050916] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-50">Gene Bank</h3>
              <p className="mt-1 text-sm text-slate-400">
                BFS only queues bank genes that differ by exactly one character
                and have not been seen before.
              </p>
            </div>

            {step.state.bank.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-6 text-sm text-slate-500">
                Add genes to the bank to make the mutation graph visible.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {step.state.bank.map((gene) => {
                  const isCurrent = step.pointers.currentGene === gene;
                  const isCandidate = step.pointers.candidateGene === gene;
                  const isQueued = queueSet.has(gene);
                  const isProcessed = processedSet.has(gene);
                  const isVisited = visitedSet.has(gene);
                  const depth =
                    step.state.depths.find((entry) => entry.gene === gene)?.depth ?? null;

                  let toneClass =
                    "border-slate-800/80 bg-slate-950/70 text-slate-50";
                  const badges: string[] = [];

                  if (isVisited) {
                    toneClass =
                      "border-emerald-400/35 bg-emerald-500/10 text-emerald-50";
                    badges.push("SEEN");
                  }

                  if (isQueued) {
                    toneClass =
                      "border-violet-400/35 bg-violet-500/10 text-violet-50";
                    badges.unshift(
                      step.pointers.queueFront === gene ? "FRONT" : "Q"
                    );
                  }

                  if (isProcessed) {
                    toneClass =
                      "border-emerald-400/45 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.14)]";
                    badges.unshift("DONE");
                  }

                  if (isCandidate) {
                    toneClass =
                      "border-yellow-400/55 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.14)]";
                    badges.unshift("CHK");
                  }

                  if (isCurrent) {
                    toneClass =
                      "border-cyan-400/55 bg-cyan-500/12 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.14)]";
                    badges.unshift("CUR");
                  }

                  return (
                    <GeneSequence
                      key={gene}
                      gene={gene}
                      label={depth === null ? "Undiscovered" : `Depth ${depth}`}
                      toneClass={toneClass}
                      badges={badges}
                      highlightIndices={isCandidate ? highlightIndices : []}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <MutationQueue
            queue={step.state.queue}
            activeGene={step.pointers.currentGene}
          />
          <MutationPathStrip path={step.state.path} result={step.state.result} />
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Depth Ledger
        </p>
        {step.state.depths.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            Mutation depths will appear here as soon as BFS discovers genes.
          </div>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {step.state.depths.map((entry) => (
              <div
                key={entry.gene}
                className={`rounded-xl border px-3 py-2 ${
                  step.pointers.currentGene === entry.gene
                    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                    : step.pointers.candidateGene === entry.gene
                    ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">{entry.gene}</span>
                  <span className="font-mono text-sm">{entry.depth}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
