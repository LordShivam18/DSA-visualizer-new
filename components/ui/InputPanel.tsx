"use client";

import { useState } from "react";

export interface InputField {
  key: string;
  label: string;
  type: "text" | "number" | "array" | "number-array";
  placeholder: string;
  defaultValue: string;
}

export interface PresetExample {
  name: string;
  values: Record<string, string>;
}

interface InputPanelProps {
  fields: InputField[];
  presets?: PresetExample[];
  onRun: (values: Record<string, string>) => void;
  accentColor?: string;
}

export default function InputPanel({
  fields,
  presets = [],
  onRun,
  accentColor = "#22d3ee",
}: InputPanelProps) {
  const initialValues: Record<string, string> = {};
  fields.forEach((field) => {
    initialValues[field.key] = field.defaultValue;
  });

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  function handleChange(key: string, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setActivePreset(null);
  }

  function handlePreset(index: number) {
    const preset = presets[index];
    setValues(preset.values);
    setActivePreset(index);
  }

  function handleRun() {
    onRun(values);
  }

  return (
    <div className="glass-card w-full max-w-3xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div
          className="h-5 w-1.5 rounded-full"
          style={{ background: accentColor }}
        />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
          Input
        </h3>
      </div>

      {presets.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {presets.map((preset, index) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(index)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activePreset === index
                  ? "text-slate-950"
                  : "border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
              }`}
              style={
                activePreset === index
                  ? {
                      background: accentColor,
                      boxShadow: `0 0 16px ${accentColor}44`,
                    }
                  : undefined
              }
            >
              {preset.name}
            </button>
          ))}

          <button
            onClick={() => {
              setActivePreset(null);
              const cleared: Record<string, string> = {};
              fields.forEach((field) => {
                cleared[field.key] = "";
              });
              setValues(cleared);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activePreset === null
                ? "text-slate-950"
                : "border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
            }`}
            style={
              activePreset === null
                ? {
                    background: accentColor,
                    boxShadow: `0 0 16px ${accentColor}44`,
                  }
                : undefined
            }
          >
            Custom
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-400">
              {field.label}
            </label>
            <input
              type="text"
              value={values[field.key]}
              onChange={(event) => handleChange(field.key, event.target.value)}
              placeholder={field.placeholder}
              className="input-field"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleRun}
        className="btn-neon btn-neon-cyan mt-4 w-full py-2.5"
      >
        Run Visualization
      </button>
    </div>
  );
}
