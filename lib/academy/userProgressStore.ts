import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { UserProgress } from "./models";
import { resolveStreakUpdate, toUtcDateKey } from "./streak";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const USER_PROGRESS_FILE = path.join(DATA_DIRECTORY, "academy-user-progress.json");

type UserProgressRecord = Record<string, UserProgress>;

async function ensureDataDirectory() {
  await mkdir(DATA_DIRECTORY, { recursive: true });
}

async function readUserProgressRecord() {
  try {
    const raw = await readFile(USER_PROGRESS_FILE, "utf8");
    return JSON.parse(raw) as UserProgressRecord;
  } catch {
    return {};
  }
}

async function writeUserProgressRecord(record: UserProgressRecord) {
  await ensureDataDirectory();
  const tempFile = `${USER_PROGRESS_FILE}.tmp`;
  await writeFile(tempFile, JSON.stringify(record, null, 2), "utf8");
  await rename(tempFile, USER_PROGRESS_FILE);
}

export async function readUserProgress(userId: string) {
  const progressRecord = await readUserProgressRecord();
  return (
    progressRecord[userId] ?? {
      userId,
      lastActiveDate: null,
      streak: 0,
      totalSolved: 0,
    }
  );
}

export async function applyStreakUpdate(userId: string) {
  const progressRecord = await readUserProgressRecord();
  const current =
    progressRecord[userId] ?? {
      userId,
      lastActiveDate: null,
      streak: 0,
      totalSolved: 0,
    };
  const today = toUtcDateKey(new Date());
  const streakChange = resolveStreakUpdate(current.lastActiveDate, today);
  const nextProgress: UserProgress = {
    ...current,
    lastActiveDate: today,
    streak:
      streakChange === "start"
        ? 1
        : streakChange === "increment"
        ? current.streak + 1
        : streakChange === "reset"
        ? 1
        : current.streak,
    totalSolved: current.totalSolved + 1,
  };

  progressRecord[userId] = nextProgress;
  await writeUserProgressRecord(progressRecord);

  return nextProgress;
}
