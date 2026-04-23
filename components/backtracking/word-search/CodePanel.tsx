import CodeBlock from "../shared/CodeBlock";
import PanelShell from "../shared/PanelShell";
import type { WordSearchTraceStep } from "./generateTrace";

type Props = {
  step: WordSearchTraceStep;
};

const codeLines = [
  "bool exist(vector<vector<char>>& board, string word) {",
  "    int rows = board.size(), cols = board[0].size();",
  "    vector<vector<bool>> used(rows, vector<bool>(cols, false));",
  "    function<bool(int,int,int)> dfs = [&](int r, int c, int index) {",
  "        if (board[r][c] != word[index] || used[r][c]) return false;",
  "        if (index == word.size() - 1) return true;",
  "        used[r][c] = true;",
  "        for (auto [dr, dc] : dirs) {",
  "            int nr = r + dr, nc = c + dc;",
  "            if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && dfs(nr, nc, index + 1)) return true;",
  "        }",
  "        used[r][c] = false;",
  "        return false;",
  "    };",
  "    for (int r = 0; r < rows; ++r) {",
  "        for (int c = 0; c < cols; ++c) {",
  "            if (dfs(r, c, 0)) return true;",
  "        }",
  "    }",
  "    return false;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <PanelShell
      title="Code Panel"
      subtitle="The highlights follow start-cell scanning, path acceptance, mismatch pruning, and cell unmarking."
      accent="cyan"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: O(rows * cols * 4^wordLength)
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Space: O(wordLength)
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
