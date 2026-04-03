"use client";

import { useState, useCallback } from "react";
import Node from "@/components/Node";
import Arrow from "@/components/Arrow";
import Pointer from "@/components/Pointer";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  {
    key: "nodes",
    label: "Node values (comma-separated)",
    type: "array",
    placeholder: "e.g. 1,2,3,4,5",
    defaultValue: "1,2,3,4,5,3",
  },
  {
    key: "cyclePos",
    label: "Cycle position index (-1 for no cycle)",
    type: "number",
    placeholder: "e.g. 2 (0-indexed)",
    defaultValue: "2",
  },
];

const presets: PresetExample[] = [
  { name: "Example 1: Cycle at 2", values: { nodes: "1,2,3,4,5,3", cyclePos: "2" } },
  { name: "Example 2: No Cycle", values: { nodes: "1,2,3,4,5", cyclePos: "-1" } },
];

export default function CycleDetection() {
  const [nodes, setNodes] = useState([1, 2, 3, 4, 5, 3]);
  const [hasCycle, setHasCycle] = useState(true);
  const [cycleTargetIdx, setCycleTargetIdx] = useState(2);

  const [slowIndex, setSlowIndex] = useState(0);
  const [fastIndex, setFastIndex] = useState(0);
  const [explanation, setExplanation] = useState("Click Step to begin detecting cycle.");
  const [cycleFound, setCycleFound] = useState(false);
  const [noCycle, setNoCycle] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const NODE_GAP = 110;
  const slowPos = slowIndex * NODE_GAP;
  const fastPos = fastIndex * NODE_GAP;

  const handleRun = useCallback((values: Record<string, string>) => {
    const nodeVals = values.nodes.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    const pos = parseInt(values.cyclePos) || -1;

    if (nodeVals.length === 0) return;

    setNodes(nodeVals);
    setCycleTargetIdx(pos);
    setHasCycle(pos >= 0 && pos < nodeVals.length);
    setSlowIndex(0);
    setFastIndex(0);
    setCycleFound(false);
    setNoCycle(false);
    setStepCount(0);
    setExplanation("Click Step to begin detecting cycle.");
    sounds.click();
  }, []);

  function step() {
    if (cycleFound || noCycle) return;

    setStepCount((c) => c + 1);

    if (!hasCycle) {
      // No cycle — fast pointer reaches end
      let newSlow = slowIndex + 1;
      let newFast = fastIndex + 2;

      if (newFast >= nodes.length || newFast + 1 >= nodes.length) {
        setNoCycle(true);
        setExplanation(`No cycle detected! Fast pointer reached the end of the list.`);
        sounds.success();
        return;
      }

      setSlowIndex(newSlow);
      setFastIndex(newFast);
      setExplanation(`Slow moved to ${nodes[newSlow]}, Fast moved to ${nodes[newFast]}.`);
      sounds.tick();
    } else {
      let newSlow = (slowIndex + 1) % nodes.length;
      let newFast = (fastIndex + 2) % nodes.length;

      setSlowIndex(newSlow);
      setFastIndex(newFast);

      if (newSlow === newFast) {
        setCycleFound(true);
        setExplanation(`Cycle detected! Slow and Fast met at value ${nodes[newSlow]}.`);
        sounds.success();
      } else {
        setExplanation(`Slow moved to ${nodes[newSlow]}, Fast moved to ${nodes[newFast]}.`);
        sounds.tick();
      }
    }
  }

  function reset() {
    setSlowIndex(0);
    setFastIndex(0);
    setCycleFound(false);
    setNoCycle(false);
    setStepCount(0);
    setExplanation("Click Step to begin detecting cycle.");
    sounds.reset();
  }

  const isDone = cycleFound || noCycle;
  const outputResult = cycleFound
    ? `🔄 Cycle detected at node value ${nodes[slowIndex]} (index ${slowIndex})`
    : noCycle
    ? `✅ No cycle found — the list is acyclic`
    : null;

  return (
    <div className="min-h-screen grid-pattern text-white p-10 flex flex-col items-center gap-8">
      {/* Back */}
      <div className="w-full max-w-3xl">
        <BackButton href="/linked-list" label="Linked List" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Linked List <span className="text-cyan-400 text-glow-cyan">Cycle Detection</span>
      </h1>

      {/* Input Panel */}
      <InputPanel
        fields={inputFields}
        presets={presets}
        onRun={handleRun}
        accentColor="#22d3ee"
      />

      {/* Visualization */}
      <div className="flex flex-col items-center">
        {/* Pointer layer */}
        <div className="relative h-12 w-full mb-4">
          <Pointer type="slow" position={slowPos} />
          <Pointer type="fast" position={fastPos} />
        </div>

        {/* Nodes + Arrows */}
        <div className="flex items-center gap-2 flex-wrap">
          {nodes.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <Node
                value={value}
                isCycleNode={cycleFound && index === slowIndex}
              />
              {index < nodes.length - 1 && <Arrow />}
              {index === nodes.length - 1 && hasCycle && <Arrow type="cycle" />}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="glass-card text-gray-200 p-4 max-w-xl text-center text-sm">
        {explanation}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={step}
          disabled={isDone}
          className="btn-neon btn-neon-cyan px-7 py-2"
        >
          {isDone ? "Done" : "Step →"}
        </button>
        <button onClick={reset} className="btn-neon btn-ghost px-7 py-2">
          Reset
        </button>
      </div>

      {/* Output */}
      <OutputPanel
        result={outputResult}
        success={cycleFound ? true : noCycle ? true : null}
        stepCount={stepCount}
        complexity="O(n)"
        visible={isDone}
      />
    </div>
  );
}
