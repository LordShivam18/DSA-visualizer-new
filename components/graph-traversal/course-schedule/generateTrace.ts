export type CoursePair = [number, number];

export type CourseEdge = {
  from: number;
  to: number;
  pairIndex: number;
};

export type CourseNodeRecord = {
  course: number;
  outgoing: number[];
};

export type CourseScheduleState = {
  numCourses: number;
  prerequisites: CoursePair[];
  nodes: CourseNodeRecord[];
  edges: CourseEdge[];
  indegree: number[];
  queue: number[];
  takenOrder: number[];
  processedCount: number;
  remainingBlocked: number[];
  result: boolean | null;
};

export type CourseSchedulePointers = {
  buildingEdge: CourseEdge | null;
  currentCourse: number | null;
  neighborCourse: number | null;
  queueFront: number | null;
  edgeFocus: { from: number; to: number } | null;
};

export type CourseScheduleActionKind =
  | "parsed"
  | "add-edge"
  | "seed-ready"
  | "take-course"
  | "inspect-neighbor"
  | "reduce-indegree"
  | "enqueue-course"
  | "done";

export type CourseScheduleTraceStep = {
  step: number;
  action: string;
  actionKind: CourseScheduleActionKind;
  codeLines: number[];
  state: CourseScheduleState;
  pointers: CourseSchedulePointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export type CourseScheduleInput = {
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
    return [] as CoursePair[];
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

          return [course, prereq] as CoursePair;
        })
        .filter((entry): entry is CoursePair => entry !== null);
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

      return [values[0], values[1]] as CoursePair;
    })
    .filter((entry): entry is CoursePair => entry !== null);
}

function buildNodes(adjacency: number[][]) {
  return adjacency.map((outgoing, course) => ({
    course,
    outgoing: [...outgoing],
  }));
}

function blockedCourses(indegree: number[], takenOrder: number[]) {
  const takenSet = new Set(takenOrder);
  return indegree
    .map((value, course) => ({ value, course }))
    .filter((entry) => entry.value > 0 && !takenSet.has(entry.course))
    .map((entry) => entry.course);
}

export function formatCourseResult(value: boolean | null) {
  if (value === null) {
    return "building";
  }

  return value ? "true" : "false";
}

export function generateTrace(input: CourseScheduleInput) {
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
  const edges: CourseEdge[] = [];
  const queue: number[] = [];
  const takenOrder: number[] = [];
  const trace: CourseScheduleTraceStep[] = [];

  let currentCourse: number | null = null;
  let neighborCourse: number | null = null;
  let buildingEdge: CourseEdge | null = null;
  let edgeFocus: { from: number; to: number } | null = null;
  let result: boolean | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: CourseScheduleActionKind;
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
        prerequisites: parsedPairs.map((pair) => [...pair] as CoursePair),
        nodes: buildNodes(adjacency),
        edges: edges.map((edge) => ({ ...edge })),
        indegree: [...indegree],
        queue: [...queue],
        takenOrder: [...takenOrder],
        processedCount: takenOrder.length,
        remainingBlocked: blockedCourses(indegree, takenOrder),
        result,
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
        ? "Parse the course count and prerequisites. There are no courses to schedule."
        : "Parse the course count and prerequisites. Next, the graph will store edges from each prerequisite to the course it unlocks.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    done: false,
    explanationBeginner:
      numCourses === 0
        ? "With zero courses, the schedule is trivially possible."
        : "Topological BFS needs two things: the prerequisite graph and an indegree count for each course.",
    explanationExpert:
      numCourses === 0
        ? "The empty graph is vacuously acyclic."
        : "Kahn's algorithm maintains the invariant that indegree counts unresolved prerequisites.",
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
      action: `Add edge ${prereq} -> ${course}. Course ${course} now has ${indegree[course]} prerequisite${indegree[course] === 1 ? "" : "s"} waiting.`,
      actionKind: "add-edge",
      codeLines: [4, 5, 6, 7],
      done: false,
      explanationBeginner:
        "If course 1 depends on course 0, then the arrow points from 0 to 1 because finishing 0 unlocks 1.",
      explanationExpert:
        "The directed edge prereq -> course and indegree[course]++ together encode dependency pressure for Kahn BFS.",
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
      action: `Course ${course} has indegree 0, so it is ready immediately and enters the queue.`,
      actionKind: "seed-ready",
      codeLines: [9, 10, 11],
      done: false,
      explanationBeginner:
        "A course with no remaining prerequisites can be taken right away.",
      explanationExpert:
        "The initial queue is the frontier of zero-indegree vertices in the DAG candidate.",
    });
  }

  if (numCourses > 0 && queue.length === 0) {
    pushStep({
      action: "No course starts with indegree 0, so the queue is empty before BFS even begins.",
      actionKind: "seed-ready",
      codeLines: [9, 10, 11],
      done: false,
      explanationBeginner:
        "That is a warning sign that every course is waiting on another course.",
      explanationExpert:
        "An empty initial zero-indegree frontier strongly suggests a directed cycle.",
    });
  }

  while (queue.length > 0) {
    const course = queue.shift() as number;
    currentCourse = course;
    neighborCourse = null;
    edgeFocus = null;
    takenOrder.push(course);

    pushStep({
      action: `Take course ${course} from the front of the queue and add it to the finished schedule prefix.`,
      actionKind: "take-course",
      codeLines: [14, 15, 16, 17],
      done: false,
      explanationBeginner:
        "Because all of its prerequisites are cleared, this course is safe to complete now.",
      explanationExpert:
        "Dequeuing a zero-indegree vertex removes one confirmed item from the partial topological order.",
    });

    for (const nextCourse of adjacency[course]) {
      neighborCourse = nextCourse;
      edgeFocus = { from: course, to: nextCourse };

      pushStep({
        action: `Inspect edge ${course} -> ${nextCourse}. Finishing course ${course} should reduce one prerequisite from course ${nextCourse}.`,
        actionKind: "inspect-neighbor",
        codeLines: [18],
        done: false,
        explanationBeginner:
          "This outgoing edge means the current course helps unlock the next course.",
        explanationExpert:
          "Processing outgoing edges models deleting the current vertex from the remaining dependency graph.",
      });

      indegree[nextCourse] -= 1;

      pushStep({
        action: `Decrease indegree of course ${nextCourse} to ${indegree[nextCourse]}.`,
        actionKind: "reduce-indegree",
        codeLines: [19],
        done: false,
        explanationBeginner:
          "One prerequisite has been satisfied, so the remaining wait for that course gets smaller.",
        explanationExpert:
          "Indegree decrements reflect resolved incoming constraints after removing the processed vertex.",
      });

      if (indegree[nextCourse] === 0) {
        queue.push(nextCourse);

        pushStep({
          action: `Course ${nextCourse} now has indegree 0, so it becomes ready and joins the queue.`,
          actionKind: "enqueue-course",
          codeLines: [20],
          done: false,
          explanationBeginner:
            "That course has no unsatisfied prerequisites left, so it is unlocked.",
          explanationExpert:
            "A vertex enters the queue exactly when all prerequisite edges into it have been deleted.",
        });
      }
    }
  }

  currentCourse = null;
  neighborCourse = null;
  edgeFocus = null;
  result = takenOrder.length === numCourses;

  if (result) {
    pushStep({
      action: `BFS finished after taking all ${numCourses} course${numCourses === 1 ? "" : "s"}, so the prerequisite graph is acyclic.`,
      actionKind: "done",
      codeLines: [23],
      done: true,
      explanationBeginner:
        "Every course found a legal place in the queue, so finishing everything is possible.",
      explanationExpert:
        "Kahn's algorithm succeeds precisely when the topological order contains every vertex.",
    });
  } else {
    const blocked = blockedCourses(indegree, takenOrder);
    pushStep({
      action: `BFS stopped after taking ${takenOrder.length} course${
        takenOrder.length === 1 ? "" : "s"
      }. Courses ${blocked.join(", ")} still have unresolved prerequisites, so a cycle blocks completion.`,
      actionKind: "done",
      codeLines: [23],
      done: true,
      explanationBeginner:
        "Some courses keep waiting on one another forever, so the schedule cannot be completed.",
      explanationExpert:
        "If processedCount < numCourses, the remaining subgraph contains a directed cycle.",
    });
  }

  return trace;
}
