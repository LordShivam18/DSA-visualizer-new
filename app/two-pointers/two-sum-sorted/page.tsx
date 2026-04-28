"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import ArrayCell from "@/components/two-sum/ArrayBox";
import { generateTrace } from "@/components/two-pointers/two-sum-sorted/generateTrace";

const defaultInputs = { nums: "1,2,3,4,6,8,11", target: "10" };
const presets = [{ name: "Default", summary: "found", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums, values.target);
}

export default function TwoSumSortedPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Sorted Pair Search"
      title="Two Sum II - Input Array Is Sorted"
      difficulty="Medium"
      description="Trace inward pointer movement based on comparing the current sum to target."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "1,2,3,4,6,8,11" }, { id: "target", label: "target", placeholder: "10" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="flex flex-wrap justify-center gap-4">
          {step.state.nums.map((value, index) => {
            let role: "default" | "left" | "right" | "both" | "between" | "discarded" | "solution" = "default";
            const inWindow = index >= step.state.left && index <= step.state.right;
            if (step.state.status === "found" && (index === step.state.left || index === step.state.right)) role = "solution";
            else if (!inWindow) role = "discarded";
            else if (index === step.state.left && index === step.state.right) role = "both";
            else if (index === step.state.left) role = "left";
            else if (index === step.state.right) role = "right";
            else role = "between";
            return <ArrayCell key={index} value={value} role={role} />;
          })}
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">current sum = {step.state.currentSum ?? "none"}; target = {step.state.target}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}if sum too small move left; if too large move right</pre>}
    />
  );
}
