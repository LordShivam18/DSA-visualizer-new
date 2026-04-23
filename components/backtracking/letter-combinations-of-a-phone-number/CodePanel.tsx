import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { LetterCombinationsTraceStep } from "./generateTrace";

type Props = {
  step: LetterCombinationsTraceStep;
};

const codeLines = [
  "vector<string> letterCombinations(string digits) {",
  '    if (digits.empty()) return {};',
  '    unordered_map<char, string> phone{{\'2\',"abc"},{\'3\',"def"},{\'4\',"ghi"},{\'5\',"jkl"},{\'6\',"mno"},{\'7\',"pqrs"},{\'8\',"tuv"},{\'9\',"wxyz"}};',
  "    vector<string> result;",
  "    string path;",
  "    function<void(int)> dfs = [&](int index) {",
  "        if (index == digits.size()) {",
  "            result.push_back(path);",
  "            return;",
  "        }",
  "        for (char ch : phone[digits[index]]) {",
  "            path.push_back(ch);",
  "            dfs(index + 1);",
  "            path.pop_back();",
  "        }",
  "    };",
  "    dfs(0);",
  "    return result;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="Highlighted lines follow the branching choice, base case, and undo step."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: O(product of letter choices)
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Space: O(digits.length)
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
