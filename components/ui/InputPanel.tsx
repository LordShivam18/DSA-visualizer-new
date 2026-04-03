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
  fields.forEach((f) => {
    initialValues[f.key] = f.defaultValue;
  });

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  function handleChange(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setActivePreset(null);
  }

  function handlePreset(idx: number) {
    const preset = presets[idx];
    setValues(preset.values);
    setActivePreset(idx);
  }

  function handleRun() {
    onRun(values);
  }

  return (
    <div className="glass-card p-5 w-full max-w-3xl">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1.5 h-5 rounded-full"
          style={{ background: accentColor }}
        />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          Input
        </h3>
      </div>

      {/* Preset examples */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePreset(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePreset === idx
                  ? "text-slate-950"
                  : "bg-slate-900/80 border border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
              style={
                activePreset === idx
                  ? { background: accentColor, boxShadow: `0 0 16px ${accentColor}44` }
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
              fields.forEach((f) => (cleared[f.key] = ""));
              setValues(cleared);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === null
                ? "text-slate-950"
                : "bg-slate-900/80 border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
            style={
              activePreset === null
                ? { background: accentColor, boxShadow: `0 0 16px ${accentColor}44` }
                : undefined
            }
          >
            Custom
          </button>
        </div>
      )}

      {/* Input fields */}
      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">
              {field.label}
            </label>
            <input
              type="text"
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="input-field"
            />
          </div>
        ))}
      </div>

      {/* Run button */}
      <button
        onClick={handleRun}
        className="btn-neon btn-neon-cyan w-full mt-4 py-2.5"
      >
        ▶ Run Visualization
      </button>
    </div>
  );
}
