"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import MicroscopeView from "@/components/kgroup/MicroscopeView";
import Node3D from "@/components/kgroup/Node3D";
import { generateTrace } from "@/components/linked-list/reverse-k-group/generateTrace";

const defaultInputs = { nodes: "1,2,3,4,5,6", k: "3" };
const presets = [{ name: "Default", summary: "Reverse k groups", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.nodes, values.k);
}

export default function ReverseKGroupPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / K-group reversal"
      title="Reverse Nodes in k-Group"
      difficulty="Hard"
      description="Trace scanning, reversing, and reconnecting each complete k-sized group."
      complexity="O(n) time / O(1) extra pointer space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "nodes", label: "nodes", placeholder: "1,2,3,4,5,6" }, { id: "k", label: "k", placeholder: "3" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="glass-card flex flex-wrap items-center justify-center gap-6 p-6">
          {step.state.nodes.map((value, index) => {
            const inGroup = index >= step.state.start && index < step.state.end && step.state.stage !== "done";
            return <Node3D key={index} value={value} isInGroup={inGroup} isReversing={step.state.stage === "apply-reverse" && inGroup} />;
          })}
        </div>
      )}
      renderMicroscope={({ step }) => <MicroscopeView chunk={step.state.currentChunk} loopStep={step.state.loopStep} stage={step.state.stage} />}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={() => <pre className="glass-card p-4 text-xs text-slate-300">find kth node{"\n"}reverse group{"\n"}reconnect group</pre>}
    />
  );
}
