export type PortalType = "snake" | "ladder";

export type BoardCellRecord = {
  label: number;
  row: number;
  col: number;
  portalTo: number | null;
  portalType: PortalType | null;
};

export type QueueEntry = {
  square: number;
  rolls: number;
};

export type MoveRecord = {
  from: number;
  roll: number;
  raw: number;
  destination: number;
  usedPortal: boolean;
};

export type PortalFocus = {
  from: number;
  to: number;
  type: PortalType;
};

export type SnakesAndLaddersState = {
  rawInput: string;
  board: number[][];
  size: number;
  target: number;
  cells: BoardCellRecord[];
  queue: QueueEntry[];
  visited: number[];
  processed: number[];
  distances: number[];
  moveHistory: MoveRecord[];
  bestPath: number[];
  result: number | null;
};

export type SnakesAndLaddersPointers = {
  currentSquare: number | null;
  candidateSquare: number | null;
  destinationSquare: number | null;
  dieRoll: number | null;
  queueFront: number | null;
  portalFocus: PortalFocus | null;
};

export type SnakesAndLaddersActionKind =
  | "parsed"
  | "seed"
  | "dequeue"
  | "roll"
  | "portal"
  | "enqueue"
  | "skip"
  | "done";

export type SnakesAndLaddersTraceStep = {
  step: number;
  action: string;
  actionKind: SnakesAndLaddersActionKind;
  codeLines: number[];
  state: SnakesAndLaddersState;
  pointers: SnakesAndLaddersPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function normalizeBoard(rows: number[][]) {
  if (rows.length === 0) {
    return [] as number[][];
  }

  const width = Math.min(rows.length, ...rows.map((row) => row.length));
  if (width <= 0) {
    return [] as number[][];
  }

  return rows.slice(0, width).map((row) =>
    row.slice(0, width).map((value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? Math.trunc(numeric) : -1;
    })
  );
}

export function parseBoardInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [] as number[][];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      const rows = parsed
        .filter((row): row is unknown[] => Array.isArray(row))
        .map((row) => row.map((value) => Number(value)));

      return normalizeBoard(rows);
    }
  } catch {
    // Fall back to loose text parsing below.
  }

  const rows = trimmed
    .split(/\r?\n|\|/)
    .map((row) =>
      (row.match(/-?\d+/g) ?? []).map((token) => Number(token))
    )
    .filter((row) => row.length > 0);

  return normalizeBoard(rows);
}

export function labelToPosition(label: number, size: number) {
  const quotient = Math.floor((label - 1) / size);
  const remainder = (label - 1) % size;
  const row = size - 1 - quotient;
  const col = quotient % 2 === 0 ? remainder : size - 1 - remainder;

  return { row, col };
}

function positionToLabel(row: number, col: number, size: number) {
  const quotient = size - 1 - row;
  const base = quotient * size;
  const offset = quotient % 2 === 0 ? col : size - 1 - col;
  return base + offset + 1;
}

function buildCells(board: number[][]) {
  const size = board.length;
  const cells: BoardCellRecord[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const label = positionToLabel(row, col, size);
      const portalTo = board[row]?.[col] ?? -1;
      let portalType: PortalType | null = null;

      if (portalTo !== -1) {
        portalType = portalTo > label ? "ladder" : "snake";
      }

      cells.push({
        label,
        row,
        col,
        portalTo: portalTo === -1 ? null : portalTo,
        portalType,
      });
    }
  }

  return cells.sort((left, right) => left.label - right.label);
}

function buildPath(parent: Map<number, number | null>, target: number) {
  if (!parent.has(target)) {
    return [] as number[];
  }

  const path: number[] = [];
  let current: number | null | undefined = target;

  while (current !== null && current !== undefined) {
    path.push(current);
    current = parent.get(current);
  }

  return path.reverse();
}

export function formatResult(value: number | null) {
  if (value === null) {
    return "building";
  }

  return String(value);
}

export function formatPath(path: number[]) {
  if (path.length === 0) {
    return "unresolved";
  }

  return path.join(" -> ");
}

export function generateTrace(rawInput: string) {
  const board = parseBoardInput(rawInput);
  const size = board.length;
  const target = size * size;
  const cells = buildCells(board);
  const cellByLabel = new Map(cells.map((cell) => [cell.label, cell]));
  const queue: QueueEntry[] = [];
  const distances = Array.from({ length: target + 1 }, () => -1);
  const visited = new Set<number>();
  const processed: number[] = [];
  const moveHistory: MoveRecord[] = [];
  const trace: SnakesAndLaddersTraceStep[] = [];
  const parent = new Map<number, number | null>();

  let currentSquare: number | null = null;
  let candidateSquare: number | null = null;
  let destinationSquare: number | null = null;
  let dieRoll: number | null = null;
  let portalFocus: PortalFocus | null = null;
  let result: number | null = null;
  let bestPath: number[] = [];

  function visitedList() {
    return [...visited].sort((left, right) => left - right);
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: SnakesAndLaddersActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        rawInput,
        board: board.map((row) => [...row]),
        size,
        target,
        cells: cells.map((cell) => ({ ...cell })),
        queue: queue.map((entry) => ({ ...entry })),
        visited: visitedList(),
        processed: [...processed],
        distances: [...distances],
        moveHistory: moveHistory.map((move) => ({ ...move })),
        bestPath: [...bestPath],
        result,
      },
      pointers: {
        currentSquare,
        candidateSquare,
        destinationSquare,
        dieRoll,
        queueFront: queue.length > 0 ? queue[0].square : null,
        portalFocus: portalFocus ? { ...portalFocus } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      size === 0
        ? "Parse the board input. No valid square board was found."
        : `Parse the ${size} x ${size} board and convert the boustrophedon numbering into graph nodes from 1 to ${target}.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    done: false,
    explanationBeginner:
      size === 0
        ? "Without a valid board, there is nowhere for BFS to start."
        : "Each numbered square becomes a graph node. A dice roll creates up to six possible edges from the current square.",
    explanationExpert:
      size === 0
        ? "Invalid input collapses the search space to the empty graph."
        : "The board is an implicit unweighted graph whose outgoing edges are determined by dice outcomes and one optional portal jump.",
  });

  if (size === 0) {
    result = -1;

    pushStep({
      action: "The board is empty, so reaching the last square is impossible.",
      actionKind: "done",
      codeLines: [18],
      done: true,
      explanationBeginner:
        "There is no game board to play on, so the answer is -1.",
      explanationExpert:
        "The shortest-path query on an empty state space is unsatisfiable.",
    });

    return trace;
  }

  queue.push({ square: 1, rolls: 0 });
  distances[1] = 0;
  visited.add(1);
  parent.set(1, null);
  currentSquare = 1;

  pushStep({
    action: "Seed BFS with square 1 at distance 0 because the game always starts there.",
    actionKind: "seed",
    codeLines: [4, 5],
    done: false,
    explanationBeginner:
      "BFS starts at square 1 before any dice rolls happen.",
    explanationExpert:
      "dist[1] = 0 initializes the source vertex for an unweighted shortest-path search.",
  });

  if (target === 1) {
    result = 0;
    bestPath = [1];

    pushStep({
      action: "The board has only one square, so you are already at the destination.",
      actionKind: "done",
      codeLines: [18],
      done: true,
      explanationBeginner:
        "No roll is needed because the start square is also the finish square.",
      explanationExpert:
        "The single-vertex graph returns distance 0 immediately.",
    });

    return trace;
  }

  while (queue.length > 0) {
    const entry = queue.shift();
    if (!entry) {
      break;
    }

    currentSquare = entry.square;
    candidateSquare = null;
    destinationSquare = null;
    dieRoll = null;
    portalFocus = null;

    processed.push(entry.square);

    pushStep({
      action: `Dequeue square ${entry.square}. BFS now explores every dice roll from this square at distance ${entry.rolls}.`,
      actionKind: "dequeue",
      codeLines: [6, 7],
      done: false,
      explanationBeginner:
        "Because BFS visits squares in increasing number of rolls, this is the next square we should explore.",
      explanationExpert:
        "Dequeuing preserves the level-order invariant: every outgoing move from this node has cost dist[square] + 1.",
    });

    for (
      let roll = 1;
      roll <= 6 && entry.square + roll <= target;
      roll += 1
    ) {
      const raw = entry.square + roll;
      const rawCell = cellByLabel.get(raw);
      const portalTo = rawCell?.portalTo ?? null;

      currentSquare = entry.square;
      candidateSquare = raw;
      destinationSquare = raw;
      dieRoll = roll;
      portalFocus = null;

      pushStep({
        action: `Roll ${roll} from square ${entry.square} and tentatively land on square ${raw}.`,
        actionKind: "roll",
        codeLines: [8, 9, 10],
        done: false,
        explanationBeginner:
          "A die roll chooses one of the next six squares, if that square exists.",
        explanationExpert:
          "This loop enumerates the implicit outgoing edges of the current BFS vertex.",
      });

      let destination = raw;

      if (portalTo !== null) {
        destination = portalTo;
        destinationSquare = destination;
        portalFocus = {
          from: raw,
          to: destination,
          type: rawCell?.portalType ?? "ladder",
        };

        pushStep({
          action:
            rawCell?.portalType === "snake"
              ? `Square ${raw} contains a snake, so this move must slide down to square ${destination}.`
              : `Square ${raw} contains a ladder, so this move must climb to square ${destination}.`,
          actionKind: "portal",
          codeLines: [11],
          done: false,
          explanationBeginner:
            rawCell?.portalType === "snake"
              ? "Landing on a snake is not optional. The move finishes where the snake sends you."
              : "Landing on a ladder is not optional. The move finishes where the ladder takes you.",
          explanationExpert:
            "The portal redirect rewrites the edge endpoint once per roll, matching the problem's single-jump rule.",
        });
      }

      if (distances[destination] === -1) {
        distances[destination] = entry.rolls + 1;
        visited.add(destination);
        parent.set(destination, entry.square);
        queue.push({ square: destination, rolls: entry.rolls + 1 });
        moveHistory.push({
          from: entry.square,
          roll,
          raw,
          destination,
          usedPortal: destination !== raw,
        });

        pushStep({
          action: `Square ${destination} is new, so record distance ${entry.rolls + 1} and enqueue it for future BFS expansion.`,
          actionKind: "enqueue",
          codeLines: [12, 13, 14],
          done: false,
          explanationBeginner:
            "The first time BFS reaches a square, it has found the fewest rolls needed to get there.",
          explanationExpert:
            "In an unweighted graph, the first discovery of a vertex fixes its shortest-path distance.",
        });

        if (destination === target) {
          result = entry.rolls + 1;
          bestPath = buildPath(parent, target);

          pushStep({
            action: `Square ${target} has been reached in ${result} roll${result === 1 ? "" : "s"}, so BFS can stop with the optimal answer.`,
            actionKind: "done",
            codeLines: [12],
            done: true,
            explanationBeginner:
              "Because BFS searches layer by layer, this is the fewest number of dice rolls possible.",
            explanationExpert:
              "The first time the target is discovered, its distance is globally minimal by BFS optimality on unweighted graphs.",
          });

          return trace;
        }
      } else {
        pushStep({
          action: `Skip square ${destination} because BFS already found a path there in ${distances[destination]} roll${distances[destination] === 1 ? "" : "s"}.`,
          actionKind: "skip",
          codeLines: [12],
          done: false,
          explanationBeginner:
            "Revisiting a square cannot help because BFS already reached it using fewer or equal rolls.",
          explanationExpert:
            "The visited-distance check prevents duplicate states and keeps the search at O(N^2).",
        });
      }
    }
  }

  currentSquare = null;
  candidateSquare = null;
  destinationSquare = null;
  dieRoll = null;
  portalFocus = null;
  result = -1;

  pushStep({
    action: "The queue became empty before reaching the last square, so the destination is unreachable.",
    actionKind: "done",
    codeLines: [18],
    done: true,
    explanationBeginner:
      "BFS ran out of squares to try, so there is no legal way to finish the game.",
    explanationExpert:
      "Exhausting the frontier without discovering the target proves no path exists in the implicit graph.",
  });

  return trace;
}
