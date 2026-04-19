"use client";

type Mode = "beginner" | "expert";

type Props = {
  cursor: number;
  mode: Mode;
  setMode: (mode: Mode) => void;
  canStep: boolean;
  onStep: () => void;
  onReset: () => void;
};

export default function Controls({
  cursor,
  mode,
  setMode,
  canStep,
  onStep,
  onReset,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#161b22] p-4 shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onStep}
          disabled={!canStep}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Step
        </button>

        <button
          onClick={onReset}
          className="rounded-lg bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Mode</span>
        <select
          className="rounded-lg border border-gray-600 bg-[#0d1117] px-3 py-1"
          value={mode}
          onChange={(event) => setMode(event.target.value as Mode)}
        >
          <option value="beginner">Beginner</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="text-sm text-gray-400">Step {cursor + 1}</div>
    </div>
  );
}
