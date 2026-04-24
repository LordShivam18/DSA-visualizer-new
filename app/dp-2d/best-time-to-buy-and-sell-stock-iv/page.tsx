"use client";

import DPProblemPage from "@/components/dp/shared/DPProblemPage";
import CodePanel from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iv/CodePanel";
import MainVisualizer from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iv/MainVisualizer";
import MicroscopeView from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iv/MicroscopeView";
import TracePanel from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iv/TracePanel";
import {
  defaultInputs,
  generateTrace,
  inputFields,
  presets,
} from "@/components/dp-2d/best-time-to-buy-and-sell-stock-iv/generateTrace";

export default function StockIVPage() {
  return (
    <DPProblemPage
      categoryHref="/dp-2d"
      categoryLabel="Multidimensional DP"
      taxonomy="DP state machine / k transactions / layered optimization"
      title="Best Time to Buy and Sell Stock IV"
      difficulty="Hard"
      description="Scale the trading ladder to k transactions and watch each price update a full stack of buy and sell layers."
      complexity="O(k*n) time / O(k) space"
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
