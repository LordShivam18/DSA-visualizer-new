"use client";

type FloatingLessonToastTone = "success" | "progress";

const toneClassName: Record<FloatingLessonToastTone, string> = {
  success:
    "border-emerald-200 bg-white/95 text-emerald-900 shadow-[0_22px_55px_rgba(16,185,129,0.15)]",
  progress:
    "border-cyan-200 bg-white/95 text-cyan-900 shadow-[0_22px_55px_rgba(34,211,238,0.15)]",
};

const accentClassName: Record<FloatingLessonToastTone, string> = {
  success: "bg-emerald-400",
  progress: "bg-cyan-400",
};

export default function FloatingLessonToast({
  message,
  tone,
  durationMs = 2200,
}: {
  message: string;
  tone: FloatingLessonToastTone;
  durationMs?: number;
}) {
  return (
    <div
      aria-live="polite"
      className={`lesson-toast-shell flex items-start gap-3 rounded-[1.2rem] border px-4 py-3 backdrop-blur-xl ${toneClassName[tone]}`}
      style={{ ["--lesson-toast-duration" as string]: `${durationMs}ms` }}
    >
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${accentClassName[tone]}`}
      />
      <p className="text-sm font-medium leading-6">{message}</p>
    </div>
  );
}
