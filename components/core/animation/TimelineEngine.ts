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

export class TimelineEngine<Step extends TimelineStep = TimelineStep> {
  private steps: Step[];
  private settledIndex = 0;
  private isPlaying = false;
  private speed: TimelineSpeed = 1;
  private queue: number[] = [];
  private transition: TransitionState | null = null;
  private subscribers = new Set<Subscriber<Step>>();
  private frameId: number | null = null;

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
    this.pause();
    this.subscribers.clear();
  }

  setSteps(steps: Step[]) {
    this.pause();
    this.steps = steps;
    this.settledIndex = 0;
    this.queue = [];
    this.transition = null;
    this.emit();
  }

  getSnapshot(): TimelineSnapshot<Step> {
    const activeIndex = this.transition?.to ?? this.settledIndex;
    const lastIndex = Math.max(this.steps.length - 1, 0);
    const clampedActiveIndex = clampIndex(activeIndex, lastIndex);
    const activeStep = this.steps[clampedActiveIndex];
    const progress = this.getTransitionProgress();

    return {
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
      canNext: clampedActiveIndex < lastIndex,
      queue: [...this.queue],
    };
  }

  play() {
    if (this.steps.length <= 1) {
      return;
    }

    this.isPlaying = true;

    if (!this.transition && this.queue.length === 0) {
      this.queue = this.buildForwardQueue(this.settledIndex);
    }

    this.ensureFrame();
    this.emit();
  }

  pause() {
    this.isPlaying = false;
    this.queue = [];

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.emit();
  }

  next() {
    const lastIndex = Math.max(this.steps.length - 1, 0);
    const target = Math.min((this.transition?.to ?? this.settledIndex) + 1, lastIndex);

    this.isPlaying = false;
    this.queue = [];
    this.startTransition(target);
  }

  prev() {
    const target = Math.max((this.transition?.to ?? this.settledIndex) - 1, 0);

    this.isPlaying = false;
    this.queue = [];
    this.startTransition(target);
  }

  reset() {
    this.pause();
    this.settledIndex = 0;
    this.transition = null;
    this.emit();
  }

  setSpeed(speed: TimelineSpeed) {
    this.speed = speed;
    this.emit();
  }

  private buildForwardQueue(fromIndex: number) {
    const queue: number[] = [];

    for (let index = fromIndex + 1; index < this.steps.length; index += 1) {
      queue.push(index);
    }

    return queue;
  }

  private startTransition(targetIndex: number) {
    if (this.steps.length === 0) {
      return;
    }

    const lastIndex = Math.max(this.steps.length - 1, 0);
    const safeTarget = clampIndex(targetIndex, lastIndex);

    if (safeTarget === this.settledIndex && this.transition === null) {
      this.emit();
      return;
    }

    this.transition = {
      from: this.settledIndex,
      to: safeTarget,
      startedAt: performance.now(),
      duration: this.resolveDuration(safeTarget),
    };

    this.ensureFrame();
    this.emit();
  }

  private beginQueuedTransition(targetIndex: number, now: number) {
    this.transition = {
      from: this.settledIndex,
      to: targetIndex,
      startedAt: now,
      duration: this.resolveDuration(targetIndex),
    };
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
          this.beginQueuedTransition(nextIndex, now);
          this.emit();
        }
      } else if (this.isPlaying && this.settledIndex < this.steps.length - 1) {
        this.queue = this.buildForwardQueue(this.settledIndex);
      } else {
        this.isPlaying = false;
        this.emit();
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

      this.emit();
    }

    if (this.transition || this.isPlaying) {
      this.ensureFrame();
    }
  };

  private emit() {
    const snapshot = this.getSnapshot();
    this.subscribers.forEach((subscriber) => subscriber(snapshot));
  }
}
