import { clamp, parseInteger } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type Placement = {
  char: string;
  row: number;
  col: number;
  index: number;
};

type ZigzagConversionState = {
  source: string;
  numRows: number;
  index: number | null;
  currentRow: number | null;
  currentCol: number | null;
  direction: "down" | "up";
  placements: Placement[];
  rows: string[];
  readingRow: number | null;
  result: string;
  finalResult: string | null;
};

type ZigzagConversionPointers = {
  index: number | null;
  row: number | null;
  readingRow: number | null;
};

export type ZigzagConversionTraceStep = TeachingTraceFrame & {
  state: ZigzagConversionState;
  pointers: ZigzagConversionPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawSource: string, rawRows: string) {
  const source = rawSource;
  const numRows = Math.max(clamp(parseInteger(rawRows, 3), 1, 12), 1);
  const trace: ZigzagConversionTraceStep[] = [];

  const rows = Array.from({ length: numRows }, () => "");
  const placements: Placement[] = [];
  let index: number | null = source.length > 0 ? 0 : null;
  let currentRow: number | null = source.length > 0 ? 0 : null;
  let currentCol: number | null = source.length > 0 ? 0 : null;
  let direction: ZigzagConversionState["direction"] = "down";
  let readingRow: number | null = null;
  let result = "";
  let finalResult: string | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: ZigzagConversionTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    hints: string[],
    done = false
  ) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints,
      metrics: [
        { label: "Rows", value: numRows, tone: "purple" },
        { label: "Placed", value: placements.length, tone: "cyan" },
        { label: "Read Length", value: result.length, tone: "green" },
      ],
      pointerChips: [
        { label: "char", value: pointerValue(index), tone: "cyan" },
        { label: "row", value: pointerValue(currentRow), tone: "yellow" },
        { label: "read", value: pointerValue(readingRow), tone: "green" },
      ],
      done,
      state: {
        source,
        numRows,
        index,
        currentRow,
        currentCol,
        direction,
        placements: placements.map((placement) => ({ ...placement })),
        rows: [...rows],
        readingRow,
        result,
        finalResult,
      },
      pointers: {
        index,
        row: currentRow,
        readingRow,
      },
    });
  }

  pushStep(
    source.length === 0
      ? "The input string is empty, so the zigzag output is also empty."
      : `Route characters across ${numRows} row${numRows === 1 ? "" : "s"} by moving down and then diagonally up.`,
    "initialize",
    "slate",
    [1, 2, 3, 4, 5],
    source.length === 0
      ? "There are no characters to place."
      : "Each new character drops into the current row, then the row cursor moves up or down for the next placement.",
    source.length === 0
      ? "An empty source produces an empty zigzag immediately."
      : "The row cursor oscillates between the top and bottom rows; concatenating the row buffers afterward yields the transformed string.",
    source.length === 0
      ? "Nothing remains to route."
      : "The zigzag is built one placement at a time before any reading happens.",
    source.length === 0
      ? [
          "The answer is the empty string.",
          "No placements are needed.",
          "No row reads are needed.",
        ]
      : [
          "Top and bottom rows trigger direction flips.",
          "Vertical moves stay in the same column.",
          "Diagonal up moves also advance the visual column.",
        ]
  );

  if (numRows === 1 || numRows >= source.length) {
    for (let charIndex = 0; charIndex < source.length; charIndex += 1) {
      placements.push({
        char: source[charIndex],
        row: 0,
        col: charIndex,
        index: charIndex,
      });
      rows[0] += source[charIndex];
    }
    result = source;
    finalResult = source;
    index = null;
    currentRow = null;
    currentCol = null;
    readingRow = null;

    pushStep(
      numRows === 1
        ? "With one row, the zigzag never bends, so the answer stays identical to the input."
        : "When the row count is at least the string length, every character already occupies its own straight-down position, so the readout matches the input.",
      "done",
      "green",
      [2],
      "No bouncing is needed in this edge case, so the output is the original string.",
      "The guard clause short-circuits because the row-routing transform is the identity when the zigzag cannot oscillate meaningfully.",
      "The trivial edge case is resolved before the main simulation loop.",
      [
        "This avoids unnecessary work.",
        "The visual board still shows the placed characters.",
        "The final readout is unchanged.",
      ],
      true
    );

    return trace;
  }

  let row = 0;
  let col = 0;

  for (let charIndex = 0; charIndex < source.length; charIndex += 1) {
    index = charIndex;
    currentRow = row;
    currentCol = col;
    rows[row] += source[charIndex];
    placements.push({
      char: source[charIndex],
      row,
      col,
      index: charIndex,
    });

    pushStep(
      `Place '${source[charIndex]}' into row ${row}${direction === "down" ? " while moving downward." : " while moving diagonally upward."}`,
      "place",
      "cyan",
      [6, 7],
      "This character lands in the current row before the row cursor moves again.",
      "Each placement appends the character to its row buffer, which is all the algorithm ultimately needs for the final readout.",
      "The active row receives exactly one character in this step.",
      [
        "Placed characters stay in their assigned row forever.",
        "The board position is only a teaching aid; the algorithm itself stores row strings.",
        "The next movement depends on whether we hit the top or bottom row.",
      ]
    );

    if (row === 0 && direction === "up") {
      direction = "down";
      pushStep(
        "The cursor touched the top row, so the direction flips downward.",
        "turn",
        "purple",
        [8, 10],
        "At the top, the zigzag starts dropping again.",
        "The top boundary is a reflection point in the oscillating row pointer.",
        "Direction changes only at the row boundaries.",
        [
          "The next move goes to row 1.",
          "The visual column stays fixed on downward motion.",
          "Only edge rows can trigger a flip.",
        ]
      );
    } else if (row === numRows - 1 && direction === "down") {
      direction = "up";
      pushStep(
        "The cursor hit the bottom row, so the direction flips upward.",
        "turn",
        "purple",
        [9, 10],
        "At the bottom, the zigzag starts climbing diagonally upward.",
        "The bottom boundary is the other reflection point for the row pointer.",
        "The next movement leaves the bottom row and heads upward.",
        [
          "Diagonal movement increments the visual column.",
          "The row pointer now climbs one row at a time.",
          "Only the extremes change direction.",
        ]
      );
    }

    if (charIndex < source.length - 1) {
      if (direction === "down") {
        row += 1;
      } else {
        row -= 1;
        col += 1;
      }
    }
  }

  index = null;
  currentRow = null;
  currentCol = null;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    readingRow = rowIndex;
    result += rows[rowIndex];

    pushStep(
      `Read row ${rowIndex} and append "${rows[rowIndex]}" to the answer. The result is now "${result}".`,
      "read",
      "green",
      [12, 13],
      "After all placements are done, we read each row from top to bottom.",
      "Concatenating the row buffers in order reconstructs the zigzag-converted string.",
      "Reading happens strictly row by row after placement finishes.",
      [
        "The placement phase never changes again during reading.",
        "Each row contributes a contiguous chunk to the final string.",
        "The answer grows monotonically as rows are read.",
      ]
    );
  }

  readingRow = null;
  finalResult = result;

  pushStep(
    `The zigzag conversion is complete. The final string is "${result}".`,
    "done",
    "green",
    [14],
    "All rows have been read, so the built string is the final answer.",
    "The output equals the concatenation of every row buffer after the bounce simulation ends.",
    "Both phases are complete: routing and row readout.",
    [
      "Time complexity is O(n).",
      "Extra space is O(n) for the row buffers and teaching grid.",
      "The visual board is derived from the same row-routing decisions.",
    ],
    true
  );

  return trace;
}
