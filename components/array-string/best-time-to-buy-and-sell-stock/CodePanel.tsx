import LightCodePanel from "../shared/LightCodePanel";
import type { StockTraceStep } from "./generateTrace";

const code = [
  "int maxProfit(vector<int>& prices) {",
  "    int minPrice = INT_MAX;",
  "    int best = 0;",
  "    for (int day = 0; day < prices.size(); ++day) {",
  "        minPrice = min(minPrice, prices[day]);",
  "        best = max(best, prices[day] - minPrice);",
  "    }",
  "    return best;",
  "}",
];

export default function CodePanel({ step }: { step: StockTraceStep }) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="Every step either improves the buy price or evaluates profit against that running minimum."
    />
  );
}
