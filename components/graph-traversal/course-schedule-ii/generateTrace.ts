export type CourseScheduleIIPair = [number, number];

export type CourseScheduleIIEdge = {
  from: number;
  to: number;
  pairIndex: number;
};

export type CourseScheduleIINode = {
  course: number;
  outgoing: number[];
};

export type CourseScheduleIIState = {
  numCourses: number;
  prerequisites: CourseScheduleIIPair[];
  nodes: CourseScheduleIINode[];
  edges: CourseScheduleIIEdge[];
  indegree: number[];
  queue: number[];
  order: number[];
  processedCount: number;
  remainingBlocked: number[];
  result: number[] | null;
};

export type CourseScheduleIIPointers = {
  buildingEdge: CourseScheduleIIEdge | null;
  currentCourse: number | null;
  neighborCourse: number | null;
  queueFront: number | null;
  edgeFocus: { from: number; to: number } | null;
};

export type CourseScheduleIIActionKind =
  | "parsed"
  | "add-edge"
  | "seed-ready"
  | "append-order"
  | "inspect-neighbor"
  | "reduce-indegree"
  | "enqueue-course"
  | "done";

export type CourseScheduleIITraceStep = {
  step: number;
  action: string;
  actionKind: CourseScheduleIIActionKind;
  codeLines: number[];
  state: CourseScheduleIIState;
  pointers: CourseScheduleIIPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type CourseScheduleIIInput = {
  numCourses: string;
  prerequisites: string;
};

function parseNumCourses(raw: string) {
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }

  return Math.floor(numeric);
}

function parsePrerequisites(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [] as CourseScheduleIIPair[];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => {
          if (!Array.isArray(entry) || entry.length < 2) {
            return null;
          }

          const course = Number(entry[0]);
          const prereq = Number(entry[1]);
          if (!Number.isInteger(course) || !Number.isInteger(prereq)) {
            return null;
          }

          return [course, prereq] as CourseScheduleIIPair;
        })
        .filter((entry): entry is CourseScheduleIIPair => entry !== null);
    }
  } catch {
    // Fall back to plain text parsing below.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const values = (row.match(/-?\d+/g) ?? []).map((token) => Number(token));
      if (values.length < 2) {
        return null;
      }

      return [values[0], values[1]] as CourseScheduleIIPair;
    })
    .filter((entry): entry is CourseScheduleIIPair => entry !== null);
}

function buildNodes(adjacency: number[][]) {
  return adjacency.map((outgoing, course) => ({
    course,
    outgoing: [...outgoing],
  }));
}

function blockedCourses(indegree: number[], order: number[]) {
  const takenSet = new Set(order);
  return indegree
    .map((value, course) => ({ value, course }))
    .filter((entry) => entry.value > 0 && !takenSet.has(entry.course))
    .map((entry) => entry.course);
}

export function formatOrderResult(value: number[] | null) {
  if (value === null) {
    return "building";
  }

  return `[${value.join(", ")}]`;
}

export function generateTrace(input: CourseScheduleIIInput) {
  const numCourses = parseNumCourses(input.numCourses);
  const parsedPairs = parsePrerequisites(input.prerequisites).filter(
    ([course, prereq]) =>
      course >= 0 &&
      prereq >= 0 &&
      course < numCourses &&
      prereq < numCourses
  );

  const adjacency = Array.from({ length: numCourses }, () => [] as number[]);
  const indegree = Array.from({ length: numCourses }, () => 0);
  const edges: CourseScheduleIIEdge[] = [];
  const queue: number[] = [];
  const order: number[] = [];
  const trace: CourseScheduleIITraceStep[] = [];

  let currentCourse: number | null = null;
  let neighborCourse: number | null = null;
  let buildingEdge: CourseScheduleIIEdge | null = null;
  let edgeFocus: { from: number; to: number } | null = null;
  let result: number[] | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: CourseScheduleIIActionKind;
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
        numCourses,
        prerequisites: parsedPairs.map((pair) => [...pair] as CourseScheduleIIPair),
        nodes: buildNodes(adjacency),
        edges: edges.map((edge) => ({ ...edge })),
        indegree: [...indegree],
        queue: [...queue],
        order: [...order],
        processedCount: order.length,
        remainingBlocked: blockedCourses(indegree, order),
        result: result ? [...result] : null,
      },
      pointers: {
        buildingEdge: buildingEdge ? { ...buildingEdge } : null,
        currentCourse,
        neighborCourse,
        queueFront: queue.length > 0 ? queue[0] : null,
        edgeFocus: edgeFocus ? { ...edgeFocus } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      numCourses === 0
        ? "Parse the course count and prerequisites. There are no courses to order."
        : "Parse the course count and prerequisites. Kahn BFS will build a valid order by repeatedly removing zero-indegree courses.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    done: false,
    explanationBeginner:
      numCourses === 0
        ? "An empty curriculum already has a valid ordering: the empty list."
        : "The same queue logic from Course Schedule is used here, but now we keep the actual order too.",
    explanationExpert:
      numCourses === 0
        ? "The empty graph yields the empty topological order."
        : "The output order is the topological order produced by Kahn's algorithm if and only if the graph is acyclic.",
  });

  for (let index = 0; index < parsedPairs.length; index += 1) {
    const [course, prereq] = parsedPairs[index];
    adjacency[prereq].push(course);
    indegree[course] += 1;

    const edge = { from: prereq, to: course, pairIndex: index };
    edges.push(edge);
    buildingEdge = edge;
    currentCourse = prereq;
    neighborCourse = course;
    edgeFocus = { from: prereq, to: course };

    pushStep({
      action: `Add edge ${prereq} -> ${course}. Course ${course} now waits on ${indegree[course]} prerequisite${indegree[course] === 1 ? "" : "s"}.`,
      actionKind: "add-edge",
      codeLines: [4, 5, 6, 7],
      done: false,
      explanationBeginner:
        "This arrow means course 0 must happen before course 1, not the other way around.",
      explanationExpert:
        "Indegree counts incoming prerequisite constraints that must be resolved before the course can enter the order.",
    });
  }

  buildingEdge = null;
  currentCourse = null;
  neighborCourse = null;
  edgeFocus = null;

  for (let course = 0; course < numCourses; course += 1) {
    if (indegree[course] !== 0) {
      continue;
    }

    queue.push(course);
    currentCourse = course;

    pushStep({
      action: `Course ${course} has indegree 0, so it is available as an opening choice and joins the queue.`,
      actionKind: "seed-ready",
      codeLines: [9, 10, 11],
      done: false,
      explanationBeginner:
        "The ordering must begin with courses that are already unblocked.",
      explanationExpert:
        "Zero-indegree vertices form the initial candidate set for the topological order.",
    });
  }

  if (numCourses > 0 && queue.length === 0) {
    pushStep({
      action: "No course starts with indegree 0, so the order cannot begin unless a cycle is broken.",
      actionKind: "seed-ready",
      codeLines: [9, 10, 11],
      done: false,
      explanationBeginner:
        "If every course is waiting on another one, there is no legal first step.",
      explanationExpert:
        "An empty initial frontier indicates that the graph already contains a directed cycle.",
    });
  }

  while (queue.length > 0) {
    const course = queue.shift() as number;
    currentCourse = course;
    neighborCourse = null;
    edgeFocus = null;
    order.push(course);

    pushStep({
      action: `Pop course ${course} from the queue and append it to the output order.`,
      actionKind: "append-order",
      codeLines: [14, 15, 16, 17],
      done: false,
      explanationBeginner:
        "This course is safe to place next in the answer because nothing still blocks it.",
      explanationExpert:
        "Every dequeue commits one vertex to the topological order in a way that preserves prerequisite constraints.",
    });

    for (const nextCourse of adjacency[course]) {
      neighborCourse = nextCourse;
      edgeFocus = { from: course, to: nextCourse };

      pushStep({
        action: `Inspect edge ${course} -> ${nextCourse}. Removing course ${course} should reduce the wait on course ${nextCourse}.`,
        actionKind: "inspect-neighbor",
        codeLines: [18],
        done: false,
        explanationBeginner:
          "Each outgoing edge points to a course that becomes easier to unlock now.",
        explanationExpert:
          "Processing outgoing edges deletes constraints from the residual dependency graph.",
      });

      indegree[nextCourse] -= 1;

      pushStep({
        action: `Decrease indegree of course ${nextCourse} to ${indegree[nextCourse]}.`,
        actionKind: "reduce-indegree",
        codeLines: [19],
        done: false,
        explanationBeginner:
          "One required course is finished, so this course has one less thing to wait for.",
        explanationExpert:
          "Indegree decrements update the count of unresolved incoming prerequisite edges.",
      });

      if (indegree[nextCourse] === 0) {
        queue.push(nextCourse);

        pushStep({
          action: `Course ${nextCourse} just reached indegree 0, so it is ready to appear later in the final order.`,
          actionKind: "enqueue-course",
          codeLines: [20],
          done: false,
          explanationBeginner:
            "All blockers are gone, so this course can now line up for placement.",
          explanationExpert:
            "A vertex joins the queue at the exact moment all its prerequisites are already in the order prefix.",
        });
      }
    }
  }

  currentCourse = null;
  neighborCourse = null;
  edgeFocus = null;
  result = order.length === numCourses ? [...order] : [];

  if (order.length === numCourses) {
    pushStep({
      action: `The queue produced a full ordering: ${formatOrderResult(result)}.`,
      actionKind: "done",
      codeLines: [23],
      done: true,
      explanationBeginner:
        "Because every course entered the order exactly once, this is a valid way to finish all courses.",
      explanationExpert:
        "When order.size() == numCourses, the graph is acyclic and the constructed list is a valid topological sort.",
    });
  } else {
    const blocked = blockedCourses(indegree, order);
    pushStep({
      action: `Only ${order.length} course${order.length === 1 ? "" : "s"} entered the order. Courses ${blocked.join(
        ", "
      )} remain in a cycle, so the final result is [].`,
      actionKind: "done",
      codeLines: [23],
      done: true,
      explanationBeginner:
        "The queue got stuck before reaching every course, so there is no legal full ordering.",
      explanationExpert:
        "If the topological order is shorter than V, the residual graph contains a directed cycle and the answer must be empty.",
    });
  }

  return trace;
}
