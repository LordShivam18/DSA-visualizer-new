import {
  formatOutputArray,
  type IteratorActionKind,
  type IteratorCall,
  type IteratorTraceStep,
} from "./generateTrace";

type Props = {
  step: IteratorTraceStep;
};

const actionTone: Record<IteratorActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "push-left": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  ready: "border-lime-400/40 bg-lime-500/10 text-lime-200",
  check: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  peek: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  pop: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "scan-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-right": "border-slate-600 bg-slate-900/70 text-slate-300",
  return: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  invalid: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: IteratorTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function callById(calls: IteratorCall[], id: string | null) {
  if (!id) {
    return null;
  }

  return calls.find((call) => call.id === id) ?? null;
}

function callTone(call: IteratorCall) {
  if (call.status === "active") {
    return "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  }

  if (call.status === "done") {
    return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
  }

  return "border-slate-700/80 bg-slate-950/70 text-slate-300";
}

export default function TracePanel({ step }: Props) {
  const focusCall =
    callById(step.state.calls, step.pointers.currentCallId) ??
    callById(step.state.calls, step.pointers.lastCallId) ??
    step.state.calls[0] ??
    null;

  const stackTop = labelOf(step, step.state.nextCandidateId);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Follow the method call, stack snapshot, and returned outputs.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}
        >
          {step.actionKind}
        </span>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Stack{" "}
          <span className="font-mono text-amber-200">
            {step.state.stackIds.length}
          </span>
        </span>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Returned{" "}
          <span className="font-mono text-emerald-200">
            {step.state.visitedIds.length}/{step.state.inorderIds.length}
          </span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#061020] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Call
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-100">
            {focusCall?.label ?? "setup"}
          </p>
          <p className="mt-2 font-mono text-sm text-slate-400">
            {focusCall?.result ??
              (focusCall?.kind === "constructor" &&
              !focusCall.contributesToOutput
                ? "implicit"
                : "pending")}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Stack Top
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {stackTop}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.returnedNodeId)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Tree Input
          </p>
          <p className="mt-2 break-words font-mono text-sm text-cyan-200">
            {step.state.treeInput.trim() || "[]"}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Output Array
          </p>
          <p className="mt-2 break-words font-mono text-sm text-emerald-200">
            {formatOutputArray(step.state.output)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Call Timeline
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {step.state.calls.map((call) => (
            <div
              key={call.id}
              className={`rounded-full border px-3 py-2 text-xs ${callTone(call)}`}
            >
              <span className="font-semibold">{call.label}</span>
              <span className="mx-2 text-slate-500">|</span>
              <span className="font-mono">
                {call.result ??
                  (call.kind === "constructor" && !call.contributesToOutput
                    ? "implicit"
                    : "pending")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Stack Snapshot (top to bottom)
          </p>
          {step.state.stackIds.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">The stack is empty.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {[...step.state.stackIds].reverse().map((id, index) => (
                <span
                  key={`${id}-${index}`}
                  className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-100"
                >
                  {index === 0 ? "top " : ""}
                  {labelOf(step, id)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Returned Inorder Prefix
          </p>
          {step.state.visitedIds.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No value has been returned yet.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {step.state.visitedIds.map((id) => (
                <span
                  key={id}
                  className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-100"
                >
                  {labelOf(step, id)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
