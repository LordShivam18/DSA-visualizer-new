import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { PermutationsTraceStep } from "./generateTrace";

type Props = {
  step: PermutationsTraceStep;
};

const codeLines = [
  "vector<vector<int>> permute(vector<int>& nums) {",
  "    vector<vector<int>> answer;",
  "    vector<int> path;",
  "    vector<bool> used(nums.size(), false);",
  "    function<void()> dfs = [&]() {",
  "        if (path.size() == nums.size()) {",
  "            answer.push_back(path);",
  "            return;",
  "        }",
  "        for (int i = 0; i < nums.size(); ++i) {",
  "            if (used[i]) continue;",
  "            used[i] = true;",
  "            path.push_back(nums[i]);",
  "            dfs();",
  "            path.pop_back();",
  "            used[i] = false;",
  "        }",
  "    };",
  "    dfs();",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="The highlighted lines show how the used-mask flips on entry and flips back on exit."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: O(n * n!)
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Space: O(n)
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
