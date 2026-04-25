"use client";

import type { ComponentType, InputHTMLAttributes, ReactNode } from "react";

import StandardTraceLessonPage, {
  type StandardLessonPreset,
} from "@/components/academy/StandardTraceLessonPage";
import type { LessonStepLike } from "@/components/academy/hooks/useLessonController";

type Meta = {
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  complexity?: string;
};

type ControlsProps = {
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

type ArrayStringInputField<TInputs extends Record<string, string>> = {
  id?: keyof TInputs & string;
  key?: keyof TInputs & string;
  label: string;
  placeholder?: string;
  helper?: string;
  help?: string;
  multiline?: boolean;
  rows?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
};

export default function ArrayStringLessonPage<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>({
  meta,
  defaultInputs,
  inputFields,
  presets,
  buildTrace,
  inputHint,
  Controls,
  Visualization,
  Microscope,
  TracePanel,
  CodePanel,
  renderOutput,
}: {
  meta: Meta;
  defaultInputs: TInputs;
  inputFields: ArrayStringInputField<TInputs>[];
  presets: StandardLessonPreset<TInputs>[];
  buildTrace: (inputs: TInputs) => Step[];
  inputHint?: string;
  Controls: ComponentType<ControlsProps>;
  Visualization: ComponentType<{ step: Step }>;
  Microscope: ComponentType<{ step: Step; mode: "beginner" | "expert" }>;
  TracePanel: ComponentType<{ step: Step }>;
  CodePanel: ComponentType<{ step: Step }>;
  renderOutput?: (context: { step: Step; trace: Step[] }) => ReactNode;
}) {
  return (
    <StandardTraceLessonPage<TInputs, Step>
      variant="light"
      categoryHref={meta.categoryHref}
      categoryLabel={meta.categoryLabel}
      taxonomy={meta.taxonomy}
      title={meta.title}
      difficulty={meta.difficulty}
      description={meta.description}
      complexity={meta.complexity}
      defaultInputs={defaultInputs}
      inputFields={inputFields.map((field) => ({
        id: field.id ?? field.key!,
        label: field.label,
        placeholder: field.placeholder,
        helper: field.helper ?? field.help,
        multiline: field.multiline,
        rows: field.rows,
        inputMode: field.inputMode,
      }))}
      presets={presets}
      buildTrace={buildTrace}
      inputHint={inputHint}
      Controls={Controls}
      Visualization={Visualization}
      Microscope={Microscope}
      TracePanel={TracePanel}
      CodePanel={CodePanel}
      renderOutput={
        renderOutput
          ? ({ step, trace }) => renderOutput({ step: step as Step, trace: trace as Step[] })
          : undefined
      }
    />
  );
}
