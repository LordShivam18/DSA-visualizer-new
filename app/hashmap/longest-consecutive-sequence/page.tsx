"use client";

import CodePanel from "../../../components/hashmap/longest-consecutive-sequence/CodePanel";
import Controls from "../../../components/hashmap/longest-consecutive-sequence/Controls";
import { generateTrace } from "../../../components/hashmap/longest-consecutive-sequence/generateTrace";
import LongestConsecutiveSequenceWorkbench from "../../../components/hashmap/longest-consecutive-sequence/LongestConsecutiveSequenceWorkbench";
import MicroscopeView from "../../../components/hashmap/longest-consecutive-sequence/MicroscopeView";
import TracePanel from "../../../components/hashmap/longest-consecutive-sequence/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  nums: "[100,4,200,1,3,2]",
};

const presets = [
  {
    name: "Example 1",
    output: "4",
    values: {
      nums: "[100,4,200,1,3,2]",
    },
  },
  {
    name: "Example 2",
    output: "9",
    values: {
      nums: "[0,3,7,2,5,8,4,6,0,1]",
    },
  },
  {
    name: "Example 3",
    output: "3",
    values: {
      nums: "[1,0,1,2]",
    },
  },
] as const;

export default function LongestConsecutiveSequencePage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Longest Consecutive Sequence",
        eyebrow: "Hashmap / Hash Set / Sequence Starts",
        description:
          "Deduplicate values into a set, then expand consecutive runs only from numbers whose predecessor is missing. That single idea is what makes the solution linear.",
        difficulty: "medium",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "nums",
          label: "nums",
          placeholder: "[100,4,200,1,3,2]",
          multiline: true,
          helper: "Use a JSON array or comma-separated integers.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={LongestConsecutiveSequenceWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
