import DarkCodePanel from "../shared/DarkCodePanel";
import type { IntegerToRomanTraceStep } from "./generateTrace";

const code = [
  "string intToRoman(int num) {",
  "    vector<pair<int, string>> table = {{1000, \"M\"}, {900, \"CM\"}, {500, \"D\"}, {400, \"CD\"}, {100, \"C\"}, {90, \"XC\"}, {50, \"L\"}, {40, \"XL\"}, {10, \"X\"}, {9, \"IX\"}, {5, \"V\"}, {4, \"IV\"}, {1, \"I\"}};",
  "    string answer;",
  "    for (auto& [value, symbol] : table) {",
  "        while (num >= value) {",
  "            answer += symbol;",
  "            num -= value;",
  "        }",
  "    }",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: { step: IntegerToRomanTraceStep }) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(1)", "Space: O(1)"]}
      caption="A fixed descending denomination table turns the integer into Roman fragments greedily."
    />
  );
}
