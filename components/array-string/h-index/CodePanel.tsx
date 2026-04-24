import LightCodePanel from "../shared/LightCodePanel";
import type { HIndexTraceStep } from "./generateTrace";

const code = [
  "int hIndex(vector<int>& citations) {",
  "    sort(citations.rbegin(), citations.rend());",
  "    int h = 0;",
  "    for (int i = 0; i < citations.size(); ++i) {",
  "        if (citations[i] >= i + 1) h = i + 1;",
  "        else break;",
  "    }",
  "    return h;",
  "}",
];

export default function CodePanel({ step }: { step: HIndexTraceStep }) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n log n)", "Space: O(1) to O(n) depending on sort"]}
      caption="The trace maps the sorted threshold test directly onto the C++ loop."
    />
  );
}
