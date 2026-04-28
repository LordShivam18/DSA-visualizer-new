"use client";

export default function Controls({
  step,
  reset,
}: {
  step: () => void;
  reset: () => void;
}) {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={step}
        className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded"
      >
        Step →
      </button>

      <button
        onClick={reset}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
      >
        Reset
      </button>
    </div>
  );
}
