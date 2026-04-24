import DarkCodePanel from "../shared/DarkCodePanel";
import type { ZigzagConversionTraceStep } from "./generateTrace";

const code = [
  "string convert(string s, int numRows) {",
  "    if (numRows == 1 || numRows >= s.size()) return s;",
  "    vector<string> rows(numRows);",
  "    int row = 0;",
  "    bool goingDown = true;",
  "    for (char c : s) {",
  "        rows[row] += c;",
  "        if (row == 0) goingDown = true;",
  "        else if (row == numRows - 1) goingDown = false;",
  "        row += goingDown ? 1 : -1;",
  "    }",
  "    string answer;",
  "    for (string& part : rows) answer += part;",
  "    return answer;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: ZigzagConversionTraceStep;
}) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(n)"]}
      caption="Characters are routed into row buffers before the final top-to-bottom readout."
    />
  );
}
