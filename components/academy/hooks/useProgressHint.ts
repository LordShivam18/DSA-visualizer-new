"use client";

import { useEffect, useRef, useState } from "react";

type ProgressHintState = {
  token: string | null;
  sessionKey: string | null;
};

export function useProgressHint({
  stepIndex,
  enabled,
  resetKey,
  durationMs = 2200,
}: {
  stepIndex: number;
  enabled: boolean;
  resetKey: string;
  durationMs?: number;
}) {
  const shownSessionRef = useRef<string | null>(null);
  const [state, setState] = useState<ProgressHintState>({
    token: null,
    sessionKey: null,
  });

  useEffect(() => {
    shownSessionRef.current =
      state.sessionKey === resetKey ? shownSessionRef.current : null;

    if (
      !enabled ||
      shownSessionRef.current === resetKey ||
      stepIndex < 2 ||
      stepIndex > 3
    ) {
      return;
    }

    shownSessionRef.current = resetKey;
    const token = `${resetKey}:${stepIndex}`;
    const frame = window.requestAnimationFrame(() => {
      setState({
        token,
        sessionKey: resetKey,
      });
    });
    const timeout = window.setTimeout(() => {
      setState((current) =>
        current.token === token
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
  }, [durationMs, enabled, resetKey, state.sessionKey, stepIndex]);

  return state.sessionKey === resetKey ? state.token !== null : false;
}
