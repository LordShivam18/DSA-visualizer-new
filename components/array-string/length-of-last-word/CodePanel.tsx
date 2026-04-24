import DarkCodePanel from "../shared/DarkCodePanel";
import type { LengthOfLastWordTraceStep } from "./generateTrace";

const code = [
  "int lengthOfLastWord(string s) {",
  "    int i = s.size() - 1;",
  "    while (i >= 0 && s[i] == ' ') {",
  "        --i;",
  "    }",
  "    int length = 0;",
  "    while (i >= 0 && s[i] != ' ') {",
  "        ++length;",
  "        --i;",
  "    }",
  "    return length;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: LengthOfLastWordTraceStep;
}) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The tail scan skips suffix spaces first, then counts the final run of letters."
    />
  );
}
