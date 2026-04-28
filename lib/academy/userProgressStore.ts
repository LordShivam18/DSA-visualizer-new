import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { UserProgress } from "./models";
import { getLocalDate, resolveStreakUpdate } from "./streak";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const USER_PROGRESS_FILE = path.join(DATA_DIRECTORY, "academy-user-progress.json");

type UserProgressRecord = Record<string, UserProgress>;

let writeQueue = Promise.resolve();

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
  const tempFile = `${USER_PROGRESS_FILE}.${process.pid}.${Date.now().toString(
    36
  )}.${Math.random().toString(36).slice(2, 8)}.tmp`;

  try {
    await writeFile(tempFile, JSON.stringify(record, null, 2), {
      encoding: "utf8",
      flag: "w",
    });
    await rename(tempFile, USER_PROGRESS_FILE);
  } catch (error) {
    await rm(tempFile, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function withWriteLock<T>(operation: () => Promise<T>) {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
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

export async function applyStreakUpdate(userId: string, activeDate: string) {
  return withWriteLock(async () => {
    const progressRecord = await readUserProgressRecord();
    const current =
      progressRecord[userId] ?? {
        userId,
        lastActiveDate: null,
        streak: 0,
        totalSolved: 0,
      };
    const nextActiveDate = getLocalDate(activeDate);
    const streakChange = resolveStreakUpdate(
      current.lastActiveDate,
      nextActiveDate
    );
    const nextProgress: UserProgress = {
      ...current,
      lastActiveDate: nextActiveDate,
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
  });
}
