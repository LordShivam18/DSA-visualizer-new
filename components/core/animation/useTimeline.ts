"use client";

import { useEffect, useState } from "react";

import {
  TimelineEngine,
  type TimelineSnapshot,
  type TimelineSpeed,
  type TimelineStep,
} from "./TimelineEngine";

export function useTimeline<Step extends TimelineStep>(steps: Step[]) {
  const [engine] = useState(() => new TimelineEngine(steps));
  const [snapshot, setSnapshot] = useState<TimelineSnapshot<Step>>(() =>
    engine.getSnapshot()
  );

  useEffect(() => {
    return engine.subscribe(setSnapshot);
  }, [engine]);

  useEffect(() => {
    engine.setSteps(steps);
  }, [engine, steps]);

  useEffect(() => {
    return () => {
      engine.destroy();
    };
  }, [engine]);

  return {
    ...snapshot,
    play: () => engine.play(),
    pause: () => engine.pause(),
    next: () => engine.next(),
    prev: () => engine.prev(),
    reset: () => engine.reset(),
    setSpeed: (speed: TimelineSpeed) => engine.setSpeed(speed),
  };
}
