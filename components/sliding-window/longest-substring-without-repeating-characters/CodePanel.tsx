import SlidingWindowCodePanel from "../shared/SlidingWindowCodePanel";
import type { LongestSubstringWithoutRepeatingCharactersTraceStep } from "./generateTrace";

const code = [
  "int lengthOfLongestSubstring(string s) {",
  "    unordered_map<char, int> count;",
  "    int left = 0, best = 0;",
  "    for (int right = 0; right < s.size(); ++right) {",
  "        ++count[s[right]];",
  "        while (count[s[right]] > 1) {",
  "            --count[s[left]];",
  "            ++left;",
  "        }",
  "        best = max(best, right - left + 1);",
  "    }",
  "    return best;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: LongestSubstringWithoutRepeatingCharactersTraceStep;
}) {
  return (
    <SlidingWindowCodePanel
      step={step}
      description="The highlighted C++ lines show the duplicate-aware sliding window: add, flush, then score."
      complexity="Time O(n) / Space O(k)"
      code={code}
    />
  );
}
