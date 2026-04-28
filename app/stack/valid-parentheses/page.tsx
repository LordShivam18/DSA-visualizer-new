"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import BracketNode from "../../../components/stack/BracketNode";
import StackBox from "../../../components/stack/StackBox";
import { generateTrace } from "../../../components/stack/valid-parentheses/generateTrace";

const defaultInputs = { expression: "({[]})" };
const presets = [{ name: "Default", summary: "valid", values: defaultInputs }];

function generateLessonTrace(values: typeof defaultInputs) {
  return generateTrace(values.expression);
}

export default function ValidParenthesesPage() {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref="/stack"
      categoryLabel="Stack"
      taxonomy="Stack / Delimiter Matching"
      title="Valid Parentheses"
      difficulty="Easy"
      description="Trace stack pushes and pops while validating balanced brackets."
      complexity="O(n) time / O(n) space"
      defaultInputs={defaultInputs}
      inputFields={[{ id: "expression", label: "expression", placeholder: "({[]})" }]}
      presets={presets}
      generateTrace={generateLessonTrace}
      renderVisualization={({ step }) => (
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {step.state.expression.split("").map((symbol, index) => {
              let state: "default" | "active" | "processed" | "error" = "default";
              if (index < step.state.idx) state = "processed";
              if (index === step.state.idx && step.state.status === "processing") state = "active";
              if ((step.state.lastAction?.kind === "mismatch" || step.state.lastAction?.kind === "emptyPop") && step.state.lastAction.index === index) state = "error";
              return <BracketNode key={index} symbol={symbol} variant="stream" state={state} />;
            })}
          </div>
          <StackBox stack={step.state.stack} lastAction={step.state.lastAction} />
        </div>
      )}
      renderMicroscope={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">stack size = {step.state.stack.length}</div>}
      renderTracePanel={({ step }) => <div className="glass-card p-4 text-sm text-slate-300">{step.action}</div>}
      renderCodePanel={({ step }) => <pre className="glass-card p-4 text-xs text-slate-300">active line: {step.state.activeLine}{"\n"}push openers; match closers against stack top</pre>}
    />
  );
}
