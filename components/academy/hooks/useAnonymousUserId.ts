"use client";

import { useState } from "react";

import { getAnonymousUserId } from "@/lib/academy/localProgressStore";

export function useAnonymousUserId() {
  const [userId] = useState<string | null>(() => getAnonymousUserId());
  return userId;
}
