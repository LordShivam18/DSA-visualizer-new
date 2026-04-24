"use client";

import SharedCodePanel from "@/components/dp/shared/CodePanel";
import type { DpTraceStep } from "@/components/dp/shared/types";

import { code, complexity } from "./generateTrace";

export default function CodePanel({ step }: { step: DpTraceStep }) {
  return <SharedCodePanel step={step} lines={code} complexity={complexity} />;
}
