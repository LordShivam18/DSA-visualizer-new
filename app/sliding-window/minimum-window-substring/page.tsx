"use client";

import CodePanel from "../../../components/sliding-window/minimum-window-substring/CodePanel";
import Controls from "../../../components/sliding-window/minimum-window-substring/Controls";
import { generateTrace } from "../../../components/sliding-window/minimum-window-substring/generateTrace";
import MicroscopeView from "../../../components/sliding-window/minimum-window-substring/MicroscopeView";
import MinimumWindowSubstringWorkbench from "../../../components/sliding-window/minimum-window-substring/MinimumWindowSubstringWorkbench";
import TracePanel from "../../../components/sliding-window/minimum-window-substring/TracePanel";
import SlidingWindowProblemShell from "../../../components/sliding-window/shared/SlidingWindowProblemShell";

const initialInputs = {
  s: "ADOBECODEBANC",
  t: "ABC",
};

const presets = [
  {
    name: "Example 1",
    output: "BANC",
    values: {
      s: "ADOBECODEBANC",
      t: "ABC",
    },
  },
  {
    name: "Example 2",
    output: "a",
    values: {
      s: "a",
      t: "a",
    },
  },
  {
    name: "No Window",
    output: "",
    values: {
      s: "a",
      t: "aa",
    },
  },
] as const;

export default function MinimumWindowSubstringPage() {
  return (
    <SlidingWindowProblemShell
      meta={{
        title: "Minimum Window Substring",
        eyebrow: "Sliding Window / Coverage Ledger / Formed vs Required",
        description:
          "Build a live coverage window over s, track exactly when each required character count from t becomes satisfied, then tighten the window until it is as short as possible.",
        difficulty: "hard",
        backHref: "/sliding-window",
        backLabel: "Sliding Window",
      }}
      inputFields={[
        {
          id: "s",
          label: "s",
          placeholder: "ADOBECODEBANC",
          multiline: true,
        },
        {
          id: "t",
          label: "t",
          placeholder: "ABC",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={MinimumWindowSubstringWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
