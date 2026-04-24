import DarkCodePanel from "../shared/DarkCodePanel";
import type { TextJustificationTraceStep } from "./generateTrace";

const code = [
  "vector<string> fullJustify(vector<string>& words, int maxWidth) {",
  "    vector<string> result;",
  "    int i = 0;",
  "    while (i < words.size()) {",
  "        int j = i, letters = 0;",
  "        while (j < words.size() && letters + words[j].size() + (j - i) <= maxWidth) {",
  "            letters += words[j].size();",
  "            ++j;",
  "        }",
  "        int gaps = j - i - 1;",
  "        string line;",
  "        if (j == words.size() || gaps == 0) {",
  "            // left justify",
  "        } else {",
  "            int spaces = maxWidth - letters;",
  "            int even = spaces / gaps, extra = spaces % gaps;",
  "            // spread spaces across gaps",
  "        }",
  "        result.push_back(line);",
  "        i = j;",
  "    }",
  "    return result;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: TextJustificationTraceStep;
}) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(total chars)", "Space: O(total output)"]}
      caption="Each loop greedily packs a line, chooses the correct spacing rule, and commits one width-exact string."
    />
  );
}
