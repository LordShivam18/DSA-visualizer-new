import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { RansomNoteTraceStep } from "./generateTrace";

const code = [
  "bool canConstruct(string ransomNote, string magazine) {",
  "    unordered_map<char, int> freq;",
  "    for (char ch : magazine) {",
  "        ++freq[ch];",
  "    }",
  "    for (char ch : ransomNote) {",
  "        if (freq[ch] == 0) return false;",
  "        --freq[ch];",
  "    }",
  "    return true;",
  "}",
];

export default function CodePanel({ step }: { step: RansomNoteTraceStep }) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines follow the supply build pass and the demand consumption pass."
      complexity="Time O(m + n) / Space O(k)"
      code={code}
    />
  );
}
