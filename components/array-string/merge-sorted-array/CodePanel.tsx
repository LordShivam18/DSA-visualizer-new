import LightCodePanel from "../shared/LightCodePanel";
import type { MergeSortedArrayTraceStep } from "./generateTrace";

const code = [
  "void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {",
  "    int i = m - 1, j = n - 1, write = m + n - 1;",
  "    while (j >= 0) {",
  "        if (i >= 0 && nums1[i] > nums2[j]) {",
  "            nums1[write] = nums1[i];",
  "            --i;",
  "        } else {",
  "            nums1[write] = nums2[j];",
  "            --j;",
  "        }",
  "        --write;",
  "    }",
  "}",
];

export default function CodePanel({
  step,
}: {
  step: MergeSortedArrayTraceStep;
}) {
  return (
    <LightCodePanel
      step={step}
      lines={code}
      complexity={["Time: O(m + n)", "Space: O(1)"]}
      caption="The highlighted C++ lines mirror the exact compare-and-write step in the trace."
    />
  );
}
