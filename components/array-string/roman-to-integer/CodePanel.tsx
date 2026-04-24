import DarkCodePanel from "../shared/DarkCodePanel";
import type { RomanToIntegerTraceStep } from "./generateTrace";

const code = [
  "int romanToInt(string s) {",
  "    unordered_map<char, int> value = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};",
  "    int total = 0;",
  "    for (int i = 0; i < s.size(); ++i) {",
  "        int curr = value[s[i]];",
  "        int next = i + 1 < s.size() ? value[s[i + 1]] : 0;",
  "        if (curr < next) {",
  "            total -= curr;",
  "        } else {",
  "            total += curr;",
  "        }",
  "    }",
  "    return total;",
  "}",
];

export default function CodePanel({ step }: { step: RomanToIntegerTraceStep }) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="Lookahead drives the add-versus-subtract decision for each Roman glyph."
    />
  );
}
