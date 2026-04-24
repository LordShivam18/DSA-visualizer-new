import LightCodePanel from "../shared/LightCodePanel";
import type { StockIITraceStep } from "./generateTrace";

const code = [
  "int maxProfit(vector<int>& prices) {",
  "    int profit = 0;",
  "    for (int day = 1; day < prices.size(); ++day) {",
  "        if (prices[day] > prices[day - 1]) {",
  "            profit += prices[day] - prices[day - 1];",
  "        }",
  "    }",
  "    return profit;",
  "}",
];

export default function CodePanel({ step }: { step: StockIITraceStep }) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The trace turns each profitable adjacent rise into a concrete collected gain."
    />
  );
}
