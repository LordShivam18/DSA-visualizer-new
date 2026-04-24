import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { IsomorphicStringsTraceStep } from "./generateTrace";

const code = [
  "bool isIsomorphic(string s, string t) {",
  "    if (s.size() != t.size()) return false;",
  "    unordered_map<char, char> st, ts;",
  "    for (int i = 0; i < s.size(); ++i) {",
  "        char a = s[i], b = t[i];",
  "        if ((st.count(a) && st[a] != b) || (ts.count(b) && ts[b] != a)) return false;",
  "        st[a] = b;",
  "        ts[b] = a;",
  "    }",
  "    return true;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: IsomorphicStringsTraceStep;
}) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show why bidirectional maps are the cleanest way to enforce a bijection."
      complexity="Time O(n) / Space O(k)"
      code={code}
    />
  );
}
