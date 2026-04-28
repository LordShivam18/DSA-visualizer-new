"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/CodePanel";
import MicroscopeView from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/MicroscopeView";
import StockProfitIIVisualizer from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/StockProfitIIVisualizer";
import TracePanel from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/TracePanel";
import { generateTrace } from "../../../components/array-string/best-time-to-buy-and-sell-stock-ii/generateTrace";

const defaultInputs = { prices: "[7,1,5,3,6,4]" };
const presets = [{ name: "Default", summary: "Trace baseline", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.prices);
}

export default function BestTimeToBuyAndSellStockIIPage() {
  return (
    <TraceLessonPage
      variant="light"
      categoryHref="/array-string"
      categoryLabel="Array / String"
      taxonomy="Array / String / Greedy Profit"
      title="Best Time to Buy and Sell Stock II"
      difficulty="Medium"
      description="Trace every profitable upward price edge and accumulate unlimited transaction profit."
      complexity="O(n) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "prices", label: "prices", placeholder: "[7,1,5,3,6,4]" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <StockProfitIIVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
