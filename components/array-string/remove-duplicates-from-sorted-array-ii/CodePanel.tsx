import LightCodePanel from "../shared/LightCodePanel";
import type { RemoveDuplicatesIITraceStep } from "./generateTrace";

const code = [
  "int removeDuplicates(vector<int>& nums) {",
  "    int write = min(2, (int)nums.size());",
  "    for (int read = 2; read < nums.size(); ++read) {",
  "        if (nums[read] != nums[write - 2]) {",
  "            nums[write] = nums[read];",
  "            ++write;",
  "        }",
  "    }",
  "    return write;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: RemoveDuplicatesIITraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The highlighted lines show the two-slot lookback that prevents a third duplicate."
    />
  );
}
