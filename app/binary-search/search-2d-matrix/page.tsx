"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/binary-search/search-2d-matrix/CodePanel";
import MicroscopeView from "../../../components/binary-search/search-2d-matrix/MicroscopeView";
import MatrixSearchVisualizer from "../../../components/binary-search/search-2d-matrix/MatrixSearchVisualizer";
import TracePanel from "../../../components/binary-search/search-2d-matrix/TracePanel";
import { generateTrace } from "../../../components/binary-search/search-2d-matrix/generateTrace";

const defaultInputs = {
  matrix: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]",
  target: "3"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values.matrix, values.target));
}

export default function Search2dMatrixPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Trace-driven lesson"
      title="Search a 2D Matrix"
      difficulty="Medium"
      description="Trace the Search a 2D Matrix algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "matrix", label: "matrix", placeholder: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]", multiline: true, rows: 4, },
        { id: "target", label: "target", placeholder: "3", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <MatrixSearchVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
