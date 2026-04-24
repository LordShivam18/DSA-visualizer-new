"use client";

import SharedCodePanel from "@/components/dp/shared/CodePanel";

import { code, complexity } from "./generateTrace";
import type { DpTraceStep } from "@/components/dp/shared/types";

export default function CodePanel({ step }: { step: DpTraceStep }) {
  return <SharedCodePanel step={step} lines={code} complexity={complexity} />;
}
