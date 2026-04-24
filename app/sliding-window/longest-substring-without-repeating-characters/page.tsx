"use client";

import CodePanel from "../../../components/sliding-window/longest-substring-without-repeating-characters/CodePanel";
import Controls from "../../../components/sliding-window/longest-substring-without-repeating-characters/Controls";
import { generateTrace } from "../../../components/sliding-window/longest-substring-without-repeating-characters/generateTrace";
import LongestSubstringWorkbench from "../../../components/sliding-window/longest-substring-without-repeating-characters/LongestSubstringWorkbench";
import MicroscopeView from "../../../components/sliding-window/longest-substring-without-repeating-characters/MicroscopeView";
import TracePanel from "../../../components/sliding-window/longest-substring-without-repeating-characters/TracePanel";
import SlidingWindowProblemShell from "../../../components/sliding-window/shared/SlidingWindowProblemShell";

const initialInputs = {
  s: "abcabcbb",
};

const presets = [
  {
    name: "Example 1",
    output: "3",
    values: {
      s: "abcabcbb",
    },
  },
  {
    name: "Example 2",
    output: "1",
    values: {
      s: "bbbbb",
    },
  },
  {
    name: "Example 3",
    output: "3",
    values: {
      s: "pwwkew",
    },
  },
] as const;

export default function LongestSubstringWithoutRepeatingCharactersPage() {
  return (
    <SlidingWindowProblemShell
      meta={{
        title: "Longest Substring Without Repeating Characters",
        eyebrow: "Sliding Window / Duplicate Removal / Unique Substrings",
        description:
          "Let the right edge inject new characters into the substring, and whenever a repeat appears, watch the left edge sweep just far enough to restore uniqueness.",
        difficulty: "medium",
        backHref: "/sliding-window",
        backLabel: "Sliding Window",
      }}
      inputFields={[
        {
          id: "s",
          label: "s",
          placeholder: "abcabcbb",
          multiline: true,
          helper: "Enter any raw string. The visualizer treats each character as one token.",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={LongestSubstringWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
