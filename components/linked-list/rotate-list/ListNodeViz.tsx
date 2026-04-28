// components/linked-list/rotate-list/ListNodeViz.tsx
"use client";

export default function ListNodeViz({
  value,
  index,
  isTail,
  isNewTail,
  isNewHead,
}: {
  value: number;
  index: number;
  isTail: boolean;
  isNewTail: boolean;
  isNewHead: boolean;
}) {
  let border = "border-slate-700";
  let text = "text-slate-200";
  let glow = "shadow-[0_0_8px_rgba(255,255,255,0.15)]";

  if (isNewHead) {
    border = "border-cyan-400";
    text = "text-cyan-300";
    glow = "shadow-[0_0_18px_rgba(34,211,238,0.8)]";
  } else if (isNewTail) {
    border = "border-purple-400";
    text = "text-purple-300";
    glow = "shadow-[0_0_18px_rgba(168,85,247,0.8)]";
  } else if (isTail) {
    border = "border-emerald-400";
    text = "text-emerald-300";
    glow = "shadow-[0_0_18px_rgba(52,211,153,0.8)]";
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold bg-[#050816] border ${border} ${text} ${glow}`}>
        {value}
      </div>
      <div className="text-[10px] text-slate-500">idx {index}</div>
    </div>
  );
}
