"use client";

import CodePanel from "../../../components/hashmap/happy-number/CodePanel";
import Controls from "../../../components/hashmap/happy-number/Controls";
import { generateTrace } from "../../../components/hashmap/happy-number/generateTrace";
import HappyNumberWorkbench from "../../../components/hashmap/happy-number/HappyNumberWorkbench";
import MicroscopeView from "../../../components/hashmap/happy-number/MicroscopeView";
import TracePanel from "../../../components/hashmap/happy-number/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  n: "19",
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    values: {
      n: "19",
    },
  },
  {
    name: "Cycle Case",
    output: "false",
    values: {
      n: "2",
    },
  },
  {
    name: "Already One",
    output: "true",
    values: {
      n: "1",
    },
  },
] as const;

export default function HappyNumberPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Happy Number",
        eyebrow: "Hashmap / Hash Set / Cycle Detection",
        description:
          "Transform the number into the sum of the squares of its digits and use a hash set to decide whether the sequence converges to 1 or loops forever.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "n",
          label: "n",
          placeholder: "19",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={HappyNumberWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
