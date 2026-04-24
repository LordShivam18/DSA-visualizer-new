import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { ContainsDuplicateIITraceStep } from "./generateTrace";

const code = [
  "bool containsNearbyDuplicate(vector<int>& nums, int k) {",
  "    unordered_map<int, int> last;",
  "    for (int i = 0; i < nums.size(); ++i) {",
  "        if (last.count(nums[i]) && i - last[nums[i]] <= k) return true;",
  "        last[nums[i]] = i;",
  "    }",
  "    return false;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: ContainsDuplicateIITraceStep;
}) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show how the problem collapses into a last-seen index lookup plus a distance comparison."
      complexity="Time O(n) / Space O(n)"
      code={code}
    />
  );
}
