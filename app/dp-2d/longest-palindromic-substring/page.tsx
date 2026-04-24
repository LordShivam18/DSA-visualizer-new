"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/longest-palindromic-substring/CodePanel";
import MainVisualizer from "@/components/dp-2d/longest-palindromic-substring/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/longest-palindromic-substring/MicroscopeView";
import TracePanel from "@/components/dp-2d/longest-palindromic-substring/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/longest-palindromic-substring/generateTrace";

export default function LongestPalindromicSubstringPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="2D DP / substring windows / palindrome table"
      title="Longest Palindromic Substring"
      difficulty="Medium"
      description="Scan a resonance table of substring windows and watch mirrored endpoints light up the longest valid palindrome in the string."
      complexity="O(n²) time / O(n²) space"
      inputFields={inputFields}
      defaultInputs={defaultInputs}
      presets={presets}
      buildTrace={generateTrace}
      MainVisualizer={MainVisualizer}
      MicroscopeView={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
