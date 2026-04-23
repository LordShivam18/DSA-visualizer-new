import ProjectCard from "./ProjectCard";
import ProjectHeapPanel from "./ProjectHeapPanel";
import type { IPOTraceStep } from "./generateTrace";

export default function IPOWorkbench({ step }: { step: IPOTraceStep }) {
  const heapIds = new Set(step.state.heap.map((project) => project.id));
  const selectedIds = new Set(step.state.selectedProjects.map((project) => project.id));

  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Heap / Greedy Capital Growth
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Unlock by capital, choose by profit
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            The sorted project rail answers &quot;what can I afford?&quot; and the
            max-heap answers &quot;which affordable project pays best right now?&quot;
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-100">
            capital {step.state.currentCapital}
          </span>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-100">
            round {step.state.round || 0}
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            chosen {step.state.selectedProjects.length}/{step.state.k}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Capital
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentCapital}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Last Unlocked
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.lastUnlocked ? `P${step.state.lastUnlocked.id}` : "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Last Chosen
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.lastSelected ? `P${step.state.lastSelected.id}` : "none"}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.heap.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
          Cyan: project being examined
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
          Purple: affordable and waiting in heap
        </span>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
          Green: selected already
        </span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]">
          Red: still locked by capital
        </span>
      </div>

      <div className="mt-6 rounded-[1.3rem] border border-slate-800/80 bg-[#050916] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Capital-Sorted Project Rail
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {step.state.sortedProjects.map((project, index) => {
            const isCurrent =
              step.state.currentProject?.id === project.id ||
              step.pointers.sortedIndex === index;

            let tone: "locked" | "heap" | "selected" | "current" | "idle" = "idle";
            let label = "idle";

            if (selectedIds.has(project.id)) {
              tone = "selected";
              label = "taken";
            } else if (isCurrent) {
              tone = "current";
              label = "focus";
            } else if (heapIds.has(project.id)) {
              tone = "heap";
              label = "ready";
            } else if (project.capital > step.state.currentCapital) {
              tone = "locked";
              label = "locked";
            }

            return (
              <ProjectCard
                key={project.id}
                project={project}
                tone={tone}
                label={label}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <ProjectHeapPanel
          heap={step.state.heap}
          heapIndex={step.pointers.heapIndex}
          compareIndex={step.pointers.compareIndex}
          chosenProjectId={step.pointers.chosenProjectId}
        />

        <div className="space-y-4">
          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Selected Track
            </p>
            {step.state.selectedProjects.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
                No project has been completed yet.
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {step.state.selectedProjects.map((project, index) => (
                  <div
                    key={`${project.id}-${index}`}
                    className="rounded-xl border border-emerald-400/45 bg-emerald-500/10 px-3 py-2 text-emerald-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Round {index + 1}</span>
                      <span className="font-mono text-sm">
                        P{project.id} (+{project.profit})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Unlock Pointer
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Projects before index <span className="text-cyan-200">{step.state.nextProjectIndex}</span>{" "}
              have already been considered for affordability. New capital only
              moves this pointer forward, never backward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
