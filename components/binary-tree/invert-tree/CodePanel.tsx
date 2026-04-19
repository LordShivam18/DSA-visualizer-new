import type { Trace } from "./generateTrace";

type Props = {
  trace: Trace[];
  cursor: number;
  mode: "beginner" | "expert";
};

const code = [
  "TreeNode* invertTree(TreeNode* root) {",
  "    if (!root) return nullptr;",
  "    TreeNode* temp = root->left;",
  "    root->left = root->right;",
  "    root->right = temp;",
  "    invertTree(root->left);",
  "    invertTree(root->right);",
  "    return root;",
  "}",
];

export default function CodePanel({ trace, cursor, mode }: Props) {
  const step = trace[cursor];

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">Code</h2>

      <pre className="overflow-auto rounded-xl border border-gray-700 bg-[#0d1117] p-4">
        {code.map((line, index) => (
          <div
            key={line}
            className={`whitespace-pre rounded px-2 py-0.5 ${
              step?.codeLine === index + 1 ? "bg-blue-600/30" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </pre>

      <p className="mt-3 text-sm text-gray-400">
        {mode === "beginner"
          ? "The highlighted line matches the recursive step shown in the explanation."
          : "The active line marks the current frame operation in the recursion trace."}
      </p>
    </div>
  );
}
