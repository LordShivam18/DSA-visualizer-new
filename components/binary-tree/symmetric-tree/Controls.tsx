import React from "react";

type Props = {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  mode: "beginner" | "expert";
  setMode: (m: "beginner" | "expert") => void;
};

export default function Controls({
  playing, onPlay, onPause, onReset, onStepForward, onStepBack, mode, setMode
}: Props) {
  return (
    <div className="flex items-center gap-3">
      {playing ? (
        <button onClick={onPause} className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500">Pause</button>
      ) : (
        <button onClick={onPlay} className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500">Play</button>
      )}
      <button onClick={onReset} className="px-3 py-2 rounded-md bg-slate-800 border border-slate-600">Reset</button>

      <div className="flex items-center gap-2 ml-2">
        <button onClick={onStepBack} className="px-3 py-1 rounded bg-slate-800 border">◀</button>
        <button onClick={onStepForward} className="px-3 py-1 rounded bg-slate-800 border">▶</button>
      </div>

      <div className="ml-4">
        <select
          value={mode}
          onChange={(event) =>
            setMode(event.target.value === "expert" ? "expert" : "beginner")
          }
          className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm"
        >
          <option value="beginner">Beginner</option>
          <option value="expert">Expert</option>
        </select>
      </div>
    </div>
  );
}
