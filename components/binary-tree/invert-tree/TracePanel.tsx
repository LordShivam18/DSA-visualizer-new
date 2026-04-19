import type { Trace } from "./generateTrace";

type Props = {
  trace: Trace[];
  cursor: number;
};

export default function TracePanel({ trace, cursor }: Props) {
  const step = trace[cursor];

  return (
    <div className="space-y-1">
      <h2 className="mb-3 text-xl font-bold">Explanation</h2>

      <div className="rounded-lg border border-gray-700 bg-[#0d1117] p-4 text-gray-300">
        {step ? (
          <div className="space-y-2">
            <p>{step.explanation}</p>
            <p className="text-sm text-gray-500">
              Depth {step.depth}
              {step.value !== undefined ? ` | Node ${step.value}` : ""}
            </p>
          </div>
        ) : (
          "---"
        )}
      </div>
    </div>
  );
}
