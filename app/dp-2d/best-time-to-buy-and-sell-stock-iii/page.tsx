"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iii/CodePanel";
import MainVisualizer from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iii/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iii/MicroscopeView";
import TracePanel from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iii/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iii/generateTrace";

export default function StockIIIPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="DP state machine / at most two transactions / profit optimization"
      title="Best Time to Buy and Sell Stock III"
      difficulty="Hard"
      description="Watch profit flow through a four-stage trading control room where each day can upgrade the first buy, first sell, second buy, or second sell state."
      complexity="O(n) time / O(1) space"
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
