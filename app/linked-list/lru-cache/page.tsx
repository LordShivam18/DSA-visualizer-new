"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CacheTrack from "@/components/linked-list/lru-cache/CacheTrack";
import CodePanel from "@/components/linked-list/lru-cache/CodePanel";
import HashMapViz from "@/components/linked-list/lru-cache/HashMapViz";
import MicroscopeView from "@/components/linked-list/lru-cache/MicroscopeView";
import TracePanel from "@/components/linked-list/lru-cache/TracePanel";
import { generateTrace, type LRUOperation } from "@/components/linked-list/lru-cache/generateTrace";

const defaultInputs = { capacity: "2", operations: "put 1 1\nput 2 2\nget 1\nput 3 3\nget 2" };
const presets = [{ name: "Default", summary: "LRU flow", values: defaultInputs }];

function parseOperations(raw: string): LRUOperation[] {
  return raw.split(/\r?\n|;/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [type, key, value] = line.split(/[\s,()]+/).filter(Boolean);
    return type === "get"
      ? { type: "get", key: Number(key) || 0 }
      : { type: "put", key: Number(key) || 0, value: Number(value) || 0 };
  });
}

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(Number(values.capacity) || 2, parseOperations(values.operations)));
}

export default function LruCachePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/linked-list"
      categoryLabel="Linked List"
      taxonomy="Linked List / Hash Map + Doubly Linked List"
      title="LRU Cache"
      difficulty="Medium"
      description="Trace O(1) cache access by coordinating a hashmap with recency ordering."
      complexity="O(1) get / O(1) put"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "capacity", label: "capacity", placeholder: "2" },
        { id: "operations", label: "operations", placeholder: "put 1 1", multiline: true, rows: 5 },
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-4">
          <CacheTrack step={step} />
          <HashMapViz keys={step.mapKeys} activeKey={step.activeKey} />
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => <MicroscopeView step={step} mode={teachingMode} />}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
