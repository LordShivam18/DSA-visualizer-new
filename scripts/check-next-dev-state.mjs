import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const nextDirectory = path.join(projectRoot, ".next");
const lockCandidates = [
  path.join(nextDirectory, "dev", "lock"),
  path.join(nextDirectory, "lock"),
];

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

const discoveredLocks = lockCandidates.filter((candidate) => existsSync(candidate));

if (discoveredLocks.length === 0) {
  process.exit(0);
}

if (hasActiveNextDevProcess()) {
  console.log(
    "[dev:doctor] Next.js lock files exist, but an active Next process was detected. Reuse the running dev server or stop it before resetting."
  );
  process.exit(0);
}

console.error("[dev:doctor] Stale Next.js dev lock detected.");
discoveredLocks.forEach((lockFile) => {
  console.error(`  - ${path.relative(projectRoot, lockFile)}`);
});
console.error('Run "npm run dev:reset" to remove the stale .next state safely.');
process.exit(1);
