import GroupBoard from "./GroupBoard";
import MapLedger from "./MapLedger";
import StatGrid from "./StatGrid";
import TokenLane from "./TokenLane";
import { cardTone, chipTone } from "./tone";
import type { AccentTone, HashmapTraceStep } from "./types";

type Props = {
  step: HashmapTraceStep;
  title: string;
  description: string;
  accent?: AccentTone;
  legend: string[];
};

export default function HashmapWorkbenchBase({
  step,
  title,
  description,
  accent = "cyan",
  legend,
}: Props) {
  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Hash Map Workbench
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {step.state.stats.slice(0, 3).map((stat) => (
            <span
              key={stat.label}
              className={`rounded-full border px-3 py-1 ${chipTone(
                stat.tone ?? accent
              )}`}
            >
              {stat.label}: {stat.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Current Lens
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{step.state.hero}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        {legend.map((item, index) => {
          const tone: AccentTone[] = [
            accent,
            "yellow",
            "green",
            "purple",
            "red",
          ];

          return (
            <span
              key={`${item}-${index}`}
              className={`rounded-full border px-3 py-1 ${chipTone(
                tone[index % tone.length]
              )}`}
            >
              {item}
            </span>
          );
        })}
      </div>

      <div className="mt-5">
        <StatGrid stats={step.state.stats} />
      </div>

      <div className="mt-5 space-y-4">
        <TokenLane
          label={step.state.primaryLabel}
          items={step.state.primaryItems}
          activeIndex={step.pointers.primaryIndex}
          accent={accent}
          fallback="This lane is empty for the current input."
        />

        {step.state.secondaryLabel && step.state.secondaryItems ? (
          <TokenLane
            label={step.state.secondaryLabel}
            items={step.state.secondaryItems}
            activeIndex={step.pointers.secondaryIndex}
            accent="purple"
            fallback="No secondary items are active right now."
          />
        ) : null}

        {step.state.tertiaryLabel && step.state.tertiaryItems ? (
          <TokenLane
            label={step.state.tertiaryLabel}
            items={step.state.tertiaryItems}
            activeIndex={step.pointers.tertiaryIndex}
            accent="yellow"
            fallback="No tertiary items are active right now."
          />
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <MapLedger
          label={step.state.mapLabel}
          entries={step.state.mapEntries}
          activeEntryId={step.pointers.activeEntryId}
          focusKey={step.pointers.focusKey}
          focusValue={step.pointers.focusValue}
          accent={accent}
          emptyLabel="The hash map is still empty at this step."
        />

        <div className="space-y-4">
          {step.state.groupsLabel && step.state.groups ? (
            <GroupBoard
              label={step.state.groupsLabel}
              groups={step.state.groups}
              activeGroupId={step.pointers.activeGroupId}
              accent="purple"
              emptyLabel="No groups have been formed yet."
            />
          ) : null}

          {step.state.auxLabel && step.state.auxItems ? (
            <TokenLane
              label={step.state.auxLabel}
              items={step.state.auxItems}
              activeIndex={null}
              accent="green"
              fallback="Nothing extra is being tracked yet."
            />
          ) : null}

          <div
            className={`rounded-[1.2rem] border p-4 ${
              step.state.resultTone
                ? cardTone(step.state.resultTone)
                : cardTone(step.done ? "green" : accent)
            }`}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {step.state.resultLabel}
            </p>
            <p className="mt-3 break-words font-mono text-xl text-slate-50">
              {step.state.resultValue}
            </p>
            {step.state.summary ? (
              <p className="mt-3 text-sm leading-6 text-slate-200">
                {step.state.summary}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {step.state.footer ? (
        <div className={`mt-5 rounded-[1.2rem] border p-4 ${cardTone("slate")}`}>
          <p className="text-sm leading-6 text-slate-300">{step.state.footer}</p>
        </div>
      ) : null}
    </section>
  );
}
