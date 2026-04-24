import LightCodePanel from "../shared/LightCodePanel";
import type { MajorityElementTraceStep } from "./generateTrace";

const code = [
  "int majorityElement(vector<int>& nums) {",
  "    int candidate = 0, count = 0;",
  "    for (int value : nums) {",
  "        if (count == 0) candidate = value;",
  "        if (value == candidate) {",
  "            ++count;",
  "        } else {",
  "            --count;",
  "        }",
  "    }",
  "    return candidate;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: MajorityElementTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace maps directly to candidate resets, vote reinforcement, and vote cancellation."
    />
  );
}
