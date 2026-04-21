"use client";

import { useState } from "react";

import BackButton from "../../../components/ui/BackButton";
import CodePanel from "../../../components/graph-traversal/course-schedule/CodePanel";
import Controls from "../../../components/graph-traversal/course-schedule/Controls";
import CourseScheduleWorkbench from "../../../components/graph-traversal/course-schedule/CourseScheduleWorkbench";
import MicroscopeView from "../../../components/graph-traversal/course-schedule/MicroscopeView";
import TracePanel from "../../../components/graph-traversal/course-schedule/TracePanel";
import {
  formatCourseResult,
  generateTrace,
  type CourseScheduleInput,
  type CourseScheduleTraceStep,
} from "../../../components/graph-traversal/course-schedule/generateTrace";

const defaultInput: CourseScheduleInput = {
  numCourses: "2",
  prerequisites: `[[1,0]]`,
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    input: defaultInput,
  },
  {
    name: "Example 2",
    output: "false",
    input: {
      numCourses: "2",
      prerequisites: `[[1,0],[0,1]]`,
    },
  },
  {
    name: "Diamond DAG",
    output: "true",
    input: {
      numCourses: "4",
      prerequisites: `[[1,0],[2,0],[3,1],[3,2]]`,
    },
  },
] as const;

function buildTrace(input: CourseScheduleInput) {
  return generateTrace(input);
}

export default function CourseSchedulePage() {
  const [numCoursesInput, setNumCoursesInput] = useState(defaultInput.numCourses);
  const [prerequisitesInput, setPrerequisitesInput] = useState(
    defaultInput.prerequisites
  );
  const [trace, setTrace] = useState<CourseScheduleTraceStep[]>(() =>
    buildTrace(defaultInput)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<"beginner" | "expert">("beginner");

  const step = trace[Math.min(cursor, trace.length - 1)];
  const canPrev = cursor > 0;
  const canNext = cursor < trace.length - 1;

  function runWithValue(input: CourseScheduleInput) {
    setNumCoursesInput(input.numCourses);
    setPrerequisitesInput(input.prerequisites);
    setTrace(buildTrace(input));
    setCursor(0);
  }

  function runCurrentInput() {
    const input = {
      numCourses: numCoursesInput,
      prerequisites: prerequisitesInput,
    };
    setTrace(buildTrace(input));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href="/graph-traversal" label="Graph Traversal" />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            Graph Traversal / Topological BFS / Cycle Detection
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="text-cyan-400 text-glow-cyan">
              Course Schedule
            </span>
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            Watch Kahn&apos;s algorithm peel away zero-indegree courses until the
            graph empties or a directed cycle refuses to unlock.
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

            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div>
                <label className="text-xs font-medium text-slate-400">
                  Number of courses
                </label>
                <input
                  value={numCoursesInput}
                  onChange={(event) => setNumCoursesInput(event.target.value)}
                  className="input-field mt-2"
                  placeholder="2"
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">
                  Prerequisites
                </label>
                <textarea
                  value={prerequisitesInput}
                  onChange={(event) => setPrerequisitesInput(event.target.value)}
                  className="input-field mt-2 min-h-[140px] resize-y"
                  placeholder='JSON like [[1,0],[0,1]]'
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Pair format: <span className="font-mono text-slate-200">[course, prerequisite]</span>
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

            <CourseScheduleWorkbench step={step} />
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
                ? step.state.result
                  ? "border-emerald-400/30 bg-emerald-500/5"
                  : "border-rose-400/30 bg-rose-500/5"
                : "border-slate-800/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`h-5 w-1.5 rounded-full ${
                  step.done
                    ? step.state.result
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                    : "bg-cyan-400"
                }`}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Output
              </h3>
              <span
                className={`ml-auto text-sm font-bold ${
                  step.done
                    ? step.state.result
                      ? "text-emerald-400"
                      : "text-rose-300"
                    : "text-cyan-300"
                }`}
              >
                {step.done ? "Resolved" : "Building"}
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base text-slate-200">
              canFinish(...) = {formatCourseResult(step.state.result)}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Courses
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  {step.state.numCourses}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Ready Queue
                </p>
                <p className="mt-2 text-2xl font-semibold text-violet-200">
                  {step.state.queue.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Taken
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {step.state.processedCount}/{step.state.numCourses}
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
                  O(V + E) time / O(V + E) space
                </span>
              </span>
              <span>
                Blocked courses:{" "}
                <span className="font-mono text-slate-200">
                  {step.state.remainingBlocked.length === 0
                    ? "none"
                    : step.state.remainingBlocked.join(", ")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
