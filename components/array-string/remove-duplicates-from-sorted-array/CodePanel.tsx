import LightCodePanel from "../shared/LightCodePanel";
import type { RemoveDuplicatesTraceStep } from "./generateTrace";

const code = [
  "int removeDuplicates(vector<int>& nums) {",
  "    if (nums.empty()) return 0;",
  "    int write = 1;",
  "    for (int read = 1; read < nums.size(); ++read) {",
  "        if (nums[read] != nums[write - 1]) {",
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
  step: RemoveDuplicatesTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace follows the classic sorted-array slow/fast pointer pattern."
    />
  );
}
