"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "@/components/two-pointers/container-most-water/CodePanel";
import StatsPanel from "@/components/two-pointers/container-most-water/StatsPanel";
import WaterChart from "@/components/two-pointers/container-most-water/WaterChart";
import { generateTrace } from "@/components/two-pointers/container-most-water/generateTrace";

const defaultInputs = { heights: "1,8,6,2,5,4,8,3,7" };
const presets = [{ name: "Default", summary: "max area 49", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.heights);
}

export default function ContainerMostWaterPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Area Optimization"
      title="Container With Most Water"
      difficulty="Medium"
      description="Trace inward pointer movement from the limiting wall while tracking best area."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "heights", label: "heights", placeholder: "1,8,6,2,5,4,8,3,7" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <WaterChart
          heights={step.state.heights}
          left={step.state.left}
          right={step.state.right}
          bestLeft={step.state.bestLeft}
          bestRight={step.state.bestRight}
          maxArea={step.state.maxArea}
          currentArea={step.state.currentArea}
          lastAction={step.state.lastAction}
        />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanel
          heights={step.state.heights}
          left={step.state.left}
          right={step.state.right}
          currentArea={step.state.currentArea}
          maxArea={step.state.maxArea}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <CodePanel activeLine={step.state.activeLine} />}
    />
  );
}
