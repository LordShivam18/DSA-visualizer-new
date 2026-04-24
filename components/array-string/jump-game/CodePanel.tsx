import LightCodePanel from "../shared/LightCodePanel";
import type { JumpGameTraceStep } from "./generateTrace";

const code = [
  "bool canJump(vector<int>& nums) {",
  "    int farthest = 0;",
  "    for (int i = 0; i < nums.size(); ++i) {",
  "        if (i > farthest) return false;",
  "        farthest = max(farthest, i + nums[i]);",
  "    }",
  "    return true;",
  "}",
];

export default function CodePanel({ step }: { step: JumpGameTraceStep }) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace expands the single farthest frontier that decides reachability."
    />
  );
}
