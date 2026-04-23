import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { GenerateParenthesesTraceStep } from "./generateTrace";

type Props = {
  step: GenerateParenthesesTraceStep;
};

const codeLines = [
  "vector<string> generateParenthesis(int n) {",
  "    vector<string> answer;",
  "    string path;",
  "    function<void(int, int)> dfs = [&](int openUsed, int closeUsed) {",
  "        if (path.size() == 2 * n) {",
  "            answer.push_back(path);",
  "            return;",
  "        }",
  "        if (openUsed < n) {",
  "            path.push_back('(');",
  "            dfs(openUsed + 1, closeUsed);",
  "            path.pop_back();",
  "        }",
  "        if (closeUsed < openUsed) {",
  "            path.push_back(')');",
  "            dfs(openUsed, closeUsed + 1);",
  "            path.pop_back();",
  "        }",
  "    };",
  "    dfs(0, 0);",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="The highlighted lines show the two legal branch guards that keep every prefix valid."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: Catalan-number growth
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
