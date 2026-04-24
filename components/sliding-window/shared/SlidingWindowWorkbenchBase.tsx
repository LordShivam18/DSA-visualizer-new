import FrequencyLedger from "./FrequencyLedger";
import WindowRail from "./WindowRail";
import { cardTone, chipTone } from "./tone";
import type { AccentTone, SlidingWindowTraceStep } from "./types";

type Props = {
  step: SlidingWindowTraceStep;
  title: string;
  description: string;
  accent?: AccentTone;
  legend: string[];
};

export default function SlidingWindowWorkbenchBase({
  step,
  title,
  description,
  accent = "emerald",
  legend,
}: Props) {
  return (
    <section className="glass-card overflow-hidden p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Sliding Window Workbench
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

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/75 via-[#07151b] to-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Current Window Story
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{step.state.hero}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        {legend.map((item, index) => {
          const tones: AccentTone[] = [
            accent,
            "cyan",
            "yellow",
            "purple",
            "rose",
          ];

          return (
            <span
              key={`${item}-${index}`}
              className={`rounded-full border px-3 py-1 ${chipTone(
                tones[index % tones.length]
              )}`}
            >
              {item}
            </span>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {step.state.stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-[1.15rem] border p-4 ${cardTone(
              stat.tone ?? "slate"
            )}`}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <WindowRail
          label={step.state.primaryLabel}
          items={step.state.primaryItems}
          activeSpan={step.state.primarySpan}
          bestSpan={step.state.bestSpan}
          leftPointer={step.pointers.left}
          rightPointer={step.pointers.right}
          accent={accent}
          emptyLabel="No primary items are available for this input."
        />

        {step.state.secondaryLabel && step.state.secondaryItems ? (
          <WindowRail
            label={step.state.secondaryLabel}
            items={step.state.secondaryItems}
            activeSpan={step.state.secondarySpan}
            bestSpan={undefined}
            leftPointer={step.pointers.anchor}
            rightPointer={step.pointers.scan}
            accent="cyan"
            emptyLabel="No secondary track is active right now."
          />
        ) : null}

        {step.state.tertiaryLabel && step.state.tertiaryItems ? (
          <WindowRail
            label={step.state.tertiaryLabel}
            items={step.state.tertiaryItems}
            activeSpan={step.state.tertiarySpan}
            bestSpan={undefined}
            leftPointer={null}
            rightPointer={null}
            accent="yellow"
            emptyLabel="No tertiary track is active right now."
          />
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <FrequencyLedger
          label={step.state.ledgerLabel}
          entries={step.state.ledgerEntries}
          activeEntryId={step.pointers.activeEntryId}
          accent={accent}
          emptyLabel="This step does not need any frequency or word-count ledger."
        />

        <div className="space-y-4">
          {step.state.groupsLabel && step.state.groups ? (
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {step.state.groupsLabel}
                </p>
                <span className="text-xs text-slate-500">
                  {step.state.groups.length} groups
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {step.state.groups.map((group) => (
                  <div
                    key={group.id}
                    className={`rounded-[1rem] border p-4 ${cardTone(
                      step.pointers.activeGroupId === group.id
                        ? accent
                        : group.tone ?? "slate"
                    )}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-100">{group.title}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {group.items.length}
                      </span>
                    </div>
                    {group.subtitle ? (
                      <p className="mt-2 text-xs text-slate-300">{group.subtitle}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
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
                ))}
              </div>
            </div>
          ) : null}

          <div
            className={`rounded-[1.2rem] border p-4 ${cardTone(
              step.state.resultTone ?? accent
            )}`}
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
