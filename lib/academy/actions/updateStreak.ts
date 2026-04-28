"use server";

import { applyStreakUpdate } from "../userProgressStore";

export async function updateStreak(userId: string) {
  if (!userId || userId.trim().length === 0) {
    throw new Error("updateStreak requires a userId.");
  }

  return applyStreakUpdate(userId.trim());
}
