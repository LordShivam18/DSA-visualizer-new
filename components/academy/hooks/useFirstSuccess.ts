"use client";

import { useEffect, useRef, useState } from "react";

import type { PredictionFeedback } from "@/lib/academy/models";

type SuccessState = {
  token: string | null;
  sessionKey: string | null;
};

export function useFirstSuccess({
  enabled,
  feedback,
  correctCount,
  resetKey,
  durationMs = 2000,
}: {
  enabled: boolean;
  feedback: PredictionFeedback | null;
  correctCount: number;
  resetKey: string;
  durationMs?: number;
}) {
  const lastTriggeredCheckpointRef = useRef<string | null>(null);
  const [state, setState] = useState<SuccessState>({
    token: null,
    sessionKey: null,
  });

  useEffect(() => {
    lastTriggeredCheckpointRef.current = state.sessionKey === resetKey
      ? lastTriggeredCheckpointRef.current
      : null;

    const checkpointId = feedback?.checkpointId ?? null;

    if (
      !enabled ||
      feedback?.correct !== true ||
      correctCount !== 1 ||
      checkpointId === null ||
      checkpointId === lastTriggeredCheckpointRef.current
    ) {
      return;
    }

    lastTriggeredCheckpointRef.current = checkpointId;
    const frame = window.requestAnimationFrame(() => {
      setState({
        token: checkpointId,
        sessionKey: resetKey,
      });
    });
    const timeout = window.setTimeout(() => {
      setState((current) =>
        current.token === checkpointId
          ? {
              token: null,
              sessionKey: current.sessionKey,
            }
          : current
      );
    }, durationMs);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [
    correctCount,
    durationMs,
    enabled,
    feedback,
    resetKey,
    state.sessionKey,
  ]);

  return state.sessionKey === resetKey ? state.token !== null : false;
}
