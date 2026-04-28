"use client";

import CodePanel from "../../../components/hashmap/two-sum/CodePanel";
import Controls from "../../../components/hashmap/two-sum/Controls";
import { generateTrace } from "../../../components/hashmap/two-sum/generateTrace";
import MicroscopeView from "../../../components/hashmap/two-sum/MicroscopeView";
import TracePanel from "../../../components/hashmap/two-sum/TracePanel";
import TwoSumWorkbench from "../../../components/hashmap/two-sum/TwoSumWorkbench";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  nums: "[2,7,11,15]",
  target: "9",
};

const presets = [
  {
    name: "Example 1",
    output: "[0, 1]",
    values: {
      nums: "[2,7,11,15]",
      target: "9",
    },
  },
  {
    name: "Example 2",
    output: "[1, 2]",
    values: {
      nums: "[3,2,4]",
      target: "6",
    },
  },
  {
    name: "Example 3",
    output: "[0, 1]",
    values: {
      nums: "[3,3]",
      target: "6",
    },
  },
] as const;

export default function TwoSumPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Two Sum",
        eyebrow: "Hashmap / Complement Search / Single Pass",
        description:
          "Scan the array once, compute the missing complement for the current value, and let the hash map tell you whether that partner has already appeared.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "nums",
          label: "nums",
          placeholder: "[2,7,11,15]",
          helper: "Use JSON arrays or comma-separated numbers.",
        },
        {
          id: "target",
          label: "target",
          placeholder: "9",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={TwoSumWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
