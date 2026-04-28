"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import PointerTag from "@/components/three-sum/PointerTag";
import SumBar from "@/components/three-sum/SumBar";
import ValueNode from "@/components/three-sum/ValueNode";
import { generateTrace } from "@/components/two-pointers/three-sum/generateTrace";

const defaultInputs = { nums: "-4,-1,-1,0,1,2" };
const presets = [{ name: "Default", summary: "two triplets", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nums);
}

export default function ThreeSumPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Sorted Triplet Search"
      title="3Sum"
      difficulty="Medium"
      description="Trace each pivot and two-pointer sweep that discovers unique zero-sum triplets."
      complexity="O(n^2) time / O(1) extra space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nums", label: "nums", placeholder: "-4,-1,-1,0,1,2" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => {
        const solution = new Set(step.state.triplets.flatMap((triplet) => triplet.indices));
        const currentA = step.state.i >= 0 ? step.state.nums[step.state.i] : null;
        const currentB = step.state.left >= 0 ? step.state.nums[step.state.left] : null;
        const currentC = step.state.right >= 0 ? step.state.nums[step.state.right] : null;
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {step.state.nums.map((value, index) => (
                <ValueNode key={index} value={value} index={index} isPivot={index === step.state.i} isLeft={index === step.state.left} isRight={index === step.state.right} isInSolution={solution.has(index)} />
              ))}
            </div>
            <div className="flex gap-3">
              {step.state.nums.map((_, index) => (
                <div key={index} className="flex w-14 justify-center">
                  {index === step.state.i ? <PointerTag label="i" /> : null}
                  {index === step.state.left ? <PointerTag label="L" /> : null}
                  {index === step.state.right ? <PointerTag label="R" /> : null}
                </div>
              ))}
            </div>
            <SumBar a={currentA} b={currentB} c={currentC} sum={step.state.currentSum} />
          </div>
        );
      }}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">triplets found = {step.state.triplets.length}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}sort; fix pivot; sweep with L/R</pre>}
    />
  );
}
