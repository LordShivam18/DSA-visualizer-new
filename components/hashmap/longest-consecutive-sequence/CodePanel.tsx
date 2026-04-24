import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { LongestConsecutiveSequenceTraceStep } from "./generateTrace";

const code = [
  "int longestConsecutive(vector<int>& nums) {",
  "    unordered_set<int> seen(nums.begin(), nums.end());",
  "    int best = 0;",
  "    for (int num : seen) {",
  "        if (seen.count(num - 1)) continue;",
  "        int length = 1;",
  "        while (seen.count(num + length)) {",
  "            ++length;",
  "        }",
  "        best = max(best, length);",
  "    }",
  "    return best;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: LongestConsecutiveSequenceTraceStep;
}) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show the set-based O(n) strategy: skip non-starts, then expand forward."
      complexity="Time O(n) / Space O(n)"
      code={code}
    />
  );
}
