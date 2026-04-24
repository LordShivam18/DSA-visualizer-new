import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { TwoSumTraceStep } from "./generateTrace";

const code = [
  "vector<int> twoSum(vector<int>& nums, int target) {",
  "    unordered_map<int, int> seen;",
  "    for (int i = 0; i < nums.size(); ++i) {",
  "        int need = target - nums[i];",
  "        if (seen.count(need)) return {seen[need], i};",
  "        seen[nums[i]] = i;",
  "    }",
  "    return {};",
  "}",
];

export default function CodePanel({ step }: { step: TwoSumTraceStep }) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines follow the one-pass complement lookup strategy."
      complexity="Time O(n) / Space O(n)"
      code={code}
    />
  );
}
