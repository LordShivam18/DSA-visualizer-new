import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { ValidAnagramTraceStep } from "./generateTrace";

const code = [
  "bool isAnagram(string s, string t) {",
  "    if (s.size() != t.size()) return false;",
  "    unordered_map<char, int> freq;",
  "    for (char ch : s) ++freq[ch];",
  "    for (char ch : t) {",
  "        if (!freq.count(ch) || freq[ch] == 0) return false;",
  "        --freq[ch];",
  "    }",
  "    return true;",
  "}",
];

export default function CodePanel({ step }: { step: ValidAnagramTraceStep }) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show how one frequency map is enough to prove multiset equality."
      complexity="Time O(n) / Space O(k)"
      code={code}
    />
  );
}
