const codeLines = [
  "bool isPalindrome(int x) {",
  "  if (x < 0 || (x % 10 == 0 && x != 0)) return false;",
  "  int reversedHalf = 0;",
  "  while (x > reversedHalf) {",
  "      reversedHalf = reversedHalf * 10 + x % 10;",
  "      x /= 10;",
  "  }",
  "  return (x == reversedHalf || x == reversedHalf / 10);",
  "}"
];

export default function CodePanel({ highlight }: { highlight: number }) {
  return (
    <pre className="bg-black border border-slate-600 rounded p-4 text-cyan-300 max-w-xl mt-4">
      {codeLines.map((line, i) => (
        <div
          key={i}
          className={`px-2 ${
            i === highlight ? "bg-cyan-900/40 text-white rounded" : ""
          }`}
        >
          {line}
        </div>
      ))}
    </pre>
  );
}
