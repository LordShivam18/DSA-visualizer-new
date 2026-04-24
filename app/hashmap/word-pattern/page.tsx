"use client";

import CodePanel from "../../../components/hashmap/word-pattern/CodePanel";
import Controls from "../../../components/hashmap/word-pattern/Controls";
import { generateTrace } from "../../../components/hashmap/word-pattern/generateTrace";
import MicroscopeView from "../../../components/hashmap/word-pattern/MicroscopeView";
import TracePanel from "../../../components/hashmap/word-pattern/TracePanel";
import WordPatternWorkbench from "../../../components/hashmap/word-pattern/WordPatternWorkbench";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  pattern: "abba",
  s: "dog cat cat dog",
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    values: {
      pattern: "abba",
      s: "dog cat cat dog",
    },
  },
  {
    name: "Word Clash",
    output: "false",
    values: {
      pattern: "abba",
      s: "dog cat cat fish",
    },
  },
  {
    name: "Target Reuse",
    output: "false",
    values: {
      pattern: "ab",
      s: "dog dog",
    },
  },
] as const;

export default function WordPatternPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Word Pattern",
        eyebrow: "Hashmap / Bijection / Pattern Matching",
        description:
          "Treat each pattern letter like a symbol that must consistently map to one whole word, while each word stays owned by exactly one symbol.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "pattern",
          label: "Pattern",
          placeholder: "abba",
        },
        {
          id: "s",
          label: "Sentence",
          placeholder: "dog cat cat dog",
          helper: "Words are split on spaces.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={WordPatternWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
