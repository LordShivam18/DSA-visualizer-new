import LightCodePanel from "../shared/LightCodePanel";
import type { GasStationTraceStep } from "./generateTrace";

const code = [
  "int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {",
  "    int total = 0, tank = 0, start = 0;",
  "    for (int i = 0; i < gas.size(); ++i) {",
  "        int diff = gas[i] - cost[i];",
  "        total += diff;",
  "        tank += diff;",
  "        if (tank < 0) {",
  "            start = i + 1;",
  "            tank = 0;",
  "        }",
  "    }",
  "    return total >= 0 ? start : -1;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: GasStationTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(1)"]}
      caption="The scan only needs a total balance, a local tank, and one start candidate."
    />
  );
}
