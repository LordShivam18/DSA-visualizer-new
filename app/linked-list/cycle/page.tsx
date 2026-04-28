"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import Arrow from "@/components/Arrow";
import Node from "@/components/Node";
import Pointer from "@/components/Pointer";
import { generateTrace } from "@/components/linked-list/cycle/generateTrace";

const defaultInputs = { nodes: "1,2,3,4,5", cyclePos: "2" };
const presets = [{ name: "Default", summary: "Cycle at index 2", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nodes, values.cyclePos);
}

export default function CyclePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Floyd Cycle Detection"
      title="Linked List Cycle"
      difficulty="Easy"
      description="Trace slow and fast pointers until they meet or fast reaches the end."
      complexity="O(n) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "nodes", label: "nodes", placeholder: "1,2,3,4,5" },
        { id: "cyclePos", label: "cyclePos", placeholder: "2" },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="glass-card p-6">
          <div className="relative mb-4 h-12">
            <Pointer type="slow" position={step.state.slowIndex * 110} />
            <Pointer type="fast" position={step.state.fastIndex * 110} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {step.state.nodes.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <Node value={value} isCycleNode={step.state.cycleFound && index === step.state.slowIndex} />
                {index < step.state.nodes.length - 1 ? <Arrow /> : step.state.hasCycle ? <Arrow type="cycle" /> : null}
              </div>
            ))}
          </div>
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">slow = {step.state.slowIndex}; fast = {step.state.fastIndex}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">while (fast && fast.next) {"\n"}  slow = slow.next{"\n"}  fast = fast.next.next{"\n"}  if (slow === fast) return true{"\n"}</pre>}
    />
  );
}
