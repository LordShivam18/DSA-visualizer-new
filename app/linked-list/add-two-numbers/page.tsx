"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import AddArrow from "@/components/linked-list/add-two-numbers/AddArrow";
import AddNode from "@/components/linked-list/add-two-numbers/AddNode";
import AddPointer from "@/components/linked-list/add-two-numbers/AddPointer";
import { generateTrace } from "@/components/linked-list/add-two-numbers/generateTrace";

const defaultInputs = { l1: "2,4,3", l2: "5,6,4" };
const presets = [{ name: "Default", summary: "342 + 465", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.l1, values.l2);
}

function ListRow({ label, values }: { label: string; values: number[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 text-xs uppercase tracking-wider text-cyan-300">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <AddNode value={value} />
          {index < values.length - 1 ? <AddArrow /> : null}
        </div>
      ))}
    </div>
  );
}

export default function AddTwoNumbersPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Digit Carry"
      title="Add Two Numbers"
      difficulty="Medium"
      description="Trace digit-by-digit linked-list addition with carry propagation."
      complexity="O(max(m,n)) time / O(max(m,n)) output"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "l1", label: "l1", placeholder: "2,4,3" },
        { id: "l2", label: "l2", placeholder: "5,6,4" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => {
        const pos1 = step.state.i1 * 90;
        const pos2 = step.state.i2 * 90;
        return (
          <div className="glass-card p-6">
            <div className="relative mb-3 h-12">
              <AddPointer type="p1" position={pos1} />
              <AddPointer type="p2" position={pos2} />
            </div>
            <div className="space-y-3">
              <ListRow label="L1" values={step.state.l1} />
              <ListRow label="L2" values={step.state.l2} />
              <ListRow label="Result" values={step.state.result} />
            </div>
          </div>
        );
      }}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">carry = {step.state.carry}; last sum = {step.state.sum}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (l1 || l2 || carry) {"\n"}  sum = x + y + carry{"\n"}  append(sum % 10){"\n"}  carry = Math.floor(sum / 10){"\n"}</pre>}
    />
  );
}
