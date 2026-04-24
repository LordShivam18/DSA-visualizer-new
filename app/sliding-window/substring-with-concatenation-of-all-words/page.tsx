"use client";

import CodePanel from "../../../components/sliding-window/substring-with-concatenation-of-all-words/CodePanel";
import Controls from "../../../components/sliding-window/substring-with-concatenation-of-all-words/Controls";
import { generateTrace } from "../../../components/sliding-window/substring-with-concatenation-of-all-words/generateTrace";
import MicroscopeView from "../../../components/sliding-window/substring-with-concatenation-of-all-words/MicroscopeView";
import SubstringConcatWorkbench from "../../../components/sliding-window/substring-with-concatenation-of-all-words/SubstringConcatWorkbench";
import TracePanel from "../../../components/sliding-window/substring-with-concatenation-of-all-words/TracePanel";
import SlidingWindowProblemShell from "../../../components/sliding-window/shared/SlidingWindowProblemShell";

const initialInputs = {
  s: "barfoothefoobarman",
  words: '["foo","bar"]',
};

const presets = [
  {
    name: "Example 1",
    output: "[0, 9]",
    values: {
      s: "barfoothefoobarman",
      words: '["foo","bar"]',
    },
  },
  {
    name: "No Match",
    output: "[]",
    values: {
      s: "wordgoodgoodgoodbestword",
      words: '["word","good","best","word"]',
    },
  },
  {
    name: "Multiple Hits",
    output: "[6, 9, 12]",
    values: {
      s: "barfoofoobarthefoobarman",
      words: '["bar","foo","the"]',
    },
  },
] as const;

export default function SubstringWithConcatenationOfAllWordsPage() {
  return (
    <SlidingWindowProblemShell
      meta={{
        title: "Substring with Concatenation of All Words",
        eyebrow: "Sliding Window / Offset Lanes / Word-Frequency Matching",
        description:
          "Split the source string into offset-aligned word chunks, run one sliding window per lane, and watch valid concatenation starts appear whenever the word multiset matches exactly.",
        difficulty: "hard",
        backHref: "/sliding-window",
        backLabel: "Sliding Window",
      }}
      inputFields={[
        {
          id: "s",
          label: "s",
          placeholder: "barfoothefoobarman",
          multiline: true,
        },
        {
          id: "words",
          label: "words",
          placeholder: '["foo","bar"]',
          multiline: true,
          helper: "Use a JSON array or comma/newline-separated words of equal length.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={SubstringConcatWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
