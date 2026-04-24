import LightCodePanel from "../shared/LightCodePanel";
import type { ProductExceptSelfTraceStep } from "./generateTrace";

const code = [
  "vector<int> productExceptSelf(vector<int>& nums) {",
  "    int n = nums.size();",
  "    vector<int> answer(n, 1);",
  "    int prefix = 1;",
  "    for (int i = 0; i < n; ++i) {",
  "        answer[i] = prefix;",
  "        prefix *= nums[i];",
  "    }",
  "    int suffix = 1;",
  "    for (int i = n - 1; i >= 0; --i) {",
  "        answer[i] *= suffix;",
  "        suffix *= nums[i];",
  "    }",
  "    return answer;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: ProductExceptSelfTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1) extra"]}
      caption="The trace alternates between prefix writes and suffix multiplications."
    />
  );
}
