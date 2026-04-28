"use client";

import CodePanel from "../../../components/sliding-window/minimum-size-subarray-sum/CodePanel";
import Controls from "../../../components/sliding-window/minimum-size-subarray-sum/Controls";
import { generateTrace } from "../../../components/sliding-window/minimum-size-subarray-sum/generateTrace";
import MicroscopeView from "../../../components/sliding-window/minimum-size-subarray-sum/MicroscopeView";
import MinimumSizeSubarraySumWorkbench from "../../../components/sliding-window/minimum-size-subarray-sum/MinimumSizeSubarraySumWorkbench";
import TracePanel from "../../../components/sliding-window/minimum-size-subarray-sum/TracePanel";
import SlidingWindowProblemShell from "../../../components/sliding-window/shared/SlidingWindowProblemShell";

const initialInputs = {
  target: "7",
  nums: "[2,3,1,2,4,3]",
};

const presets = [
  {
    name: "Example 1",
    output: "2",
    values: {
      target: "7",
      nums: "[2,3,1,2,4,3]",
    },
  },
  {
    name: "Example 2",
    output: "1",
    values: {
      target: "4",
      nums: "[1,4,4]",
    },
  },
  {
    name: "Example 3",
    output: "0",
    values: {
      target: "11",
      nums: "[1,1,1,1,1,1,1,1]",
    },
  },
] as const;

export default function MinimumSizeSubarraySumPage() {
  return (
    <SlidingWindowProblemShell
      meta={{
        title: "Minimum Size Subarray Sum",
        eyebrow: "Sliding Window / Positive Array / Tightening Windows",
        description:
          "Watch the live window grow until its sum reaches the target, then contract immediately to squeeze out the smallest valid answer.",
        difficulty: "medium",
        backHref: "/sliding-window",
        backLabel: "Sliding Window",
      }}
      inputFields={[
        {
          id: "target",
          label: "target",
          placeholder: "7",
        },
        {
          id: "nums",
          label: "nums",
          placeholder: "[2,3,1,2,4,3]",
          multiline: true,
          helper: "Use a JSON array or comma-separated positive integers.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      generateTrace={generateTrace}
      Visualization={MinimumSizeSubarraySumWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
