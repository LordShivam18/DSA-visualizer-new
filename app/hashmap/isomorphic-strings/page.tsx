"use client";

import CodePanel from "../../../components/hashmap/isomorphic-strings/CodePanel";
import Controls from "../../../components/hashmap/isomorphic-strings/Controls";
import { generateTrace } from "../../../components/hashmap/isomorphic-strings/generateTrace";
import IsomorphicStringsWorkbench from "../../../components/hashmap/isomorphic-strings/IsomorphicStringsWorkbench";
import MicroscopeView from "../../../components/hashmap/isomorphic-strings/MicroscopeView";
import TracePanel from "../../../components/hashmap/isomorphic-strings/TracePanel";
import HashmapProblemShell from "../../../components/hashmap/shared/HashmapProblemShell";

const initialInputs = {
  s: "egg",
  t: "add",
};

const presets = [
  {
    name: "Example 1",
    output: "true",
    values: {
      s: "egg",
      t: "add",
    },
  },
  {
    name: "Conflict",
    output: "false",
    values: {
      s: "foo",
      t: "bar",
    },
  },
  {
    name: "Length Mismatch",
    output: "false",
    values: {
      s: "ab",
      t: "aac",
    },
  },
] as const;

export default function IsomorphicStringsPage() {
  return (
    <HashmapProblemShell
      meta={{
        title: "Isomorphic Strings",
        eyebrow: "Hashmap / Bijective Mapping / Character Pairing",
        description:
          "Walk the strings together and enforce a one-to-one character mapping in both directions. The first mismatch or target collision ends the trace.",
        difficulty: "easy",
        accent: "cyan",
        backHref: "/hashmap",
        backLabel: "Hashmap",
      }}
      inputFields={[
        {
          id: "s",
          label: "String s",
          placeholder: "egg",
        },
        {
          id: "t",
          label: "String t",
          placeholder: "add",
        },
      ]}
      presets={[...presets]}
      initialInputs={initialInputs}
      buildTrace={generateTrace}
      Visualization={IsomorphicStringsWorkbench}
      Controls={Controls}
      Microscope={MicroscopeView}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
    />
  );
}
