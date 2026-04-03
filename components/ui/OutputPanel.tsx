"use client";

import { motion, AnimatePresence } from "framer-motion";

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
          className={`glass-card p-5 w-full max-w-3xl ${
            success === true
              ? "output-success"
              : success === false
              ? "output-fail"
              : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-1.5 h-5 rounded-full ${
                success === true
                  ? "bg-emerald-400"
                  : success === false
                  ? "bg-rose-400"
                  : "bg-slate-400"
              }`}
            />
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Output
            </h3>

            {success === true && (
              <span className="ml-auto text-emerald-400 text-sm font-bold">
                ✅ Success
              </span>
            )}
            {success === false && (
              <span className="ml-auto text-rose-400 text-sm font-bold">
                ❌ Failed
              </span>
            )}
          </div>

          {/* Result */}
          <div className="bg-slate-950/50 rounded-xl p-4 font-mono text-base">
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

          {/* Stats row */}
          {(stepCount !== undefined || complexity) && (
            <div className="flex gap-4 mt-3 text-xs text-slate-400">
              {stepCount !== undefined && (
                <span>
                  Steps:{" "}
                  <span className="text-slate-200 font-mono">{stepCount}</span>
                </span>
              )}
              {complexity && (
                <span>
                  Time:{" "}
                  <span className="text-slate-200 font-mono">{complexity}</span>
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
