import HashmapCodePanel from "../shared/HashmapCodePanel";
import type { WordPatternTraceStep } from "./generateTrace";

const code = [
  "bool wordPattern(string pattern, string s) {",
  "    vector<string> words = splitWords(s);",
  "    if (pattern.size() != words.size()) return false;",
  "    unordered_map<char, string> toWord;",
  "    unordered_map<string, char> toChar;",
  "    for (int i = 0; i < pattern.size(); ++i) {",
  "        char ch = pattern[i];",
  "        string word = words[i];",
  "        if ((toWord.count(ch) && toWord[ch] != word) || (toChar.count(word) && toChar[word] != ch)) return false;",
  "        toWord[ch] = word;",
  "        toChar[word] = ch;",
  "    }",
  "    return true;",
  "}",
];

export default function CodePanel({ step }: { step: WordPatternTraceStep }) {
  return (
    <HashmapCodePanel
      step={step}
      description="The highlighted C++ lines show the same two-map bijection pattern, now lifted from characters to words."
      complexity="Time O(n) / Space O(k)"
      code={code}
    />
  );
}
