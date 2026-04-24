import LightCodePanel from "../shared/LightCodePanel";
import type { JumpGameIITraceStep } from "./generateTrace";

const code = [
  "int jump(vector<int>& nums) {",
  "    int jumps = 0, currentEnd = 0, farthest = 0;",
  "    for (int i = 0; i < nums.size() - 1; ++i) {",
  "        farthest = max(farthest, i + nums[i]);",
  "        if (i == currentEnd) {",
  "            ++jumps;",
  "            currentEnd = farthest;",
  "        }",
  "    }",
  "    return jumps;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: JumpGameIITraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace mirrors the BFS-layer interpretation of the greedy jump algorithm."
    />
  );
}
