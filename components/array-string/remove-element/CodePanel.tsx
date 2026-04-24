import LightCodePanel from "../shared/LightCodePanel";
import type { RemoveElementTraceStep } from "./generateTrace";

const code = [
  "int removeElement(vector<int>& nums, int val) {",
  "    int write = 0;",
  "    for (int read = 0; read < nums.size(); ++read) {",
  "        if (nums[read] != val) {",
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
  step: RemoveElementTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace follows the read pointer loop and the write-pointer compaction rule."
    />
  );
}
