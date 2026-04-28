// components/linked-list/reverse-linked-list-ii/ListNodeViz.tsx
"use client";

export default function ListNodeViz({
  value,
  index,
  isPrev,
  isCurr,
  isTemp,
  reversing,
}: {
  value: number;
  index: number;
  isPrev: boolean;
  isCurr: boolean;
  isTemp: boolean;
  reversing: boolean;
}) {
  let border = "border-slate-700";
  let text = "text-slate-200";
  let glow = "shadow-[0_0_8px_rgba(255,255,255,0.15)]";

  if (isTemp) {
    border = "border-red-500";
    text = "text-red-300";
    glow = "shadow-[0_0_20px_rgba(248,113,113,0.8)]";
  } else if (isCurr) {
    border = "border-cyan-400";
    text = "text-cyan-300";
    glow = "shadow-[0_0_20px_rgba(34,211,238,0.8)]";
  } else if (isPrev) {
    border = "border-emerald-400";
    text = "text-emerald-300";
    glow = "shadow-[0_0_20px_rgba(52,211,153,0.8)]";
  } else if (reversing) {
    border = "border-purple-500";
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
