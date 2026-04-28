"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import BarView from "@/components/binary-search/search-insert-position/BarView";
import CodePanelBS from "@/components/binary-search/search-insert-position/CodePanelBS";
import StatsPanelBS from "@/components/binary-search/search-insert-position/StatsPanelBS";
import { generateTrace } from "@/components/binary-search/search-insert-position/generateTrace";

const defaultInputs = { nums: "1,3,5,6", target: "5" };
const presets = [{ name: "Default", summary: "index 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.nums, values.target));
}

export default function SearchInsertPositionPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Lower Bound"
      title="Search Insert Position"
      difficulty="Easy"
      description="Trace the lower-bound binary search that returns the found index or insertion point."
      complexity="O(log n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nums", label: "nums", placeholder: "1,3,5,6" },
        { id: "target", label: "target", placeholder: "5" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <BarView
          nums={step.state.nums}
          left={step.state.left}
          right={step.state.right}
          mid={step.state.mid}
          target={step.state.target}
          insertPos={step.state.insertPos}
          status={step.state.status}
        />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <StatsPanelBS
          nums={step.state.nums}
          left={step.state.left}
          right={step.state.right}
          mid={step.state.mid}
          target={step.state.target}
          insertPos={step.state.insertPos}
          status={step.state.status}
          mode={teachingMode}
        />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step, teachingMode }) => <CodePanelBS activeLine={step.state.activeLine} mode={teachingMode} />}
    />
  );
}
