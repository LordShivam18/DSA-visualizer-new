"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-1d/coin-change/CodePanel";
import MainVisualizer from "@/components/dp-1d/coin-change/MainVisualizer";
import MicroscopeView from "@/components/dp-1d/coin-change/MicroscopeView";
import TracePanel from "@/components/dp-1d/coin-change/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-1d/coin-change/generateTrace";

export default function CoinChangePage() {
  return (
    <DPProblemPage
      categoryHref="/dp-1d"
      categoryLabel="1D DP"
      taxonomy="1D DP / unbounded knapsack / minimum coins"
      title="Coin Change"
      difficulty="Medium"
      description="Step inside the coin forge as denominations sweep across the amount table, competing to produce the cheapest assembly for every target."
      complexity="O(coins * amount) time / O(amount) space"
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
