"use client";

import CodePanel from "../../../components/hashmap/ransom-note/CodePanel";
import Controls from "../../../components/hashmap/ransom-note/Controls";
import { generateTrace } from "../../../components/hashmap/ransom-note/generateTrace";
import MicroscopeView from "../../../components/hashmap/ransom-note/MicroscopeView";
import RansomNoteWorkbench from "../../../components/hashmap/ransom-note/RansomNoteWorkbench";
import TracePanel from "../../../components/hashmap/ransom-note/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  ransomNote: "aa",
  magazine: "aab",
};

const presets = [
  {
    name: "Example 1",
    output: "false",
    values: {
      ransomNote: "a",
      magazine: "b",
    },
  },
  {
    name: "Example 2",
    output: "false",
    values: {
      ransomNote: "aa",
      magazine: "ab",
    },
  },
  {
    name: "Example 3",
    output: "true",
    values: {
      ransomNote: "aa",
      magazine: "aab",
    },
  },
] as const;

export default function RansomNotePage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Ransom Note",
        eyebrow: "Hashmap / Frequency Counting / Character Bank",
        description:
          "Build a frequency table from the magazine, then spend those counts while the ransom note asks for letters. The moment a count hits zero too early, the answer becomes false.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "ransomNote",
          label: "Ransom Note",
          placeholder: "aa",
          helper: "Any raw string works. Spaces are trimmed at the edges.",
        },
        {
          id: "magazine",
          label: "Magazine",
          placeholder: "aab",
          helper: "Repeated characters add more available supply.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={RansomNoteWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
