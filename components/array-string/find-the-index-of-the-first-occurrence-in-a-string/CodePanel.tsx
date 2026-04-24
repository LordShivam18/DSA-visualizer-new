import DarkCodePanel from "../shared/DarkCodePanel";
import type { FirstOccurrenceTraceStep } from "./generateTrace";

const code = [
  "int strStr(string haystack, string needle) {",
  "    for (int i = 0; i + needle.size() <= haystack.size(); ++i) {",
  "        int j = 0;",
  "        while (j < needle.size() && haystack[i + j] == needle[j]) {",
  "            ++j;",
  "        }",
  "        if (j == needle.size()) return i;",
  "    }",
  "    return -1;",
  "}",
];

export default function CodePanel({ step }: { step: FirstOccurrenceTraceStep }) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O((n - m + 1) * m)", "Space: O(1)"]}
      caption="Each candidate start runs an inner left-to-right comparison until it fails or fully matches."
    />
  );
}
