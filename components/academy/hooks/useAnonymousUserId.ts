"use client";

import { useState } from "react";

const USER_ID_STORAGE_KEY = "guided-dsa:anonymous-user-id:v1";

function createAnonymousUserId() {
  if (typeof window !== "undefined" && "randomUUID" in window.crypto) {
    return `guest-${window.crypto.randomUUID()}`;
  }

  return `guest-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function readAnonymousUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existingUserId = window.localStorage.getItem(USER_ID_STORAGE_KEY);

    if (existingUserId) {
      return existingUserId;
    }

    const nextUserId = createAnonymousUserId();
    window.localStorage.setItem(USER_ID_STORAGE_KEY, nextUserId);
    return nextUserId;
  } catch {
    return createAnonymousUserId();
  }
}

export function useAnonymousUserId() {
  const [userId] = useState<string | null>(() => readAnonymousUserId());
  return userId;
}
