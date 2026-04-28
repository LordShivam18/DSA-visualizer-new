"use client";

import CodePanel from "../../../components/hashmap/contains-duplicate-ii/CodePanel";
import ContainsDuplicateIIWorkbench from "../../../components/hashmap/contains-duplicate-ii/ContainsDuplicateIIWorkbench";
import Controls from "../../../components/hashmap/contains-duplicate-ii/Controls";
import { generateTrace } from "../../../components/hashmap/contains-duplicate-ii/generateTrace";
import MicroscopeView from "../../../components/hashmap/contains-duplicate-ii/MicroscopeView";
import TracePanel from "../../../components/hashmap/contains-duplicate-ii/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  nums: "[1,2,3,1]",
  k: "3",
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    values: {
      nums: "[1,2,3,1]",
      k: "3",
    },
  },
  {
    name: "Example 2",
    output: "true",
    values: {
      nums: "[1,0,1,1]",
      k: "1",
    },
  },
  {
    name: "Example 3",
    output: "false",
    values: {
      nums: "[1,2,3,1,2,3]",
      k: "2",
    },
  },
] as const;

export default function ContainsDuplicateIIPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Contains Duplicate II",
        eyebrow: "Hashmap / Last Seen Index / Distance Window",
        description:
          "Store the latest index for each number, then let every repeat instantly measure its gap to the previous occurrence and compare that gap with k.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "nums",
          label: "nums",
          placeholder: "[1,2,3,1]",
          helper: "Use JSON arrays or comma-separated integers.",
        },
        {
          id: "k",
          label: "k",
          placeholder: "3",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={ContainsDuplicateIIWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
