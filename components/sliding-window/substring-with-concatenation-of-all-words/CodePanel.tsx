import SlidingWindowCodePanel from "../shared/SlidingWindowCodePanel";
import type { SubstringWithConcatenationOfAllWordsTraceStep } from "./generateTrace";

const code = [
  "vector<int> findSubstring(string s, vector<string>& words) {",
  "    unordered_map<string, int> need;",
  "    for (string word : words) ++need[word];",
  "    int w = words[0].size(), m = words.size();",
  "    vector<int> ans;",
  "    for (int offset = 0; offset < w; ++offset) {",
  "        unordered_map<string, int> window;",
  "        int left = offset, count = 0;",
  "        for (int right = offset; right + w <= s.size(); right += w) {",
  "            string word = s.substr(right, w);",
  "            if (!need.count(word)) {",
  "                window.clear();",
  "                count = 0;",
  "                left = right + w;",
  "                continue;",
  "            }",
  "            ++window[word];",
  "            ++count;",
  "            while (window[word] > need[word]) {",
  "                string leftWord = s.substr(left, w);",
  "                --window[leftWord];",
  "                --count;",
  "                left += w;",
  "            }",
  "            if (count == m) ans.push_back(left);",
  "        }",
  "    }",
  "    return ans;",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: SubstringWithConcatenationOfAllWordsTraceStep;
}) {
  return (
    <SlidingWindowCodePanel
      step={step}
      description="The highlighted C++ lines show the offset-partitioned sliding window for aligned word chunks."
      complexity="Time O(n * wordLength) / Space O(k)"
      code={code}
    />
  );
}
