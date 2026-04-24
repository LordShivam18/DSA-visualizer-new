import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { RansomNoteTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: RansomNoteTraceStep }) {
  return (
    <HashmapTracePanel
      step={step}
      description="Each snapshot shows the exact point where the letter bank grows or shrinks."
    />
  );
}
