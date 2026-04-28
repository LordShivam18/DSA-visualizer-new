import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const nextDirectory = path.join(projectRoot, ".next");

function readProcessTable() {
  try {
    if (process.platform === "win32") {
      return execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-Command",
          "Get-CimInstance Win32_Process | Select-Object -ExpandProperty CommandLine",
        ],
        { encoding: "utf8" }
      );
    }

    return execFileSync("ps", ["-A", "-o", "command="], {
      encoding: "utf8",
    });
  } catch {
    return "";
  }
}

function hasActiveNextDevProcess() {
  const processTable = readProcessTable().toLowerCase();
  return (
    processTable.includes("next dev") ||
    processTable.includes("next-server") ||
    processTable.includes("next/dist/bin/next")
  );
}

if (!existsSync(nextDirectory)) {
  console.log("[dev:reset] No .next directory found. Nothing to reset.");
  process.exit(0);
}

if (hasActiveNextDevProcess()) {
  console.error(
    "[dev:reset] Refusing to delete .next while a Next.js process appears to be running. Stop the dev server first."
  );
  process.exit(1);
}

await rm(nextDirectory, { recursive: true, force: true });
console.log("[dev:reset] Removed .next safely. You can retry `npm run dev` now.");
