import SlidingWindowCodePanel from "../shared/SlidingWindowCodePanel";
import type { MinimumWindowSubstringTraceStep } from "./generateTrace";

const code = [
  "string minWindow(string s, string t) {",
  "    unordered_map<char, int> need, have;",
  "    for (char ch : t) ++need[ch];",
  "    int required = need.size(), formed = 0;",
  "    int left = 0, bestLen = INT_MAX, bestStart = 0;",
  "    for (int right = 0; right < s.size(); ++right) {",
  "        char ch = s[right];",
  "        ++have[ch];",
  "        if (need.count(ch) && have[ch] == need[ch]) ++formed;",
  "        while (formed == required) {",
  "            if (right - left + 1 < bestLen) {",
  "                bestLen = right - left + 1;",
  "                bestStart = left;",
  "            }",
  "            char out = s[left];",
  "            --have[out];",
  "            if (need.count(out) && have[out] < need[out]) --formed;",
  "            ++left;",
  "        }",
  "    }",
  "    return bestLen == INT_MAX ? \"\" : s.substr(bestStart, bestLen);",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: MinimumWindowSubstringTraceStep;
}) {
  return (
    <SlidingWindowCodePanel
      step={step}
      description="The highlighted C++ lines show the formed/required template for minimum covering windows."
      complexity="Time O(m + n) / Space O(k)"
      code={code}
    />
  );
}
