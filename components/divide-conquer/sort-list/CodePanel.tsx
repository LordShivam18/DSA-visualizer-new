import type { SortListTraceStep } from "./generateTrace";

const codeLines = [
  "ListNode* sortList(ListNode* head) {",
  "    if (!head || !head->next) return head;",
  "    ListNode* slow = head;",
  "    ListNode* fast = head->next;",
  "    while (fast && fast->next) {",
  "        slow = slow->next;",
  "        fast = fast->next->next;",
  "    }",
  "    ListNode* mid = slow->next;",
  "    slow->next = nullptr;",
  "    ListNode* left = sortList(head);",
  "    ListNode* right = sortList(mid);",
  "    ListNode dummy(0);",
  "    ListNode* tail = &dummy;",
  "    while (left && right) {",
  "        if (left->val <= right->val) { tail->next = left; left = left->next; }",
  "        else { tail->next = right; right = right->next; }",
  "        tail = tail->next;",
  "    }",
  "    tail->next = left ? left : right;",
  "    return dummy.next;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: SortListTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Code Panel</h2>
          <p className="text-sm text-slate-400">
            Line highlighting follows the split and merge stages of linked-list merge sort.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          Time: O(n log n)
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-100">
          Stack: O(log n)
        </span>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-100">
          Active Lines: {step.codeLines.join(", ")}
        </span>
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
              <span className="whitespace-pre">{line || " "}</span>
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
