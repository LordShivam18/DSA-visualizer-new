import LightCodePanel from "../shared/LightCodePanel";
import type { RotateArrayTraceStep } from "./generateTrace";

const code = [
  "void rotate(vector<int>& nums, int k) {",
  "    k %= nums.size();",
  "    reverse(nums.begin(), nums.end());",
  "    reverse(nums.begin(), nums.begin() + k);",
  "    reverse(nums.begin() + k, nums.end());",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: RotateArrayTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace expands each reverse call into the underlying two-pointer swaps."
    />
  );
}
