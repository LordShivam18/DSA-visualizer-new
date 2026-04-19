import type { FlattenTraceStep } from "./generateTrace";

type Props = {
  step: FlattenTraceStep;
};

const codeLines = [
  "void flatten(TreeNode* root) {",
  "    TreeNode* current = root;",
  "    while (current) {",
  "        if (current->left) {",
  "            TreeNode* predecessor = current->left;",
  "            while (predecessor->right) {",
  "                predecessor = predecessor->right;",
  "            }",
  "            predecessor->right = current->right;",
  "            current->right = current->left;",
  "            current->left = nullptr;",
  "        }",
  "        current = current->right;",
  "    }",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Code Panel</h2>
          <p className="text-sm text-slate-400">
            Highlighted lines track the exact pointer rewiring for this step.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4 font-mono text-[12px] leading-6 text-slate-300">
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          const active = step.codeLines.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={[
                "flex gap-4 rounded-lg px-3 py-0.5 transition-all duration-300",
                active
                  ? "border border-amber-400/30 bg-amber-500/10 text-slate-50 shadow-[0_0_18px_rgba(251,191,36,0.16)]"
                  : "border border-transparent",
              ].join(" ")}
            >
              <span className="w-5 shrink-0 text-right text-slate-500">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-300">
        <span className="text-slate-500">Why these lines:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
