import React, { useState } from "react";

export default function ExplainButton({ traceStep }: { traceStep: unknown }) {
  const [loading, setLoading] = useState(false);
  const [explain, setExplain] = useState<string | null>(null);

  async function askExplain() {
    setLoading(true);
    setExplain(null);
    try {
      // Placeholder fetch — implement /api/explain serverless using OpenAI
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ step: traceStep }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplain(data.text ?? "No explanation returned");
      } else {
        setExplain("AI explain endpoint not implemented. Implement /api/explain for full functionality.");
      }
    } catch {
      setExplain("Network or server error calling /api/explain.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={askExplain}
        className="px-3 py-2 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-md text-sm font-medium"
      >
        {loading ? "Explaining..." : "Explain step (AI)"}
      </button>

      {explain && (
        <div className="bg-[#021022] border border-slate-700 rounded-md p-3 max-w-xs text-sm">
          <div className="font-semibold mb-1">AI explanation</div>
          <div className="text-slate-300">{explain}</div>
        </div>
      )}
    </div>
  );
}
