import LightCodePanel from "../shared/LightCodePanel";
import type { CandyTraceStep } from "./generateTrace";

const code = [
  "int candy(vector<int>& ratings) {",
  "    int n = ratings.size();",
  "    vector<int> candies(n, 1);",
  "    for (int i = 1; i < n; ++i) {",
  "        if (ratings[i] > ratings[i - 1]) {",
  "            candies[i] = candies[i - 1] + 1;",
  "        }",
  "    }",
  "    for (int i = n - 2; i >= 0; --i) {",
  "        if (ratings[i] > ratings[i + 1]) {",
  "            candies[i] = max(candies[i], candies[i + 1] + 1);",
  "        }",
  "    }",
  "    return accumulate(candies.begin(), candies.end(), 0);",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: CandyTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(n)"]}
      caption="The trace alternates between a forward constraint pass and a backward correction pass."
    />
  );
}
