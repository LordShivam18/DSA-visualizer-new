import SlidingWindowCodePanel from "../shared/SlidingWindowCodePanel";
import type { MinimumSizeSubarraySumTraceStep } from "./generateTrace";

const code = [
  "int minSubArrayLen(int target, vector<int>& nums) {",
  "    int left = 0, sum = 0, best = INT_MAX;",
  "    for (int right = 0; right < nums.size(); ++right) {",
  "        sum += nums[right];",
  "        while (sum >= target) {",
  "            best = min(best, right - left + 1);",
  "            sum -= nums[left];",
  "            ++left;",
  "        }",
  "    }",
  "    return best == INT_MAX ? 0 : best;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: MinimumSizeSubarraySumTraceStep;
}) {
  return (
    <SlidingWindowCodePanel
      step={step}
      description="The highlighted C++ lines show the classic positive-number sliding window: grow first, then shrink greedily while valid."
      complexity="Time O(n) / Space O(1)"
      code={code}
    />
  );
}
