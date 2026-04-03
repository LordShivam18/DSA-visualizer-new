"use client";

import React, { useState, useEffect, useCallback } from "react";
import { generatePalindromeTrace } from "@/components/math/palindrome/generateTrace";
import NumberCanvas from "@/components/math/palindrome/NumberCanvas";
import TracePanel from "@/components/math/palindrome/TracePanel";
import CodePanel from "@/components/math/palindrome/CodePanel";
import Controls from "@/components/math/palindrome/Controls";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "num", label: "Enter a number", type: "number", placeholder: "e.g. 121", defaultValue: "121" },
];

const presets: PresetExample[] = [
  { name: "Example 1: 121", values: { num: "121" } },
  { name: "Example 2: -121", values: { num: "-121" } },
];

export default function PalindromeNumberPage() {
  const [num, setNum] = useState(121);
  const [trace, setTrace] = useState<any[]>([]);
  const [cursor, setCursor] = useState(0);

  const handleRun = useCallback((values: Record<string, string>) => {
    const n = parseInt(values.num) || 0;
    setNum(n);
    const steps = generatePalindromeTrace(n);
    setTrace(steps);
    setCursor(0);
    sounds.click();
  }, []);

  useEffect(() => {
    const steps = generatePalindromeTrace(121);
    setTrace(steps);
  }, []);

  const step = trace[cursor];
  const isDone = cursor === trace.length - 1 && trace.length > 0;
  const isPalindrome = isDone && step?.result === true;

  return (
    <div className="min-h-screen grid-pattern text-slate-100 flex flex-col items-center p-8 gap-6">
      <div className="w-full max-w-3xl"><BackButton href="/topics" label="Topics" /></div>

      <h1 className="text-4xl font-bold">
        <span className="text-emerald-400" style={{ textShadow: "0 0 18px rgba(52,211,153,0.8)" }}>Palindrome</span> Number
      </h1>

      <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#34d399" />

      {step && <NumberCanvas step={step} />}

      <Controls
        step={() => { setCursor((c) => Math.min(trace.length - 1, c + 1)); sounds.tick(); }}
        reset={() => { setCursor(0); sounds.reset(); }}
      />

      {step && <TracePanel step={step} />}
      <CodePanel highlight={step ? step.highlight : -1} />

      <OutputPanel
        result={isDone ? (isPalindrome ? `✅ ${num} is a palindrome number` : `❌ ${num} is NOT a palindrome`) : null}
        success={isDone ? isPalindrome : null}
        stepCount={cursor + 1}
        complexity="O(log n)"
        visible={isDone}
      />
    </div>
  );
}
