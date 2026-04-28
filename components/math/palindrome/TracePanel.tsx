import type { TraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: TraceStep | null }) {
  if (!step) return null;

  return (
    <div className="w-full max-w-2xl mt-4 p-4 rounded bg-slate-900 border border-slate-700 text-cyan-200">
      {step.message}
    </div>
  );
}
