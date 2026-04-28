"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/course-schedule/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/course-schedule/MicroscopeView";
import CourseScheduleWorkbench from "../../../components/graph-traversal/course-schedule/CourseScheduleWorkbench";
import TracePanel from "../../../components/graph-traversal/course-schedule/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/course-schedule/generateTrace";

const defaultInputs = {
  numCourses: "2",
  prerequisites: "[[1,0]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values));
}

export default function CourseSchedulePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Course Schedule"
      difficulty="Medium"
      description="Trace the Course Schedule algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "numCourses", label: "numCourses", placeholder: "2", },
        { id: "prerequisites", label: "prerequisites", placeholder: "[[1,0]]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CourseScheduleWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
