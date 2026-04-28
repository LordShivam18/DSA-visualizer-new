"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  TimelineEngine,
  type TimelineSnapshot,
  type TimelineSpeed,
  type TimelineStep,
} from "./TimelineEngine";

export function useTimeline<Step extends TimelineStep>(steps: Step[]) {
  const engine = useMemo(() => new TimelineEngine<Step>(steps), [steps]);
  const [snapshot, setSnapshot] = useState<TimelineSnapshot<Step>>(() =>
    engine.getSnapshot()
  );
  const commitSnapshot = useCallback((nextSnapshot: TimelineSnapshot<Step>) => {
    setSnapshot((currentSnapshot) =>
      currentSnapshot.version === nextSnapshot.version
        ? currentSnapshot
        : nextSnapshot
    );
  }, []);

  useEffect(() => {
    const unsubscribe = engine.subscribe(commitSnapshot);

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [commitSnapshot, engine]);

  const controls = useMemo(
    () => ({
      play: () => engine.play(),
      pause: () => engine.pause(),
      next: () => engine.next(),
      prev: () => engine.prev(),
      reset: () => engine.reset(),
      setSpeed: (speed: TimelineSpeed) => engine.setSpeed(speed),
      setLockedSteps: (indices: number[], reason?: string) =>
        engine.setLockedSteps(indices, reason),
    }),
    [engine]
  );
  const renderSnapshot = snapshot.steps === steps ? snapshot : engine.getSnapshot();

  return {
    ...renderSnapshot,
    ...controls,
  };
}
