export type QueryRecord = {
  from: string;
  to: string;
};

export type WeightedNeighbor = {
  to: string;
  weight: number;
};

export type GraphNodeRecord = {
  variable: string;
  neighbors: WeightedNeighbor[];
};

export type EquationRecord = {
  from: string;
  to: string;
  weight: number;
  reverseWeight: number;
};

export type SearchFrame = {
  variable: string;
  product: number;
  path: string[];
};

export type EdgeFocus = {
  from: string;
  to: string;
};

export type EvaluateDivisionState = {
  equations: EquationRecord[];
  queries: QueryRecord[];
  graphNodes: GraphNodeRecord[];
  searchStack: SearchFrame[];
  visited: string[];
  answers: (number | null)[];
  currentQueryIndex: number | null;
  currentQuery: QueryRecord | null;
  activePath: string[] | null;
  successfulPath: string[] | null;
  result: number[] | null;
};

export type EvaluateDivisionPointers = {
  buildingEdge: EquationRecord | null;
  currentVariable: string | null;
  neighborVariable: string | null;
  currentProduct: number | null;
  queryCursor: number | null;
  edgeFocus: EdgeFocus | null;
};

export type EvaluateDivisionActionKind =
  | "parsed"
  | "add-equation"
  | "start-query"
  | "missing-variable"
  | "answer-self"
  | "seed-search"
  | "pop-node"
  | "inspect-neighbor"
  | "push-neighbor"
  | "skip-neighbor"
  | "found-answer"
  | "query-failed"
  | "done";

export type EvaluateDivisionTraceStep = {
  step: number;
  action: string;
  actionKind: EvaluateDivisionActionKind;
  codeLines: number[];
  state: EvaluateDivisionState;
  pointers: EvaluateDivisionPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type EvaluateDivisionInput = {
  equations: string;
  values: string;
  queries: string;
};

function normalizeVariable(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[^a-zA-Z0-9_]/g, "");
}

function parsePairList(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as QueryRecord[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => {
          if (!Array.isArray(entry) || entry.length < 2) {
            return null;
          }

          const from = normalizeVariable(entry[0]);
          const to = normalizeVariable(entry[1]);
          return from && to ? { from, to } : null;
        })
        .filter((entry): entry is QueryRecord => entry !== null);
    }
  } catch {
    // Fall back to loose text parsing below.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const cleaned = row.replace(/[()[\],/]/g, " ");
      const parts = cleaned
        .split(/\s+/)
        .map((part) => normalizeVariable(part))
        .filter(Boolean);

      if (parts.length < 2) {
        return null;
      }

      return { from: parts[0], to: parts[1] };
    })
    .filter((entry): entry is QueryRecord => entry !== null);
}

function parseValues(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as number[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value !== 0);
    }
  } catch {
    // Fall back to token parsing below.
  }

  return (trimmed.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? [])
    .map((token) => Number(token))
    .filter((value) => Number.isFinite(value) && value !== 0);
}

function roundValue(value: number) {
  return Number(value.toPrecision(12));
}

function cloneGraphNodes(
  variableOrder: string[],
  adjacency: Map<string, WeightedNeighbor[]>
) {
  return variableOrder.map((variable) => ({
    variable,
    neighbors: (adjacency.get(variable) ?? []).map((neighbor) => ({
      to: neighbor.to,
      weight: neighbor.weight,
    })),
  }));
}

function cloneFrames(frames: SearchFrame[]) {
  return frames.map((frame) => ({
    variable: frame.variable,
    product: frame.product,
    path: [...frame.path],
  }));
}

function clonePath(path: string[] | null) {
  return path ? [...path] : null;
}

function buildAnswerSnapshot(answers: (number | null)[]) {
  return answers.map((value) => (value === null ? null : roundValue(value)));
}

export function formatValue(value: number | null) {
  if (value === null) {
    return "pending";
  }

  return value.toFixed(5);
}

export function formatAnswerList(values: (number | null)[] | null) {
  if (!values || values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => formatValue(value)).join(", ")}]`;
}

export function generateTrace(input: EvaluateDivisionInput) {
  const parsedEquations = parsePairList(input.equations);
  const parsedQueries = parsePairList(input.queries);
  const parsedValues = parseValues(input.values);

  const equations: EquationRecord[] = parsedEquations.map((equation, index) => {
    const weight = roundValue(parsedValues[index] ?? 1);
    return {
      from: equation.from,
      to: equation.to,
      weight,
      reverseWeight: roundValue(1 / weight),
    };
  });

  const adjacency = new Map<string, WeightedNeighbor[]>();
  const variableOrder: string[] = [];
  const variableSet = new Set<string>();
  const answers = Array.from({ length: parsedQueries.length }, () => null as number | null);
  const visited = new Set<string>();
  const stack: SearchFrame[] = [];
  const trace: EvaluateDivisionTraceStep[] = [];

  let currentQueryIndex: number | null = null;
  let currentQuery: QueryRecord | null = null;
  let buildingEdge: EquationRecord | null = null;
  let currentVariable: string | null = null;
  let neighborVariable: string | null = null;
  let currentProduct: number | null = null;
  let edgeFocus: EdgeFocus | null = null;
  let activePath: string[] | null = null;
  let successfulPath: string[] | null = null;
  let result: number[] | null = null;

  function registerVariable(variable: string) {
    if (!variableSet.has(variable)) {
      variableSet.add(variable);
      variableOrder.push(variable);
      adjacency.set(variable, []);
    }
  }

  function pushNeighbor(from: string, to: string, weight: number) {
    const neighbors = adjacency.get(from);
    if (!neighbors) {
      return;
    }

    neighbors.push({ to, weight });
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
    actionKind: EvaluateDivisionActionKind;
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
        equations: equations.map((equation) => ({ ...equation })),
        queries: parsedQueries.map((query) => ({ ...query })),
        graphNodes: cloneGraphNodes(variableOrder, adjacency),
        searchStack: cloneFrames(stack),
        visited: [...visited],
        answers: buildAnswerSnapshot(answers),
        currentQueryIndex,
        currentQuery: currentQuery ? { ...currentQuery } : null,
        activePath: clonePath(activePath),
        successfulPath: clonePath(successfulPath),
        result: result ? [...result] : null,
      },
      pointers: {
        buildingEdge: buildingEdge ? { ...buildingEdge } : null,
        currentVariable,
        neighborVariable,
        currentProduct,
        queryCursor: currentQueryIndex,
        edgeFocus: edgeFocus ? { ...edgeFocus } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      equations.length === 0
        ? "Parse the equations, values, and queries. No variable relationships were provided."
        : "Parse the equations, values, and queries. The next phase will turn each equation into two weighted graph edges.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 8, 9, 10],
    done: false,
    explanationBeginner:
      equations.length === 0
        ? "Without equations, the graph has no connections, so most queries will be impossible."
        : "Each equation like a / b = 2.0 becomes a graph link we can walk later when answering queries.",
    explanationExpert:
      equations.length === 0
        ? "The graph is empty, so only degenerate self-queries on known variables could ever succeed, and there are none yet."
        : "This problem is reduced to reachability on a weighted graph where path multiplication composes ratios.",
  });

  for (const equation of equations) {
    registerVariable(equation.from);
    registerVariable(equation.to);
    pushNeighbor(equation.from, equation.to, equation.weight);
    pushNeighbor(equation.to, equation.from, equation.reverseWeight);
    buildingEdge = equation;
    currentVariable = equation.from;
    neighborVariable = equation.to;
    currentProduct = equation.weight;
    edgeFocus = { from: equation.from, to: equation.to };

    pushStep({
      action: `Add equation ${equation.from} / ${equation.to} = ${equation.weight.toFixed(
        5
      )}, so the graph stores ${equation.from} -> ${equation.to} (${equation.weight.toFixed(
        5
      )}) and ${equation.to} -> ${equation.from} (${equation.reverseWeight.toFixed(5)}).`,
      actionKind: "add-equation",
      codeLines: [3, 4, 5, 6],
      done: false,
      explanationBeginner:
        "The graph keeps both directions because division can be read forward and backward.",
      explanationExpert:
        "Every equation contributes reciprocal directed edges, which makes any valid ratio a multiplicative path query.",
    });
  }

  buildingEdge = null;
  currentVariable = null;
  neighborVariable = null;
  currentProduct = null;
  edgeFocus = null;

  for (let index = 0; index < parsedQueries.length; index += 1) {
    const query = parsedQueries[index];
    currentQueryIndex = index;
    currentQuery = query;
    currentVariable = null;
    neighborVariable = null;
    currentProduct = null;
    edgeFocus = null;
    activePath = null;
    successfulPath = null;
    stack.length = 0;
    visited.clear();

    pushStep({
      action: `Start query ${index + 1}: compute ${query.from} / ${query.to} by traversing the weighted graph.`,
      actionKind: "start-query",
      codeLines: [9, 10],
      done: false,
      explanationBeginner:
        "Each query asks whether we can walk from the first variable to the second and multiply edge weights along the way.",
      explanationExpert:
        "Queries are independent graph searches over the same prebuilt adjacency structure.",
    });

    if (!adjacency.has(query.from) || !adjacency.has(query.to)) {
      answers[index] = -1;

      pushStep({
        action: `Query ${query.from} / ${query.to} fails immediately because at least one variable is missing from the graph.`,
        actionKind: "missing-variable",
        codeLines: [11],
        done: false,
        explanationBeginner:
          "If a variable never appeared in any equation, there is no information to connect it to anything else.",
        explanationExpert:
          "Undefined vertices are absent from the adjacency map, so the answer is the sentinel value -1.0.",
      });
      continue;
    }

    if (query.from === query.to) {
      answers[index] = 1;
      successfulPath = [query.from];
      activePath = [query.from];

      pushStep({
        action: `Query ${query.from} / ${query.to} resolves to 1.00000 because both sides are the same known variable.`,
        actionKind: "answer-self",
        codeLines: [12],
        done: false,
        explanationBeginner:
          "Any variable divided by itself equals 1 as long as that variable is known.",
        explanationExpert:
          "The equal-endpoint base case avoids unnecessary traversal and preserves correctness.",
      });
      continue;
    }

    stack.push({
      variable: query.from,
      product: 1,
      path: [query.from],
    });
    visited.add(query.from);
    activePath = [query.from];
    currentVariable = query.from;
    currentProduct = 1;

    pushStep({
      action: `Seed DFS with variable ${query.from}. The running product starts at 1.00000 because no edge has been crossed yet.`,
      actionKind: "seed-search",
      codeLines: [13, 14, 15, 16],
      done: false,
      explanationBeginner:
        "The search begins at the numerator and will keep multiplying weights as it moves through the graph.",
      explanationExpert:
        "The stack stores states of the form (vertex, accumulated ratio from src to vertex).",
    });

    let resolved: number | null = null;

    while (stack.length > 0) {
      const frame = stack.pop() as SearchFrame;
      currentVariable = frame.variable;
      currentProduct = frame.product;
      activePath = [...frame.path];
      neighborVariable = null;
      edgeFocus = null;

      pushStep({
        action: `Pop ${frame.variable} from the DFS stack. The accumulated ratio from ${query.from} to ${frame.variable} is ${frame.product.toFixed(
          5
        )}.`,
        actionKind: "pop-node",
        codeLines: [18, 19, 20],
        done: false,
        explanationBeginner:
          "This variable is the next place we try extending the path.",
        explanationExpert:
          "Popping a frame restores one candidate path prefix and its multiplicative invariant.",
      });

      if (frame.variable === query.to) {
        resolved = roundValue(frame.product);
        answers[index] = resolved;
        successfulPath = [...frame.path];
        edgeFocus = null;

        pushStep({
          action: `The search reached ${query.to}. The query answer is ${resolved.toFixed(
            5
          )}.`,
          actionKind: "found-answer",
          codeLines: [21, 28],
          done: false,
          explanationBeginner:
            "Reaching the target means the path product now equals the requested division value.",
          explanationExpert:
            "When node == dst, the accumulated ratio is exactly the answer for this query.",
        });
        break;
      }

      const neighbors = adjacency.get(frame.variable) ?? [];
      for (const neighbor of neighbors) {
        neighborVariable = neighbor.to;
        edgeFocus = { from: frame.variable, to: neighbor.to };

        pushStep({
          action: `Inspect edge ${frame.variable} -> ${neighbor.to} with weight ${neighbor.weight.toFixed(
            5
          )}.`,
          actionKind: "inspect-neighbor",
          codeLines: [22],
          done: false,
          explanationBeginner:
            "The search checks whether walking to this neighbor could help reach the target.",
          explanationExpert:
            "Every outgoing edge offers a candidate ratio extension by multiplying the current product with the edge weight.",
        });

        if (visited.has(neighbor.to)) {
          pushStep({
            action: `Skip ${neighbor.to} because DFS already discovered it earlier in this query.`,
            actionKind: "skip-neighbor",
            codeLines: [23],
            done: false,
            explanationBeginner:
              "Revisiting the same variable would only repeat work and could loop forever inside cycles.",
            explanationExpert:
              "The seen set enforces O(V + E) traversal per query by preventing duplicate expansions.",
          });
          continue;
        }

        const nextProduct = roundValue(frame.product * neighbor.weight);
        const nextPath = [...frame.path, neighbor.to];
        visited.add(neighbor.to);
        stack.push({
          variable: neighbor.to,
          product: nextProduct,
          path: nextPath,
        });
        activePath = nextPath;
        currentProduct = nextProduct;

        pushStep({
          action: `Push ${neighbor.to} onto the stack with accumulated ratio ${nextProduct.toFixed(
            5
          )}.`,
          actionKind: "push-neighbor",
          codeLines: [24, 25],
          done: false,
          explanationBeginner:
            "Multiplying by the edge weight extends the path ratio to this new variable.",
          explanationExpert:
            "The pushed state preserves the invariant: product = src / neighbor along the stored path.",
        });
      }
    }

    if (resolved === null) {
      answers[index] = -1;
      successfulPath = null;
      activePath = null;
      currentProduct = null;
      currentVariable = null;
      neighborVariable = null;
      edgeFocus = null;

      pushStep({
        action: `DFS exhausted the stack without reaching ${query.to}, so the answer for ${query.from} / ${query.to} is -1.00000.`,
        actionKind: "query-failed",
        codeLines: [18, 28],
        done: false,
        explanationBeginner:
          "No chain of known equations connected the source variable to the target variable.",
        explanationExpert:
          "The target lies outside the reachable component of the source in the weighted graph.",
      });
    }
  }

  currentQueryIndex = null;
  currentQuery = null;
  currentVariable = null;
  neighborVariable = null;
  currentProduct = null;
  edgeFocus = null;
  activePath = successfulPath ? [...successfulPath] : null;
  result = answers.map((value) => roundValue(value ?? -1));

  pushStep({
    action: `All ${parsedQueries.length} quer${
      parsedQueries.length === 1 ? "y has" : "ies have"
    } been resolved. The final answer list is ${formatAnswerList(result)}.`,
    actionKind: "done",
    codeLines: [30],
    done: true,
    explanationBeginner:
      "The graph stayed the same for every query; only the DFS search restarted with a new source and target.",
    explanationExpert:
      "Graph construction costs O(E), and each query performs O(V + E) DFS in the worst case over the same adjacency map.",
  });

  return trace;
}
