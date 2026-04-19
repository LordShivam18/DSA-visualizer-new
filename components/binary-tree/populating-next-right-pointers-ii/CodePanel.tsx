import type { ConnectTraceStep } from "./generateTrace";

type Props = {
  step: ConnectTraceStep;
};

const codeLines = [
  "Node* connect(Node* root) {",
  "    if (!root) return nullptr;",
  "    Node* levelStart = root;",
  "    while (levelStart) {",
  "        Node dummy(0);",
  "        Node* tail = &dummy;",
  "        for (Node* current = levelStart; current; current = current->next) {",
  "            if (current->left) {",
  "                tail->next = current->left;",
  "                tail = tail->next;",
  "            }",
  "            if (current->right) {",
  "                tail->next = current->right;",
  "                tail = tail->next;",
  "            }",
  "        }",
  "        levelStart = dummy.next;",
  "    }",
  "    return root;",
  "}",
];

export default function CodePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Code Panel</h2>
          <p className="text-sm text-slate-400">
            The highlighted lines follow the exact action shown in the trace.
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
                  ? "border border-cyan-400/30 bg-cyan-500/10 text-slate-50 shadow-[0_0_18px_rgba(34,211,238,0.16)]"
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
