export type Project = {
  id: number;
  capital: number;
  profit: number;
};

export type IPOState = {
  k: number;
  initialCapital: number;
  currentCapital: number;
  round: number;
  sortedProjects: Project[];
  nextProjectIndex: number;
  heap: Project[];
  selectedProjects: Project[];
  currentProject: Project | null;
  lastUnlocked: Project | null;
  lastSelected: Project | null;
  remainingSelections: number;
  answer: number | null;
};

export type IPOPointers = {
  sortedIndex: number | null;
  heapIndex: number | null;
  compareIndex: number | null;
  chosenProjectId: number | null;
  round: number | null;
};

export type IPOActionKind =
  | "parsed"
  | "round-start"
  | "unlock"
  | "bubble-up"
  | "select"
  | "bubble-down"
  | "gain"
  | "stalled"
  | "done";

export type IPOTraceStep = {
  step: number;
  state: IPOState;
  pointers: IPOPointers;
  action: string;
  actionKind: IPOActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumberList(rawInput: string) {
  return rawInput
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => Number(token))
    .filter((value) => Number.isFinite(value));
}

export function parseIPOInput(
  rawK: string,
  rawCapital: string,
  rawProfits: string,
  rawRequirements: string
) {
  const k = Math.max(0, Math.floor(Number(rawK.trim()) || 0));
  const initialCapital = Math.max(0, Math.floor(Number(rawCapital.trim()) || 0));
  const profits = parseNumberList(rawProfits).map((value) => Math.floor(value));
  const capital = parseNumberList(rawRequirements).map((value) => Math.floor(value));
  const usable = Math.min(profits.length, capital.length);
  const projects: Project[] = Array.from({ length: usable }, (_, index) => ({
    id: index,
    profit: profits[index],
    capital: capital[index],
  }));

  return {
    k,
    initialCapital,
    projects,
  };
}

export function formatCapital(value: number | null) {
  return value === null ? "n/a" : String(value);
}

function cloneProjects(projects: Project[]) {
  return projects.map((project) => ({ ...project }));
}

function betterProfit(left: Project, right: Project) {
  if (left.profit !== right.profit) {
    return left.profit > right.profit;
  }

  return left.id < right.id;
}

export function generateTrace(
  rawK: string,
  rawCapital: string,
  rawProfits: string,
  rawRequirements: string
): IPOTraceStep[] {
  const { k, initialCapital, projects } = parseIPOInput(
    rawK,
    rawCapital,
    rawProfits,
    rawRequirements
  );

  const sortedProjects = cloneProjects(projects).sort((left, right) => {
    if (left.capital !== right.capital) {
      return left.capital - right.capital;
    }

    if (left.profit !== right.profit) {
      return right.profit - left.profit;
    }

    return left.id - right.id;
  });

  const heap: Project[] = [];
  const selectedProjects: Project[] = [];
  const trace: IPOTraceStep[] = [];

  let currentCapital = initialCapital;
  let round = 0;
  let nextProjectIndex = 0;
  let currentProject: Project | null = null;
  let lastUnlocked: Project | null = null;
  let lastSelected: Project | null = null;
  let answer: number | null = null;

  let sortedIndexPointer: number | null = null;
  let heapIndexPointer: number | null = null;
  let compareIndexPointer: number | null = null;
  let chosenProjectId: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: IPOActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        k,
        initialCapital,
        currentCapital,
        round,
        sortedProjects: cloneProjects(sortedProjects),
        nextProjectIndex,
        heap: cloneProjects(heap),
        selectedProjects: cloneProjects(selectedProjects),
        currentProject: currentProject ? { ...currentProject } : null,
        lastUnlocked: lastUnlocked ? { ...lastUnlocked } : null,
        lastSelected: lastSelected ? { ...lastSelected } : null,
        remainingSelections: Math.max(k - selectedProjects.length, 0),
        answer,
      },
      pointers: {
        sortedIndex: sortedIndexPointer,
        heapIndex: heapIndexPointer,
        compareIndex: compareIndexPointer,
        chosenProjectId,
        round: round === 0 ? null : round,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      projects.length === 0
        ? "Parse the inputs. There are no projects to evaluate."
        : "Pair each project's capital requirement with its profit, sort by required capital, and prepare a max-heap for affordable profits.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    explanationBeginner:
      projects.length === 0
        ? "Without projects, capital cannot grow."
        : "The sorted list tells us which projects unlock next. The max-heap helps us choose the richest affordable one.",
    explanationExpert:
      projects.length === 0
        ? "The empty-project edge case returns the initial capital."
        : "This is the classic two-structure greedy: one pointer over capital-sorted projects plus a max-heap over affordable profits.",
    done: false,
  });

  if (projects.length === 0 || k === 0) {
    answer = initialCapital;
    pushStep({
      action: `No project rounds run, so final capital stays at ${initialCapital}.`,
      actionKind: "done",
      codeLines: [15],
      explanationBeginner:
        "If you cannot pick any project, your capital stays where it started.",
      explanationExpert:
        "With zero rounds or zero projects, the greedy loop is skipped entirely.",
      done: true,
    });
    return trace;
  }

  function bubbleUp(insertIndex: number) {
    let child = insertIndex;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      heapIndexPointer = child;
      compareIndexPointer = parent;

      if (betterProfit(heap[parent], heap[child])) {
        pushStep({
          action: `Compare profit ${heap[child].profit} with parent profit ${heap[parent].profit}. The richer project already sits above it, so the max-heap order holds.`,
          actionKind: "bubble-up",
          codeLines: [8],
          explanationBeginner:
            "The heap is already putting the better profit closer to the top.",
          explanationExpert:
            "Bubble-up stops once parent >= child by the heap ordering relation.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[child]] = [heap[child], heap[parent]];
      heapIndexPointer = parent;
      compareIndexPointer = child;

      pushStep({
        action: `Swap project ${heap[parent].id} upward because profit ${heap[parent].profit} beats profit ${heap[child].profit}.`,
        actionKind: "bubble-up",
        codeLines: [8],
        explanationBeginner:
          "A more profitable project climbs upward so it can be chosen sooner.",
        explanationExpert:
          "Insertion repair keeps extraction at O(log n) while preserving max-at-root semantics.",
        done: false,
      });

      child = parent;
    }
  }

  function bubbleDownFromRoot() {
    let parent = 0;

    while (parent < heap.length) {
      const left = parent * 2 + 1;
      const right = parent * 2 + 2;

      if (left >= heap.length) {
        break;
      }

      let next = left;
      if (right < heap.length && betterProfit(heap[right], heap[left])) {
        next = right;
      }

      heapIndexPointer = parent;
      compareIndexPointer = next;

      if (betterProfit(heap[parent], heap[next])) {
        pushStep({
          action: `Compare root profit ${heap[parent].profit} with child profit ${heap[next].profit}. The richest project is still on top, so bubbling stops.`,
          actionKind: "bubble-down",
          codeLines: [13],
          explanationBeginner:
            "The replacement root is already better than its children, so the heap is stable again.",
          explanationExpert:
            "Bubble-down terminates when the heap ordering relation holds at the current node.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[next]] = [heap[next], heap[parent]];
      heapIndexPointer = next;
      compareIndexPointer = parent;

      pushStep({
        action: `Swap a richer child upward so the max-heap keeps the highest profit at the root.`,
        actionKind: "bubble-down",
        codeLines: [13],
        explanationBeginner:
          "After a pop, the heap reorders itself so the best remaining project rises back to the top.",
        explanationExpert:
          "Deletion repair walks a single descendant chain, keeping pop at O(log n).",
        done: false,
      });

      parent = next;
    }
  }

  function popBestProject() {
    const best = heap[0];
    lastSelected = best;
    chosenProjectId = best.id;

    if (heap.length === 1) {
      heap.pop();
      heapIndexPointer = null;
      compareIndexPointer = null;
      pushStep({
        action: `Choose project ${best.id} from the heap root because its profit ${best.profit} is the best affordable move.`,
        actionKind: "select",
        codeLines: [11, 12, 13],
        explanationBeginner:
          "The top of the max-heap is the most rewarding project you can afford right now.",
        explanationExpert:
          "The greedy choice is valid because every affordable candidate is present in the max-heap and the maximum profit dominates all others this round.",
        done: false,
      });
      return best;
    }

    const tail = heap.pop() as Project;
    heap[0] = tail;
    heapIndexPointer = 0;
    compareIndexPointer = null;
    pushStep({
      action: `Choose project ${best.id} from the heap root, then move project ${tail.id} to the top temporarily for repair.`,
      actionKind: "select",
      codeLines: [11, 12, 13],
      explanationBeginner:
        "We always take the richest affordable project first.",
      explanationExpert:
        "Root extraction returns the argmax profit among affordable projects, then restores heap order.",
      done: false,
    });

    bubbleDownFromRoot();
    return best;
  }

  for (let slot = 0; slot < k; slot += 1) {
    round = slot + 1;
    chosenProjectId = null;
    currentProject = null;
    sortedIndexPointer = null;
    heapIndexPointer = null;
    compareIndexPointer = null;

    pushStep({
      action: `Start round ${round}. Current capital is ${currentCapital}, so first load every project whose requirement is at most that amount.`,
      actionKind: "round-start",
      codeLines: [6, 7],
      explanationBeginner:
        "Each round has two phases: unlock what you can afford, then pick the richest option.",
      explanationExpert:
        "The capital-sorted pointer advances monotonically, so each project enters the heap at most once.",
      done: false,
    });

    while (
      nextProjectIndex < sortedProjects.length &&
      sortedProjects[nextProjectIndex].capital <= currentCapital
    ) {
      const project = sortedProjects[nextProjectIndex];
      currentProject = project;
      lastUnlocked = project;
      sortedIndexPointer = nextProjectIndex;
      chosenProjectId = project.id;

      pushStep({
        action: `Project ${project.id} needs capital ${project.capital}, which is affordable now. Unlock it and send profit ${project.profit} into the max-heap.`,
        actionKind: "unlock",
        codeLines: [7, 8, 9],
        explanationBeginner:
          "As soon as a project becomes affordable, it joins the candidate pool.",
        explanationExpert:
          "Unlocking is one-way because the sorted pointer only moves forward as capital grows.",
        done: false,
      });

      heap.push(project);
      heapIndexPointer = heap.length - 1;
      compareIndexPointer = null;
      bubbleUp(heap.length - 1);
      nextProjectIndex += 1;
      sortedIndexPointer = nextProjectIndex;
    }

    if (heap.length === 0) {
      answer = currentCapital;
      currentProject = null;
      chosenProjectId = null;
      pushStep({
        action: `Round ${round} stalls because no affordable project is waiting in the heap. Final capital stays at ${currentCapital}.`,
        actionKind: "stalled",
        codeLines: [11, 15],
        explanationBeginner:
          "You cannot start any more projects, so growth stops here.",
        explanationExpert:
          "The greedy loop breaks exactly when the affordable frontier is empty.",
        done: false,
      });
      break;
    }

    const best = popBestProject();
    selectedProjects.push(best);
    currentProject = best;
    currentCapital += best.profit;
    answer = currentCapital;
    heapIndexPointer = null;
    compareIndexPointer = null;

    pushStep({
      action: `Finish project ${best.id}. Add profit ${best.profit}, so capital grows to ${currentCapital}.`,
      actionKind: "gain",
      codeLines: [12, 13],
      explanationBeginner:
        "Picking a project increases your budget, which can unlock stronger choices next round.",
      explanationExpert:
        "Capital is updated greedily after each extraction, expanding the feasible set for the next iteration.",
      done: false,
    });
  }

  round = Math.min(selectedProjects.length, k);
  currentProject = null;
  sortedIndexPointer = null;
  heapIndexPointer = null;
  compareIndexPointer = null;
  chosenProjectId = null;
  answer = currentCapital;

  pushStep({
    action: `The investment sequence ends with capital ${currentCapital}.`,
    actionKind: "done",
    codeLines: [15],
    explanationBeginner:
      "The greedy choices are finished, so this is the best capital reached by the simulation.",
    explanationExpert:
      "Because every round chose the maximum profit among all affordable projects, the final capital is greedily maximized.",
    done: true,
  });

  return trace;
}
