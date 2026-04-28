export type SubsequenceLastAction =
  | { kind: "compare"; i: number; j: number; sChar: string; tChar: string }
  | { kind: "match"; i: number; j: number; char: string }
  | { kind: "skip"; i: number; j: number; sChar: string; tChar: string }
  | { kind: "done-true" }
  | { kind: "done-false" }
  | null;

export type IsSubsequenceState = {
  s: string;
  t: string;
  i: number;
  j: number;
  matched: boolean[];
  status: "ready" | "processing" | "done";
  lastAction: SubsequenceLastAction;
  activeLine: number;
};

export type IsSubsequenceTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "match" | "skip" | "done-true" | "done-false";
  state: IsSubsequenceState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export function generateTrace(rawS: string, rawT: string) {
  const s = rawS.trim() || "abc";
  const t = rawT.trim() || "ahbgdc";
  const matched = Array(s.length).fill(false) as boolean[];
  const steps: IsSubsequenceTraceStep[] = [];
  let i = 0;
  let j = 0;

  function push(
    actionKind: IsSubsequenceTraceStep["actionKind"],
    lastAction: SubsequenceLastAction,
    activeLine: number,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: {
        s,
        t,
        i,
        j,
        matched: [...matched],
        status: done ? "done" : steps.length === 0 ? "ready" : "processing",
        lastAction,
        activeLine,
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    null,
    1,
    "Initialize two pointers",
    "Pointer i tracks how much of s is matched; pointer j scans t.",
    "Invariant: s[0..i) is a subsequence of t[0..j)."
  );

  while (i < s.length && j < t.length) {
    const sChar = s[i];
    const tChar = t[j];
    if (sChar === tChar) {
      matched[i] = true;
      push(
        "match",
        { kind: "match", i, j, char: sChar },
        3,
        `Match '${sChar}'`,
        `s[${i}] and t[${j}] both equal '${sChar}', so advance both pointers.`,
        "A matching character extends the matched prefix."
      );
      i += 1;
      j += 1;
    } else {
      push(
        "skip",
        { kind: "skip", i, j, sChar, tChar },
        6,
        `Skip '${tChar}'`,
        `t[${j}] is '${tChar}', not '${sChar}', so keep i fixed and move j.`,
        "Discard this t position without changing the matched prefix."
      );
      j += 1;
    }
  }

  const success = i >= s.length;
  push(
    success ? "done-true" : "done-false",
    { kind: success ? "done-true" : "done-false" },
    9,
    success ? "Subsequence found" : "Subsequence not found",
    success
      ? "All characters in s were matched in order."
      : "t ended before every character in s could be matched.",
    success
      ? "i reached s.length."
      : "j reached t.length while i is still inside s.",
    true
  );

  return steps;
}
