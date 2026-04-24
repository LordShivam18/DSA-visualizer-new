import DarkCodePanel from "../shared/DarkCodePanel";
import type { LongestCommonPrefixTraceStep } from "./generateTrace";

const code = [
  "string longestCommonPrefix(vector<string>& strs) {",
  "    string prefix;",
  "    for (int col = 0; col < strs[0].size(); ++col) {",
  "        char candidate = strs[0][col];",
  "        for (int row = 1; row < strs.size(); ++row) {",
  "            if (col >= strs[row].size() || strs[row][col] != candidate) return prefix;",
  "        }",
  "        prefix += candidate;",
  "    }",
  "    return prefix;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: LongestCommonPrefixTraceStep;
}) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(total compared chars)", "Space: O(1)"]}
      caption="Only fully validated columns are allowed to extend the prefix."
    />
  );
}
