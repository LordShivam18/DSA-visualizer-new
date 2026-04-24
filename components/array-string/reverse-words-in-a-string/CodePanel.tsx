import DarkCodePanel from "../shared/DarkCodePanel";
import type { ReverseWordsTraceStep } from "./generateTrace";

const code = [
  "string reverseWords(string s) {",
  "    stringstream ss(s);",
  "    vector<string> words;",
  "    string word;",
  "    while (ss >> word) {",
  "        words.push_back(word);",
  "    }",
  "    reverse(words.begin(), words.end());",
  "    string answer;",
  "    for (int i = 0; i < words.size(); ++i) {",
  "        if (i > 0) answer += \" \";",
  "        answer += words[i];",
  "    }",
  "    return answer;",
  "}",
];

export default function CodePanel({ step }: { step: ReverseWordsTraceStep }) {
  return (
    <DarkCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(n)", "Space: O(k) words"]}
      caption="The cleaned token list is reversed, then joined with single spaces."
    />
  );
}
