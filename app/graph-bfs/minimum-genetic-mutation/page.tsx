"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/graph-bfs/minimum-genetic-mutation/CodePanel";
import Controls from "../../../components/graph-bfs/minimum-genetic-mutation/Controls";
import MicroscopeView from "../../../components/graph-bfs/minimum-genetic-mutation/MicroscopeView";
import MinimumGeneticMutationWorkbench from "../../../components/graph-bfs/minimum-genetic-mutation/MinimumGeneticMutationWorkbench";
import TracePanel from "../../../components/graph-bfs/minimum-genetic-mutation/TracePanel";
import {
  formatPath,
  formatResult,
  generateTrace,
  type MinimumGeneticMutationInput,
  type MinimumGeneticMutationTraceStep,
} from "../../../components/graph-bfs/minimum-genetic-mutation/generateTrace";

const defaultInput: MinimumGeneticMutationInput = {
  startGene: "AACCGGTT",
  endGene: "AACCGGTA",
  bank: `["AACCGGTA"]`,
};

const presets = [
  {
    name: "Example 1",
    output: "1",
    input: defaultInput,
  },
  {
    name: "Example 2",
    output: "2",
    input: {
      startGene: "AACCGGTT",
      endGene: "AAACGGTA",
      bank: `["AACCGGTA","AACCGCTA","AAACGGTA"]`,
    },
  },
  {
    name: "No Path",
    output: "-1",
    input: {
      startGene: "AACCGGTT",
      endGene: "AAACGGTA",
      bank: `["AACCGATT","AACCGATA","AAACGATA"]`,
    },
  },
] as const;

function buildTrace(input: MinimumGeneticMutationInput) {
  return generateTrace(input);
}

export default function MinimumGeneticMutationPage() {
  const [startGene, setStartGene] = useState(defaultInput.startGene);
  const [endGene, setEndGene] = useState(defaultInput.endGene);
  const [bankInput, setBankInput] = useState(defaultInput.bank);
  const [trace, setTrace] = useState<MinimumGeneticMutationTraceStep[]>(() =>
    buildTrace(defaultInput)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValue(input: MinimumGeneticMutationInput) {
    setStartGene(input.startGene);
    setEndGene(input.endGene);
    setBankInput(input.bank);
    setTrace(buildTrace(input));
    setCursor(0);
  }

  function runCurrentInput() {
    const input = { startGene, endGene, bank: bankInput };
    setTrace(buildTrace(input));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(52,211,153,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/graph-bfs" label="Graph BFS" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Graph BFS / State Search / One-Character Mutation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Minimum Genetic Mutation
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Treat each valid gene as a state in an implicit graph and let BFS
            search the mutation bank one legal character change at a time until
            the target gene is discovered.
          </p>
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <div className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => runWithValue(preset.input)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name} <span className="text-slate-500">-&gt; {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Start gene
                </label>
                <input
                  value={startGene}
                  onChange={(event) => setStartGene(event.target.value)}
                  className="input-field mt-2"
                  placeholder="AACCGGTT"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">
                  End gene
                </label>
                <input
                  value={endGene}
                  onChange={(event) => setEndGene(event.target.value)}
                  className="input-field mt-2"
                  placeholder="AACCGGTA"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-400">
                Gene bank
              </label>
              <textarea
                value={bankInput}
                onChange={(event) => setBankInput(event.target.value)}
                className="input-field mt-2 min-h-[140px] resize-y"
                placeholder='JSON like ["AACCGGTA","AACCGCTA"]'
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Genes are normalized to uppercase. Each legal move changes
                exactly one character.
              </span>
              <button onClick={runCurrentInput} className="btn-neon btn-neon-cyan">
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          <span className="font-semibold text-slate-50">Current action:</span>{" "}
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.92fr)]">
          <section className="space-y-5">
            <Controls
              stepIndex={cursor}
              totalSteps={trace.length}
              mode={mode}
              onModeChange={setMode}
              onPrev={() => setCursor((current) => Math.max(current - 1, 0))}
              onNext={() =>
                setCursor((current) => Math.min(current + 1, trace.length - 1))
              }
              onReset={() => setCursor(0)}
              canPrev={canPrev}
              canNext={canNext}
            />

            <MinimumGeneticMutationWorkbench step={step} />
            <MicroscopeView step={step} mode={mode} />
          </section>

          <aside className="space-y-5">
            <TracePanel step={step} />
            <CodePanel step={step} />
          </aside>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div
            className={`glass-card p-5 ${
              step.done
                ? step.state.result === -1
                  ? "border-rose-400/30 bg-rose-500/5"
                  : "border-emerald-400/30 bg-emerald-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done
                    ? step.state.result === -1
                      ? "bg-rose-400"
                      : "bg-emerald-400"
                    : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done
                    ? step.state.result === -1
                      ? "text-rose-300"
                      : "text-emerald-400"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base text-slate-200">
              minMutation(...) = {formatResult(step.state.result)}
            </div>

            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Mutation chain:</span>{" "}
              {formatPath(step.state.path)}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Gene Length
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.startGene.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Bank Size
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.bank.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Visited
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.visited.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Trace Steps
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-200">
                  {trace.length}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>
                Complexity:{" "}
                <span className="font-mono text-slate-200">
                  O(B^2 * L) time / O(B) space
                </span>
              </span>
              <span>
                Last processed gene:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.processed.length === 0
                    ? "none"
                    : step.state.processed[step.state.processed.length - 1]}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
