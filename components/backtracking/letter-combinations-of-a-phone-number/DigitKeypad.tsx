import type { PhoneEntry } from "./generateTrace";

const keypadLayout = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "abc" },
  { digit: "3", letters: "def" },
  { digit: "4", letters: "ghi" },
  { digit: "5", letters: "jkl" },
  { digit: "6", letters: "mno" },
  { digit: "7", letters: "pqrs" },
  { digit: "8", letters: "tuv" },
  { digit: "9", letters: "wxyz" },
  { digit: "*", letters: "" },
  { digit: "0", letters: "" },
  { digit: "#", letters: "" },
];

type Props = {
  entries: PhoneEntry[];
  activeDigit: string | null;
  activeLetter: string | null;
};

export default function DigitKeypad({
  entries,
  activeDigit,
  activeLetter,
}: Props) {
  const usedDigits = new Set(entries.map((entry) => entry.digit));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Phone Pad
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {keypadLayout.map((key) => {
          const isInputDigit = usedDigits.has(key.digit);
          const isActiveDigit = activeDigit === key.digit;
          const highlightsLetter =
            isActiveDigit && activeLetter !== null && key.letters.includes(activeLetter);

          return (
            <div
              key={key.digit}
              className={`rounded-[1.1rem] border px-3 py-4 text-center transition-all duration-300 ${
                isActiveDigit
                  ? "border-cyan-400/70 bg-cyan-500/12 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                  : isInputDigit
                  ? "border-violet-400/45 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]"
                  : "border-slate-800/80 bg-slate-950/70 text-slate-500"
              }`}
            >
              <div className="text-2xl font-semibold">{key.digit}</div>
              <div
                className={`mt-1 font-mono text-xs tracking-[0.32em] ${
                  highlightsLetter ? "text-yellow-200" : "text-current/70"
                }`}
              >
                {key.letters || "-"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
