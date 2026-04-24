import { cardTone } from "./tone";
import type { AccentTone, VisualGroup } from "./types";

type Props = {
  label: string;
  groups: VisualGroup[];
  activeGroupId: string | null;
  accent?: AccentTone;
  emptyLabel: string;
};

export default function GroupBoard({
  label,
  groups,
  activeGroupId,
  accent = "purple",
  emptyLabel,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {label}
        </p>
        <span className="text-xs text-slate-500">{groups.length} groups</span>
      </div>

      {groups.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {groups.map((group) => {
            const tone = group.tone ?? "slate";
            const isActive = activeGroupId === group.id;

            return (
              <div
                key={group.id}
                className={[
                  "rounded-[1rem] border p-4 transition-all duration-300",
                  cardTone(isActive ? accent : tone),
                  isActive ? "translate-y-[-2px] scale-[1.01]" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-100">{group.title}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {group.items.length} items
                  </span>
                </div>
                {group.subtitle ? (
                  <p className="mt-2 text-xs text-slate-300">{group.subtitle}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item, index) => (
                    <span
                      key={`${group.id}-${index}-${item}`}
                      className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
