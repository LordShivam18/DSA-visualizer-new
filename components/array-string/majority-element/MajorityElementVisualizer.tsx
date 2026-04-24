import { AccentBanner, ArrayRowsView, lightPanelClassName } from "../shared/ui";
import type { MajorityElementTraceStep } from "./generateTrace";

export default function MajorityElementVisualizer({
  step,
}: {
  step: MajorityElementTraceStep;
}) {
  return (
    <section className={`${lightPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Boyer-Moore Voting
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Matches add votes. Mismatches cancel votes.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          The majority element wins because it appears often enough to survive
          every cancellation against different values.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <ArrayRowsView
          rows={[
            {
              label: "nums",
              description:
                "Cyan marks the current index. Purple highlights the current candidate value.",
              cells: step.state.nums.map((value, index) => {
                const tags: string[] = [];
                if (step.pointers.index === index) {
                  tags.push("idx");
                }
                if (step.state.candidate === value) {
                  tags.push("cand");
                }

                let tone: "cyan" | "purple" | "red" | "slate" = "slate";
                if (step.state.candidate === value) {
                  tone = "purple";
                }
                if (step.pointers.index === index) {
                  tone =
                    step.state.candidate === value ? "green" : "cyan";
                }

                return { value, tone, tags };
              }),
            },
          ]}
        />

        <div className="space-y-4">
          <AccentBanner tone="purple" title="Current Candidate">
            {step.state.candidate ?? "none"}
          </AccentBanner>
          <AccentBanner tone="green" title="Vote Count">
            {step.state.count}
          </AccentBanner>
        </div>
      </div>
    </section>
  );
}
