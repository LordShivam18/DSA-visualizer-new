"use server";

import { applyStreakUpdate } from "../userProgressStore";

export async function updateStreak(userId: string, activeDate: string) {
  if (!userId || userId.trim().length === 0) {
    throw new Error("updateStreak requires a userId.");
  }

  if (!activeDate || activeDate.trim().length === 0) {
    throw new Error("updateStreak requires an activeDate.");
  }

  return applyStreakUpdate(userId.trim(), activeDate.trim());
}
