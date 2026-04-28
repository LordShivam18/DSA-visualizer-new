"use client";

import CodePanel from "../../../components/hashmap/group-anagrams/CodePanel";
import Controls from "../../../components/hashmap/group-anagrams/Controls";
import { generateTrace } from "../../../components/hashmap/group-anagrams/generateTrace";
import GroupAnagramsWorkbench from "../../../components/hashmap/group-anagrams/GroupAnagramsWorkbench";
import MicroscopeView from "../../../components/hashmap/group-anagrams/MicroscopeView";
import TracePanel from "../../../components/hashmap/group-anagrams/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  strs: '["eat","tea","tan","ate","nat","bat"]',
};

const presets = [
  {
    name: "Example 1",
    output: '[["ate","eat","tea"],["nat","tan"],["bat"]]',
    values: {
      strs: '["eat","tea","tan","ate","nat","bat"]',
    },
  },
  {
    name: "Example 2",
    output: '[[""]]',
    values: {
      strs: '[""]',
    },
  },
  {
    name: "Mixed Sizes",
    output: '[["abc","bca","cab"],["foo","ofo"],["z"]]',
    values: {
      strs: '["abc","foo","bca","z","cab","ofo"]',
    },
  },
] as const;

export default function GroupAnagramsPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Group Anagrams",
        eyebrow: "Hashmap / Canonical Signatures / Bucket Grouping",
        description:
          "Normalize each word into a sorted signature and use that signature as the hash-map key. Words with identical signatures collapse into the same group.",
        difficulty: "medium",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "strs",
          label: "strs",
          placeholder: '["eat","tea","tan","ate","nat","bat"]',
          multiline: true,
          helper: "Use a JSON array or comma/newline-separated words.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={GroupAnagramsWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
