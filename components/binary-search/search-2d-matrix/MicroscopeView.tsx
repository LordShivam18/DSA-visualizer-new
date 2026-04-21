import { formatCoord, type MatrixSearchTraceStep } from "./generateTrace";

type Props = {
  step: MatrixSearchTraceStep;
  mode: "beginner" | "expert";
};

function buildFocus(step: MatrixSearchTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    return step.explanationBeginner;
  }

  return step.explanationExpert;
}

export default function MicroscopeView({ step, mode }: Props) {
  const windowSize =
    step.state.valid && step.state.left <= step.state.right
      ? step.state.right - step.state.left + 1
      : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            See how one flat midpoint turns back into a real matrix cell.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.left ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Mid
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.mid ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Right
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.right ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Matrix Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatCoord(step.pointers.cell)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "Simple Explanation" : "Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {buildFocus(step, mode)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Index Mapping
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Flat index{" "}
            <span className="font-mono text-yellow-200">
              {step.state.mid ?? "none"}
            </span>{" "}
            becomes row{" "}
            <span className="font-mono text-cyan-200">
              {step.state.midCoord?.row ?? "none"}
            </span>{" "}
            and col{" "}
            <span className="font-mono text-violet-200">
              {step.state.midCoord?.col ?? "none"}
            </span>
            .
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Search Window
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Width
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">{windowSize}</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Mid Value
              </p>
              <p className="mt-1 font-mono text-sm text-yellow-200">
                {step.state.midValue ?? "none"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Target
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.target ?? "invalid"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
