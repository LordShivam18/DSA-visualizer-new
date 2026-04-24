"use client";

import { useEffect, useRef, useState } from "react";

import {
  TimelineEngine,
  type TimelineSnapshot,
  type TimelineSpeed,
  type TimelineStep,
} from "./TimelineEngine";

export function useTimeline<Step extends TimelineStep>(steps: Step[]) {
  const engineRef = useRef<TimelineEngine<Step> | null>(null);

  if (engineRef.current === null) {
    engineRef.current = new TimelineEngine(steps);
  }

  const [snapshot, setSnapshot] = useState<TimelineSnapshot<Step>>(
    engineRef.current.getSnapshot()
  );

  useEffect(() => {
    const engine = engineRef.current;

    if (!engine) {
      return;
    }

    return engine.subscribe(setSnapshot);
  }, []);

  useEffect(() => {
    engineRef.current?.setSteps(steps);
  }, [steps]);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  return {
    ...snapshot,
    play: () => engineRef.current?.play(),
    pause: () => engineRef.current?.pause(),
    next: () => engineRef.current?.next(),
    prev: () => engineRef.current?.prev(),
    reset: () => engineRef.current?.reset(),
    setSpeed: (speed: TimelineSpeed) => engineRef.current?.setSpeed(speed),
  };
}
