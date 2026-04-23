import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { CombinationSumTraceStep } from "./generateTrace";

type Props = {
  step: CombinationSumTraceStep;
};

const codeLines = [
  "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {",
  "    vector<vector<int>> answer;",
  "    vector<int> path;",
  "    function<void(int, int)> dfs = [&](int start, int remaining) {",
  "        if (remaining == 0) {",
  "            answer.push_back(path);",
  "            return;",
  "        }",
  "        for (int i = start; i < candidates.size(); ++i) {",
  "            if (remaining - candidates[i] < 0) continue;",
  "            path.push_back(candidates[i]);",
  "            dfs(i, remaining - candidates[i]);",
  "            path.pop_back();",
  "        }",
  "    };",
  "    dfs(0, target);",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="The highlights show the exact-hit base case, the overshoot prune, and the same-index reuse call."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: exponential in the number of feasible branches
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Space: O(target / minCandidate)
        </span>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-100">
          Active Lines: {step.codeLines.join(", ")}
        </span>
      </div>

      <div className="mt-5">
        <CodeBlock codeLines={codeLines} activeLines={step.codeLines} />
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
        <span className="text-slate-500">Why these lines:</span>{" "}
        {step.explanationExpert}
      </div>
    </PanelShell>
  );
}
