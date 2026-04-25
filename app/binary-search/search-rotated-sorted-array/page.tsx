"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "../../../components/binary-search/search-rotated-sorted-array/CodePanel";
import Controls from "../../../components/binary-search/search-rotated-sorted-array/Controls";
import MicroscopeView from "../../../components/binary-search/search-rotated-sorted-array/MicroscopeView";
import RotatedArrayVisualizer from "../../../components/binary-search/search-rotated-sorted-array/RotatedArrayVisualizer";
import TracePanel from "../../../components/binary-search/search-rotated-sorted-array/TracePanel";
import {
  generateTrace,
  type RotatedSearchTraceStep,
} from "../../../components/binary-search/search-rotated-sorted-array/generateTrace";

const defaultInput = "4 5 6 7 0 1 2";
const defaultTarget = "0";

const presets = [
  { name: "Example 1", nums: "4 5 6 7 0 1 2", target: "0" },
  { name: "Example 2", nums: "4 5 6 7 0 1 2", target: "3" },
  { name: "Short Pivot", nums: "6 7 1 2 3 4 5", target: "2" },
] as const;

export default function SearchRotatedSortedArrayPage() {
  function buildTrace(values: {
    nums: string;
    target: string;
  }): RotatedSearchTraceStep[] {
    return generateTrace(values.nums, values.target);
  }

  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/binary-search"
      categoryLabel="Binary Search"
      taxonomy="Binary Search / Rotation / Sorted Half Test"
      title="Search in Rotated Sorted Array"
      difficulty="Medium"
      description="This visualizer shows why rotation does not break binary search: one half of the current window is always still sorted, and that is enough information to throw half the window away."
      complexity="O(log n) time / O(1) extra space"
      defaultInputs={{ nums: defaultInput, target: defaultTarget }}
      inputFields={[
        {
          id: "nums",
          label: "Array values",
          multiline: true,
          rows: 6,
          placeholder: "Use values like 4 5 6 7 0 1 2",
          helper: "Accepted formats: spaces, commas, newlines, or JSON arrays.",
        },
        {
          id: "target",
          label: "Target",
          placeholder: "0",
          helper:
            "Distinct values make the sorted-half test especially clear in this problem.",
        },
      ]}
      presets={presets.map((preset) => ({
        name: preset.name,
        summary: `${preset.nums} | target ${preset.target}`,
        values: {
          nums: preset.nums,
          target: preset.target,
        },
      }))}
      buildTrace={buildTrace}
      inputHint="Every preset rebuilds the same rotated-search trace, so prediction mode always queries the actual next binary-search transition."
      renderControls={({ teachingMode, setTeachingMode, timeline, trace }) => (
        <Controls
          stepIndex={timeline.activeIndex}
          totalSteps={trace.length}
          mode={teachingMode as "beginner" | "expert"}
          onModeChange={(nextMode) => setTeachingMode(nextMode)}
          onPrev={() => timeline.prev()}
          onNext={() => timeline.next()}
          onReset={() => timeline.reset()}
          canPrev={timeline.canPrev}
          canNext={timeline.canNext}
        />
      )}
      renderVisualization={({ step }) => <RotatedArrayVisualizer step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView step={step} mode={teachingMode as "beginner" | "expert"} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
