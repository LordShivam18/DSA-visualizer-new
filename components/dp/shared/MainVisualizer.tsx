"use client";

import { AnimatePresence, motion } from "framer-motion";

import { gentleSpring, glassPanelClassName, sceneTheme, toneClasses } from "./theme";
import type {
  DpTraceStep,
  VisualMatrix,
  VisualRibbon,
  VisualSequence,
} from "./types";
import DPCell from "./DPCell";
import DPNode from "./DPNode";

function SequenceRenderer({
  section,
  highlightedIds,
}: {
  section: VisualSequence;
  highlightedIds: Set<string>;
}) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white/72 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
            {section.title}
          </h3>
          {section.subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{section.subtitle}</p>
          ) : null}
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {section.cells.length} cells
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {section.cells.map((cell, index) => (
          <DPCell
            key={cell.id}
            cell={{ ...cell, variant: cell.variant ?? section.variant }}
            index={index}
            highlighted={highlightedIds.has(cell.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MatrixRenderer({
  section,
  highlightedIds,
}: {
  section: VisualMatrix;
  highlightedIds: Set<string>;
}) {
  const triangle = section.variant === "triangle";

  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white/72 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
            {section.title}
          </h3>
          {section.subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{section.subtitle}</p>
          ) : null}
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          {section.rows.length} rows
        </span>
      </div>

      <div className="space-y-3">
        {section.rows.map((row) => (
          <div
            key={row.id}
            className={`flex gap-3 ${triangle ? "justify-center" : "items-center"}`}
          >
            {row.label ? (
              <div className="flex w-12 items-center justify-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {row.label}
              </div>
            ) : null}
            <div className={`flex flex-wrap gap-3 ${triangle ? "justify-center" : ""}`}>
              {row.cells.map((cell) => (
                <DPCell
                  key={cell.id}
                  cell={cell}
                  compact
                  highlighted={highlightedIds.has(cell.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RibbonRenderer({
  section,
  highlightedIds,
}: {
  section: VisualRibbon;
  highlightedIds: Set<string>;
}) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white/72 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
          {section.title}
        </h3>
        {section.subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{section.subtitle}</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {section.tokens.map((token) => (
          <DPCell
            key={token.id}
            compact
            cell={{
              id: token.id,
              value: token.value,
              label: token.source,
              caption: token.caption,
              tone: token.tone,
              tags: token.tags,
              variant: "char",
            }}
            highlighted={highlightedIds.has(token.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MainVisualizer({
  step,
  transitionProgress,
}: {
  step: DpTraceStep;
  transitionProgress: number;
}) {
  const theme = sceneTheme(step.state.scene);
  const highlightedIds = new Set([
    ...(step.highlights.primaryIds ?? []),
    ...(step.highlights.secondaryIds ?? []),
    ...step.animation.targets,
  ]);
  const resultTone = toneClasses(step.state.result?.tone ?? "emerald");

  return (
    <motion.section
      layout
      transition={gentleSpring}
      className={`${glassPanelClassName} relative overflow-hidden p-6`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-10 top-0 h-48 w-48 rounded-full blur-3xl ${theme.orbClass}`} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              {theme.label}
            </p>
            <h2 className={`mt-2 bg-gradient-to-r ${theme.accent} bg-clip-text text-3xl font-semibold text-transparent`}>
              {step.state.headline}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {step.state.subheadline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(step.state.callouts ?? []).map((callout) => {
              const tone = toneClasses(callout.tone);

              return (
                <motion.div
                  layout
                  transition={gentleSpring}
                  key={callout.id}
                  className={`min-w-[150px] rounded-[1.25rem] border px-4 py-3 ${tone.surface}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {callout.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{callout.value}</p>
                  {callout.description ? (
                    <p className="mt-1 text-xs leading-6 opacity-75">{callout.description}</p>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={gentleSpring}
            className="mt-6 space-y-4"
          >
            <motion.div
              animate={{
                opacity: 0.55 + transitionProgress * 0.45,
                scale: 0.98 + transitionProgress * 0.02,
              }}
              transition={gentleSpring}
              className={`rounded-[1.35rem] border border-white/75 bg-gradient-to-r ${theme.beamClass} px-5 py-4`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                Cinematic cue
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{step.action}</p>
            </motion.div>

            {(step.state.nodeGroups ?? []).length > 0 ? (
              <div className="grid gap-4">
                {step.state.nodeGroups?.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-[1.4rem] border border-slate-200 bg-white/72 p-4"
                  >
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
                        {group.title}
                      </h3>
                      {group.subtitle ? (
                        <p className="mt-1 text-sm text-slate-500">{group.subtitle}</p>
                      ) : null}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {group.nodes.map((node) => (
                        <DPNode
                          key={node.id}
                          node={node}
                          highlighted={highlightedIds.has(node.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {(step.state.sequences ?? []).length > 0 ? (
              <div className="space-y-4">
                {step.state.sequences?.map((section) => (
                  <SequenceRenderer
                    key={section.id}
                    section={section}
                    highlightedIds={highlightedIds}
                  />
                ))}
              </div>
            ) : null}

            {(step.state.matrices ?? []).length > 0 ? (
              <div className="space-y-4">
                {step.state.matrices?.map((section) => (
                  <MatrixRenderer
                    key={section.id}
                    section={section}
                    highlightedIds={highlightedIds}
                  />
                ))}
              </div>
            ) : null}

            {(step.state.ribbons ?? []).length > 0 ? (
              <div className="space-y-4">
                {step.state.ribbons?.map((section) => (
                  <RibbonRenderer
                    key={section.id}
                    section={section}
                    highlightedIds={highlightedIds}
                  />
                ))}
              </div>
            ) : null}

            {(step.state.ledgers ?? []).length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {step.state.ledgers?.map((ledger) => (
                  <div
                    key={ledger.id}
                    className="rounded-[1.4rem] border border-slate-200 bg-white/72 p-4"
                  >
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
                        {ledger.title}
                      </h3>
                      {ledger.subtitle ? (
                        <p className="mt-1 text-sm text-slate-500">{ledger.subtitle}</p>
                      ) : null}
                    </div>

                    {ledger.items.length === 0 ? (
                      <div className="rounded-[1rem] border border-dashed border-slate-200 bg-slate-50/72 px-4 py-4 text-sm text-slate-500">
                        {ledger.emptyLabel ?? "No entries yet."}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {ledger.items.map((item) => {
                          const tone = toneClasses(item.tone);

                          return (
                            <div
                              key={item.id}
                              className={`rounded-[1rem] border px-4 py-3 ${tone.surface}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold">{item.label}</p>
                                  {item.note ? (
                                    <p className="mt-1 text-xs leading-6 opacity-75">
                                      {item.note}
                                    </p>
                                  ) : null}
                                </div>
                                <p className="font-mono text-sm font-semibold">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {step.state.result ? (
          <motion.div
            layout
            transition={gentleSpring}
            className={`mt-6 rounded-[1.45rem] border px-5 py-4 ${resultTone.surface}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
              {step.state.result.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{step.state.result.value}</p>
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  );
}
