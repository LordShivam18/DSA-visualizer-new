export type TimelineAnimationType =
  | "move"
  | "highlight"
  | "insert"
  | "remove"
  | "update";

export type TimelineSpeed = 0.5 | 1 | 2;

export type TimelineAnimation = {
  type: TimelineAnimationType;
  targets: string[];
  duration: number;
};

export type TimelineStep<State = unknown, Highlights = unknown> = {
  step: number;
  state: State;
  highlights: Highlights;
  animation: TimelineAnimation;
  action: string;
};

export type TimelineSnapshot<Step extends TimelineStep = TimelineStep> = {
  version: number;
  steps: Step[];
  activeIndex: number;
  settledIndex: number;
  activeStep: Step;
  previousStep: Step | null;
  nextStep: Step | null;
  fromStep: Step | null;
  toStep: Step | null;
  transitionProgress: number;
  isPlaying: boolean;
  speed: TimelineSpeed;
  canPrev: boolean;
  canNext: boolean;
  queue: number[];
  lockedStepIndices: number[];
  lockedTargetIndex: number | null;
  lockReason: string | null;
};

type TransitionState = {
  from: number;
  to: number;
  startedAt: number;
  duration: number;
};

type Subscriber<Step extends TimelineStep> = (
  snapshot: TimelineSnapshot<Step>
) => void;

function clampIndex(value: number, max: number) {
  return Math.min(Math.max(value, 0), max);
}

function arraysEqual<T>(left: T[], right: T[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => Object.is(item, right[index]));
}

function animationEqual(
  left: TimelineAnimation | undefined,
  right: TimelineAnimation | undefined
) {
  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return (
    left.type === right.type &&
    left.duration === right.duration &&
    arraysEqual(left.targets, right.targets)
  );
}

function timelineStepsEqual<Step extends TimelineStep>(
  left: Step[],
  right: Step[]
) {
  if (left === right) {
    return true;
  }

  if (left.length !== right.length) {
    return false;
  }

  return left.every((leftStep, index) => {
    const rightStep = right[index];

    return (
      leftStep === rightStep ||
      (leftStep.step === rightStep.step &&
        leftStep.action === rightStep.action &&
        Object.is(leftStep.state, rightStep.state) &&
        Object.is(leftStep.highlights, rightStep.highlights) &&
        animationEqual(leftStep.animation, rightStep.animation))
    );
  });
}

function normalizeLockedSteps(indices: number[]) {
  return Array.from(new Set(indices)).sort((left, right) => left - right);
}

let nextTimelineSnapshotVersion = 1;

function createTimelineSnapshotVersion() {
  const version = nextTimelineSnapshotVersion;
  nextTimelineSnapshotVersion += 1;
  return version;
}

export class TimelineEngine<Step extends TimelineStep = TimelineStep> {
  private steps: Step[];
  private settledIndex = 0;
  private isPlaying = false;
  private speed: TimelineSpeed = 1;
  private queue: number[] = [];
  private lockedSteps = new Set<number>();
  private lockReason: string | null = null;
  private blockedTarget: number | null = null;
  private transition: TransitionState | null = null;
  private subscribers = new Set<Subscriber<Step>>();
  private frameId: number | null = null;
  private version = createTimelineSnapshotVersion();
  private lastEmittedVersion: number | null = null;

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  subscribe(subscriber: Subscriber<Step>) {
    this.subscribers.add(subscriber);
    subscriber(this.getSnapshot());

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  destroy() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.isPlaying = false;
    this.queue = [];
    this.subscribers.clear();
    this.lastEmittedVersion = null;
  }

  setSteps(steps: Step[]) {
    if (timelineStepsEqual(this.steps, steps)) {
      return;
    }

    this.cancelFrame();
    this.steps = steps;
    this.settledIndex = 0;
    this.isPlaying = false;
    this.queue = [];
    this.lockedSteps.clear();
    this.lockReason = null;
    this.blockedTarget = null;
    this.transition = null;
    this.emitChanged();
  }

  setLockedSteps(indices: number[], reason?: string) {
    const nextIndices = normalizeLockedSteps(indices);
    const previousIndices = normalizeLockedSteps([...this.lockedSteps]);
    const nextReason = nextIndices.length > 0 ? reason ?? null : null;

    if (
      arraysEqual(previousIndices, nextIndices) &&
      this.lockReason === nextReason
    ) {
      return;
    }

    this.lockedSteps = new Set(nextIndices);
    this.lockReason = nextReason;

    if (
      this.blockedTarget !== null &&
      !this.lockedSteps.has(this.blockedTarget)
    ) {
      this.blockedTarget = null;
    }

    this.emitChanged();
  }

  getSnapshot(): TimelineSnapshot<Step> {
    const activeIndex = this.transition?.to ?? this.settledIndex;
    const lastIndex = Math.max(this.steps.length - 1, 0);
    const clampedActiveIndex = clampIndex(activeIndex, lastIndex);
    const activeStep = this.steps[clampedActiveIndex];
    const progress = this.getTransitionProgress();

    return {
      version: this.version,
      steps: this.steps,
      activeIndex: clampedActiveIndex,
      settledIndex: this.settledIndex,
      activeStep,
      previousStep:
        clampedActiveIndex > 0 ? this.steps[clampedActiveIndex - 1] : null,
      nextStep:
        clampedActiveIndex < lastIndex
          ? this.steps[clampedActiveIndex + 1]
          : null,
      fromStep:
        this.transition !== null ? this.steps[this.transition.from] : null,
      toStep: this.transition !== null ? this.steps[this.transition.to] : null,
      transitionProgress: progress,
      isPlaying: this.isPlaying,
      speed: this.speed,
      canPrev: clampedActiveIndex > 0,
      canNext:
        clampedActiveIndex < lastIndex &&
        !this.lockedSteps.has(clampedActiveIndex + 1),
      queue: [...this.queue],
      lockedStepIndices: [...this.lockedSteps].sort((left, right) => left - right),
      lockedTargetIndex: this.blockedTarget,
      lockReason: this.lockReason,
    };
  }

  play() {
    if (this.steps.length <= 1) {
      return;
    }

    if (this.transition === null && this.settledIndex >= this.steps.length - 1) {
      return;
    }

    if (this.isPlaying && this.frameId !== null) {
      return;
    }

    let changed = false;

    if (!this.isPlaying) {
      changed = true;
    }

    this.isPlaying = true;

    if (!this.transition && this.queue.length === 0) {
      this.queue = this.buildForwardQueue(this.settledIndex);
      changed = this.queue.length > 0 || changed;
    }

    this.ensureFrame();

    if (changed) {
      this.emitChanged();
    }
  }

  pause() {
    const changed = this.stopPlayback();

    if (!changed) {
      return;
    }

    this.emitChanged();
  }

  next() {
    const lastIndex = Math.max(this.steps.length - 1, 0);
    const target = Math.min((this.transition?.to ?? this.settledIndex) + 1, lastIndex);
    const playbackChanged = this.stopPlayback();

    this.startTransition(target, playbackChanged);
  }

  prev() {
    const target = Math.max((this.transition?.to ?? this.settledIndex) - 1, 0);
    const playbackChanged = this.stopPlayback();

    this.startTransition(target, playbackChanged);
  }

  reset() {
    const playbackChanged = this.stopPlayback();
    const changed =
      playbackChanged ||
      this.settledIndex !== 0 ||
      this.blockedTarget !== null ||
      this.transition !== null;

    if (!changed) {
      return;
    }

    this.settledIndex = 0;
    this.blockedTarget = null;
    this.transition = null;
    this.emitChanged();
  }

  setSpeed(speed: TimelineSpeed) {
    if (this.speed === speed) {
      return;
    }

    this.speed = speed;
    this.emitChanged();
  }

  private cancelFrame() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      return true;
    }

    return false;
  }

  private stopPlayback() {
    const hadFrame = this.cancelFrame();
    const changed = this.isPlaying || this.queue.length > 0 || hadFrame;

    this.isPlaying = false;
    this.queue = [];

    return changed;
  }

  private bumpVersion() {
    this.version = createTimelineSnapshotVersion();
  }

  private emitChanged() {
    this.bumpVersion();
    this.emit();
  }

  private buildForwardQueue(fromIndex: number) {
    const queue: number[] = [];

    for (let index = fromIndex + 1; index < this.steps.length; index += 1) {
      queue.push(index);
    }

    return queue;
  }

  private startTransition(targetIndex: number, alreadyChanged = false) {
    if (this.steps.length === 0) {
      if (alreadyChanged) {
        this.emitChanged();
      }

      return;
    }

    const lastIndex = Math.max(this.steps.length - 1, 0);
    const safeTarget = clampIndex(targetIndex, lastIndex);

    if (
      safeTarget !== this.settledIndex &&
      this.lockedSteps.has(safeTarget)
    ) {
      const changed = alreadyChanged || this.blockedTarget !== safeTarget;

      this.blockedTarget = safeTarget;
      this.transition = null;

      if (changed) {
        this.emitChanged();
      }

      return;
    }

    if (safeTarget === this.settledIndex && this.transition === null) {
      if (alreadyChanged) {
        this.emitChanged();
      }

      return;
    }

    if (
      !alreadyChanged &&
      this.transition?.to === safeTarget &&
      this.blockedTarget === null
    ) {
      return;
    }

    this.blockedTarget = null;
    this.transition = {
      from: this.settledIndex,
      to: safeTarget,
      startedAt: performance.now(),
      duration: this.resolveDuration(safeTarget),
    };

    this.ensureFrame();
    this.emitChanged();
  }

  private beginQueuedTransition(targetIndex: number, now: number) {
    if (this.lockedSteps.has(targetIndex)) {
      const changed =
        this.isPlaying ||
        this.queue.length > 0 ||
        this.blockedTarget !== targetIndex ||
        this.transition !== null;

      this.isPlaying = false;
      this.queue = [];
      this.blockedTarget = targetIndex;
      this.transition = null;

      return changed;
    }

    const changed =
      this.blockedTarget !== null ||
      this.transition?.to !== targetIndex ||
      (this.transition !== null && this.transition.from !== this.settledIndex);

    this.blockedTarget = null;
    this.transition = {
      from: this.settledIndex,
      to: targetIndex,
      startedAt: now,
      duration: this.resolveDuration(targetIndex),
    };

    return changed;
  }

  private resolveDuration(targetIndex: number) {
    const baseDuration = this.steps[targetIndex]?.animation.duration ?? 650;
    return Math.max(180, baseDuration / this.speed);
  }

  private getTransitionProgress() {
    if (!this.transition) {
      return 1;
    }

    const elapsed = performance.now() - this.transition.startedAt;
    return Math.min(elapsed / this.transition.duration, 1);
  }

  private ensureFrame() {
    if (this.frameId !== null) {
      return;
    }

    this.frameId = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.frameId = null;

    if (!this.transition) {
      if (this.isPlaying && this.queue.length > 0) {
        const nextIndex = this.queue.shift();

        if (typeof nextIndex === "number") {
          if (this.beginQueuedTransition(nextIndex, now)) {
            this.emitChanged();
          }
        }
      } else if (this.isPlaying && this.settledIndex < this.steps.length - 1) {
        this.queue = this.buildForwardQueue(this.settledIndex);
        this.emitChanged();
      } else {
        if (this.isPlaying) {
          this.isPlaying = false;
          this.emitChanged();
        }
      }
    }

    if (this.transition) {
      const elapsed = now - this.transition.startedAt;
      const progress = Math.min(elapsed / this.transition.duration, 1);

      if (progress >= 1) {
        this.settledIndex = this.transition.to;
        this.transition = null;

        if (this.isPlaying && this.settledIndex >= this.steps.length - 1) {
          this.isPlaying = false;
          this.queue = [];
        }
      }

      this.emitChanged();
    }

    if (this.transition || this.isPlaying) {
      this.ensureFrame();
    }
  };

  private emit() {
    if (this.lastEmittedVersion === this.version) {
      return;
    }

    const snapshot = this.getSnapshot();
    this.lastEmittedVersion = this.version;
    this.subscribers.forEach((subscriber) => subscriber(snapshot));
  }
}
