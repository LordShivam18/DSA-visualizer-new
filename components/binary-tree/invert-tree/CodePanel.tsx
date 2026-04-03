export default function CodePanel({ trace, cursor, mode }: any) {
  const step = trace[cursor];

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Code</h2>

      <pre className="bg-[#0d1117] p-4 rounded-xl border border-gray-700 overflow-auto">
        {code.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre ${
              step?.codeLine === i + 1 ? "bg-blue-600/30" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
