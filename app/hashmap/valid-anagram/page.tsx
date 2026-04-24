"use client";

import CodePanel from "../../../components/hashmap/valid-anagram/CodePanel";
import Controls from "../../../components/hashmap/valid-anagram/Controls";
import { generateTrace } from "../../../components/hashmap/valid-anagram/generateTrace";
import MicroscopeView from "../../../components/hashmap/valid-anagram/MicroscopeView";
import TracePanel from "../../../components/hashmap/valid-anagram/TracePanel";
import ValidAnagramWorkbench from "../../../components/hashmap/valid-anagram/ValidAnagramWorkbench";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  s: "anagram",
  t: "nagaram",
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    values: {
      s: "anagram",
      t: "nagaram",
    },
  },
  {
    name: "Example 2",
    output: "false",
    values: {
      s: "rat",
      t: "car",
    },
  },
  {
    name: "Length Clash",
    output: "false",
    values: {
      s: "ab",
      t: "aba",
    },
  },
] as const;

export default function ValidAnagramPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Valid Anagram",
        eyebrow: "Hashmap / Frequency Delta / Multiset Equality",
        description:
          "Visualize the classic two-pass frequency trick: count characters from the first string, then cancel those counts using the second string until the ledger balances or breaks.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "s",
          label: "String s",
          placeholder: "anagram",
        },
        {
          id: "t",
          label: "String t",
          placeholder: "nagaram",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={ValidAnagramWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
