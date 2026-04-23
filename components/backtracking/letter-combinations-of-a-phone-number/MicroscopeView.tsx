import PanelShell from "../shared/PanelShell";
import RecursionStack from "../shared/RecursionStack";
import StatCard from "../shared/StatCard";
import type { LetterCombinationsTraceStep } from "./generateTrace";

type Props = {
  step: LetterCombinationsTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: LetterCombinationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "The search moved to the next digit position and is preparing to test all letters for that slot.";
    case "choose-letter":
      return "One letter is temporarily chosen and added to the partial word.";
    case "complete":
      return "Every digit already picked one letter, so the current word is finished and saved.";
    case "backtrack":
      return "The last letter is removed so the algorithm can try a different option for the same digit.";
    case "empty":
      return "There were no valid phone digits, so the search never starts.";
    default:
      return "Backtracking repeats the same pattern: choose, recurse, and undo.";
  }
}

function buildExpertFocus(step: LetterCombinationsTraceStep) {
  switch (step.actionKind) {
    case "enter-depth":
      return "Each recursive depth corresponds to one digit index, so the stack height never exceeds `digits.length()`.";
    case "choose-letter":
      return "This branch appends one character to the mutable path buffer before recurring to the next index.";
    case "complete":
      return "The base case copies the current path into the answer vector when `index == digits.size()`.";
    case "backtrack":
      return "Undoing `path.pop_back()` restores the invariant that the buffer matches the caller's prefix.";
    case "empty":
      return "The early guard avoids constructing a trace for an empty search space.";
    default:
      return "The full runtime is proportional to the number of generated strings across all branch factors.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <PanelShell
      title="Microscope View"
      subtitle="See exactly how one local choice changes the recursion state."
      accent="violet"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Active Digit"
          value={step.pointers.activeDigit ?? "none"}
          tone="cyan"
        />
        <StatCard
          label="Active Letter"
          value={step.pointers.activeLetter ?? "none"}
          tone="yellow"
        />
        <StatCard
          label="Call Depth"
          value={step.pointers.callDepth}
          tone="violet"
        />
        <StatCard
          label="Saved Words"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? buildBeginnerFocus(step)
            : buildExpertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Prefix Rule
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Every active stack frame owns the same prefix as the visible
            <span className="font-mono text-cyan-200"> partial </span>
            string. A child frame adds exactly one extra letter, and backtracking
            removes exactly that letter when the child returns.
          </p>
        </div>

        <RecursionStack
          title="Stack Snapshot"
          emptyLabel="No active recursion frames are left."
          frames={step.state.stack.map((frame) => ({
            title:
              frame.digit === null
                ? `depth ${frame.depth} base case`
                : `digit ${frame.digit}`,
            subtitle:
              frame.digit === null
                ? `store "${step.state.partial}"`
                : `partial "${frame.partial}"`,
            active: frame.status === "active",
            success: frame.status === "complete",
          }))}
        />
      </div>
    </PanelShell>
  );
}
