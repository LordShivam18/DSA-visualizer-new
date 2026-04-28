// components/math/palindrome/generateTrace.ts

export type TraceStep = {
  x: number;
  reversed: number;
  message: string;
  highlight: number; // which code line to highlight
};

export function generatePalindromeTrace(n: number): TraceStep[] {
  const steps: TraceStep[] = [];

  // invalid cases
  steps.push({
    x: n,
    reversed: 0,
    message: "Start — checking edge cases",
    highlight: 1
  });

  if (n < 0 || (n % 10 === 0 && n !== 0)) {
    steps.push({
      x: n,
      reversed: 0,
      message: "Negative or ends with 0 — definitely NOT palindrome",
      highlight: 2,
    });
    return steps;
  }

  let x = n;
  let reversedHalf = 0;

  steps.push({
    x,
    reversed: reversedHalf,
    message: "Start reversing the last half of digits",
    highlight: 5,
  });

  while (x > reversedHalf) {
    reversedHalf = reversedHalf * 10 + (x % 10);
    x = Math.floor(x / 10);

    steps.push({
      x,
      reversed: reversedHalf,
      message: `Extract digit ${reversedHalf % 10}, build reversed half = ${reversedHalf}`,
      highlight: 6,
    });
  }

  steps.push({
    x,
    reversed: reversedHalf,
    message: "Compare left-half and right-half",
    highlight: 11,
  });

  return steps;
}

export function generateTrace(rawInput: string | number): TraceStep[] {
  const value =
    typeof rawInput === "number" ? rawInput : Number(rawInput.trim());

  return generatePalindromeTrace(Number.isFinite(value) ? value : 121);
}
