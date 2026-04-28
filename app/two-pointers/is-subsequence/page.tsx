"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CharNode, { type CharState } from "@/components/two-pointers/is-subsequence/CharacterBox";
import MicroscopeView from "@/components/two-pointers/is-subsequence/MicroscopeView";
import PointerNode from "@/components/two-pointers/is-subsequence/PointerNode";
import { generateTrace } from "@/components/two-pointers/is-subsequence/generateTrace";

const defaultInputs = { s: "abc", t: "ahbgdc" };
const presets = [{ name: "Default", summary: "true", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.s, values.t);
}

export default function IsSubsequencePage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/two-pointers"
      categoryLabel="Two Pointers"
      taxonomy="Two Pointers / Subsequence Matching"
      title="Is Subsequence"
      difficulty="Easy"
      description="Trace pointer i through s while pointer j scans t."
      complexity="O(|t|) time / O(1) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "s", label: "s", placeholder: "abc" }, { id: "t", label: "t", placeholder: "ahbgdc" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="space-y-8">
          {[["s", step.state.s], ["t", step.state.t]].map(([label, text]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
              <div className="flex gap-2">
                {String(text).split("").map((ch, index) => {
                  let state: CharState = "idle";
                  if (label === "s" && step.state.matched[index]) state = "matched";
                  if (label === "s" && index === step.state.i && step.state.status !== "done") state = "active";
                  if (label === "t" && index === step.state.j && step.state.status !== "done") state = "active";
                  if (label === "t" && step.state.lastAction?.kind === "skip" && step.state.lastAction.j === index) state = "skipped";
                  return <CharNode key={index} ch={ch} state={state} />;
                })}
              </div>
              <div className="flex gap-2">
                {String(text).split("").map((_, index) => (
                  <div key={index} className="flex w-10 justify-center">
                    <PointerNode label={label === "s" ? "i" : "j"} active={index === (label === "s" ? step.state.i : step.state.j) && step.state.status !== "done"} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <MicroscopeView matchedPrefix={step.state.s.slice(0, step.state.matched.filter(Boolean).length)} remaining={step.state.s.slice(step.state.matched.filter(Boolean).length)} mode={teachingMode} />
      )}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}if s[i] == t[j], advance both; else advance j</pre>}
    />
  );
}
