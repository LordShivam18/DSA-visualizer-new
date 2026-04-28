"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import MergeArrow from "@/components/linked-list/merge-two-sorted-lists/MergeArrow";
import MergeNode from "@/components/linked-list/merge-two-sorted-lists/MergeNode";
import MergePointer from "@/components/linked-list/merge-two-sorted-lists/MergePointer";
import { generateTrace } from "@/components/linked-list/merge-two-sorted-lists/generateTrace";

const defaultInputs = { l1: "1,3,5", l2: "2,4,6" };
const presets = [{ name: "Default", summary: "Merge sorted lists", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.l1, values.l2);
}

function Row({ label, values }: { label: string; values: number[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 text-xs uppercase tracking-wider text-cyan-300">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <MergeNode value={value} />
          {index < values.length - 1 ? <MergeArrow /> : null}
        </div>
      ))}
    </div>
  );
}

export default function MergeTwoSortedListsPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Merge"
      title="Merge Two Sorted Lists"
      difficulty="Easy"
      description="Trace the smaller-head selection that builds one sorted linked list."
      complexity="O(m+n) time / O(1) pointer space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "l1", label: "l1", placeholder: "1,3,5" }, { id: "l2", label: "l2", placeholder: "2,4,6" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="grid gap-4">
          <div className="glass-card p-5">
            <div className="relative mb-2 h-10"><MergePointer type="p1" position={step.state.i1 * 80} /></div>
            <Row label="List 1" values={step.state.l1} />
          </div>
          <div className="glass-card p-5">
            <div className="relative mb-2 h-10"><MergePointer type="p2" position={step.state.i2 * 80} /></div>
            <Row label="List 2" values={step.state.l2} />
          </div>
          <div className="glass-card p-5"><Row label="Merged" values={step.state.result} /></div>
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">picked = {step.state.pickedValue ?? "none"} from {step.state.pickedFrom ?? "-"}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (l1 && l2) append(smaller head){"\n"}append(remaining list)</pre>}
    />
  );
}
