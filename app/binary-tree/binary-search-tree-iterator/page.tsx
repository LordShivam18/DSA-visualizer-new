"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "@/components/binary-tree/binary-search-tree-iterator/CodePanel";
import IteratorWorkbench from "@/components/binary-tree/binary-search-tree-iterator/IteratorWorkbench";
import TracePanel from "@/components/binary-tree/binary-search-tree-iterator/TracePanel";
import { generateTrace } from "@/components/binary-tree/binary-search-tree-iterator/generateTrace";

const defaultInputs = {
  root: "[7,3,15,null,null,9,20]",
  operations: "[\"BSTIterator\",\"next\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\"]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.root, values.operations));
}

export default function BinarySearchTreeIteratorPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-tree"
      categoryLabel="Binary Tree"
      taxonomy="Binary Tree / Trace-driven lesson"
      title="Binary Search Tree Iterator"
      difficulty="Medium"
      description="Trace the Binary Search Tree Iterator algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "root", label: "root", placeholder: "[7,3,15,null,null,9,20]", },
        { id: "operations", label: "operations", placeholder: "[\"BSTIterator\",\"next\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\",\"next\",\"hasNext\"]", multiline: true, rows: 4, }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <IteratorWorkbench step={step} />}
      renderMicroscope={() => null}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
