import LightCodePanel from "../shared/LightCodePanel";
import type { RandomizedSetTraceStep } from "./generateTrace";

const code = [
  "class RandomizedSet {",
  "    vector<int> values;",
  "    unordered_map<int, int> pos;",
  "public:",
  "    bool insert(int val) {",
  "        if (pos.count(val)) return false;",
  "        pos[val] = values.size();",
  "        values.push_back(val);",
  "        return true;",
  "    }",
  "    bool remove(int val) {",
  "        if (!pos.count(val)) return false;",
  "        int idx = pos[val], last = values.back();",
  "        values[idx] = last;",
  "        pos[last] = idx;",
  "        values.pop_back();",
  "        pos.erase(val);",
  "        return true;",
  "    }",
  "    int getRandom() {",
  "        return values[rand() % values.size()];",
  "    }",
  "};",
];

export default function CodePanel({
  step,
}: {
  step: RandomizedSetTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Average Time: O(1)", "Space: O(n)"]}
      caption="The trace highlights insert, swap-delete removal, and array-based random access."
    />
  );
}
