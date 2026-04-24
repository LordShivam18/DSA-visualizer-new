import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { GroupAnagramsTraceStep } from "./generateTrace";

const code = [
  "vector<vector<string>> groupAnagrams(vector<string>& strs) {",
  "    unordered_map<string, vector<string>> groups;",
  "    for (string word : strs) {",
  "        string key = word;",
  "        sort(key.begin(), key.end());",
  "        groups[key].push_back(word);",
  "    }",
  "    vector<vector<string>> ans;",
  "    for (auto& [key, bucket] : groups) ans.push_back(bucket);",
  "    return ans;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: GroupAnagramsTraceStep;
}) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show how sorted signatures become hash-map keys for each anagram class."
      complexity="Time O(n * k log k) / Space O(n * k)"
      code={code}
    />
  );
}
