"use client";

import TraceControls from "../shared/TraceControls";

type Props = {
  stepIndex: number;
  totalSteps: number;
  mode: "beginner" | "expert";
  onModeChange: (mode: "beginner" | "expert") => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export default function Controls(props: Props) {
  return <TraceControls {...props} />;
}
