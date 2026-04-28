"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";
import { toLessonTrace } from "@/components/academy/traceAdapters";

import CodePanel from "../../../components/graph-traversal/course-schedule-ii/CodePanel";
import MicroscopeView from "../../../components/graph-traversal/course-schedule-ii/MicroscopeView";
import CourseScheduleIIWorkbench from "../../../components/graph-traversal/course-schedule-ii/CourseScheduleIIWorkbench";
import TracePanel from "../../../components/graph-traversal/course-schedule-ii/TracePanel";
import { generateTrace } from "../../../components/graph-traversal/course-schedule-ii/generateTrace";

const defaultInputs = {
  numCourses: "4",
  prerequisites: "[[1,0],[2,0],[3,1],[3,2]]"
};

const presets = [
  { name: "Default", summary: "Trace baseline", values: defaultInputs },
];

function generateLessonTrace(values: typeof defaultInputs) {
  return toLessonTrace(generateTrace(values));
}

export default function CourseScheduleIiPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/graph-traversal"
      categoryLabel="Graph Traversal"
      taxonomy="Graph Traversal / Trace-driven lesson"
      title="Course Schedule II"
      difficulty="Medium"
      description="Trace the Course Schedule II algorithm from parsed input through each decision point."
      complexity="Trace generated from pure algorithm state"
      defaultInputs={defaultInputs}
      inputFields={[
        { id: "numCourses", label: "numCourses", placeholder: "4", },
        { id: "prerequisites", label: "prerequisites", placeholder: "[[1,0],[2,0],[3,1],[3,2]]", }
      ]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => <CourseScheduleIIWorkbench step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
