import RangeArrayCell from "./RangeArrayCell";
import { type RangeSearchTraceStep } from "./generateTrace";

type Props = {
  step: RangeSearchTraceStep;
};

export default function RangeSearchVisualizer({ step }: Props) {
  const finalStart = step.state.result?.[0] ?? -1;
  const finalEnd = step.state.result?.[1] ?? -1;

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            <h2 className="text-lg font-semibold text-slate-50">
              Boundary Search Field
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            The first pass hunts the left edge of the target block. The second
            pass hunts the right edge.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
            Phase {step.state.phase}
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-200">
            Mid {step.state.mid ?? "none"}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
            First {step.state.firstCandidate ?? "none"}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-200">
            Last {step.state.lastCandidate ?? "none"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        {step.state.nums.map((value, index) => (
          <RangeArrayCell
            key={`${index}-${value}`}
            index={index}
            value={value}
            activeWindow={index >= step.state.left && index <= step.state.right}
            isLeft={index === step.state.left}
            isMid={index === step.state.mid}
            isRight={index === step.state.right}
            isFirstCandidate={index === step.state.firstCandidate}
            isLastCandidate={index === step.state.lastCandidate}
            inFinalRange={
              step.done &&
              finalStart !== -1 &&
              finalEnd !== -1 &&
              index >= finalStart &&
              index <= finalEnd
            }
          />
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Current Pass
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {step.state.phase === "first"
              ? "This pass keeps squeezing left when it sees the target, trying to prove the earliest matching index."
              : step.state.phase === "last"
              ? "This pass keeps squeezing right when it sees the target, trying to prove the latest matching index."
              : "Both passes are complete, so the final interval is known."}
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Range Status
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {step.state.result === null
              ? "The final answer is still being assembled from the two boundary searches."
              : step.state.result[0] === -1
              ? "No target was found during the first pass, so the range is [-1, -1]."
              : `The confirmed target block spans from index ${step.state.result[0]} to ${step.state.result[1]}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
