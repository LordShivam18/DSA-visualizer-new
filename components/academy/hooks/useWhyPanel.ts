"use client";

import { useMemo } from "react";

import {
  resolveWhyExplanation,
  type WhyExplanation,
  type WhyRule,
  type WhyStepLike,
} from "@/lib/academy/whyEngine";

export function useWhyPanel<Step extends WhyStepLike>(
  step: Step | null | undefined,
  rules?: WhyRule<Step>[]
): WhyExplanation | null {
  return useMemo(() => resolveWhyExplanation(step, rules), [rules, step]);
}
