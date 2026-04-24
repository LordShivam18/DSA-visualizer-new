import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { HappyNumberTraceStep } from "./generateTrace";

const code = [
  "bool isHappy(int n) {",
  "    unordered_set<int> seen;",
  "    while (n != 1 && !seen.count(n)) {",
  "        seen.insert(n);",
  "        int next = 0;",
  "        while (n > 0) {",
  "            int digit = n % 10;",
  "            next += digit * digit;",
  "            n /= 10;",
  "        }",
  "        n = next;",
  "    }",
  "    return n == 1;",
  "}",
];

export default function CodePanel({ step }: { step: HappyNumberTraceStep }) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show the digit-square transform wrapped in a hash-set cycle detector."
      complexity="Time O(iterations * digits) / Space O(iterations)"
      code={code}
    />
  );
}
