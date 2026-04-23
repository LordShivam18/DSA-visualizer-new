import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { CombinationsTraceStep } from "./generateTrace";

type Props = {
  step: CombinationsTraceStep;
};

const codeLines = [
  "vector<vector<int>> combine(int n, int k) {",
  "    vector<vector<int>> answer;",
  "    vector<int> path;",
  "    function<void(int)> dfs = [&](int start) {",
  "        if (path.size() == k) {",
  "            answer.push_back(path);",
  "            return;",
  "        }",
  "        for (int value = start; value <= n; ++value) {",
  "            path.push_back(value);",
  "            dfs(value + 1);",
  "            path.pop_back();",
  "        }",
  "    };",
  "    dfs(1);",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="The highlighted lines show when the start pointer advances and when the subset buffer is undone."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: O(C(n, k) * k)
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Space: O(k)
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
