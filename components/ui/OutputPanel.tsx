"use client";

import { AnimatePresence, motion } from "framer-motion";

interface OutputPanelProps {
  result: string | null;
  success?: boolean | null;
  stepCount?: number;
  complexity?: string;
  visible: boolean;
}

export default function OutputPanel({
  result,
  success = null,
  stepCount,
  complexity,
  visible,
}: OutputPanelProps) {
  return (
    <AnimatePresence>
      {visible && result !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`glass-card w-full max-w-3xl p-5 ${
            success === true
              ? "output-success"
              : success === false
              ? "output-fail"
              : ""
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`h-5 w-1.5 rounded-full ${
                success === true
                  ? "bg-emerald-400"
                  : success === false
                  ? "bg-rose-400"
                  : "bg-slate-400"
              }`}
            />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              Output
            </h3>

            {success === true && (
              <span className="ml-auto text-sm font-bold text-emerald-400">
                Success
              </span>
            )}
            {success === false && (
              <span className="ml-auto text-sm font-bold text-rose-400">
                Failed
              </span>
            )}
          </div>

          <div className="rounded-xl bg-slate-950/50 p-4 font-mono text-base">
            <span
              className={
                success === true
                  ? "text-emerald-300"
                  : success === false
                  ? "text-rose-300"
                  : "text-cyan-300"
              }
            >
              {result}
            </span>
          </div>

          {(stepCount !== undefined || complexity) && (
            <div className="mt-3 flex gap-4 text-xs text-slate-400">
              {stepCount !== undefined && (
                <span>
                  Steps:{" "}
                  <span className="font-mono text-slate-200">{stepCount}</span>
                </span>
              )}
              {complexity && (
                <span>
                  Time:{" "}
                  <span className="font-mono text-slate-200">{complexity}</span>
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
