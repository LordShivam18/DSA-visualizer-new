import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");

const approvedLessonEntryPoints = [
  "LessonShell",
  "TraceLessonPage",
  "StandardTraceLessonPage",
  "DarkTraceProblemPage",
  "ArrayStringLessonPage",
  "HashmapProblemShell",
  "DPProblemPage",
  "SlidingWindowProblemShell",
];

function hasSymbol(source, symbol) {
  return new RegExp(`\\b${symbol}\\b`).test(source);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(resolved);
    }

    return entry.isFile() ? [resolved] : [];
  });
}

function toAppRelative(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function isProblemPage(relativePath) {
  if (!relativePath.startsWith("app/") || !relativePath.endsWith("/page.tsx")) {
    return false;
  }

  const segments = relativePath.slice(4).split("/");
  return segments.length === 3;
}

const pageFiles = walk(appDir)
  .map(toAppRelative)
  .filter(isProblemPage)
  .sort();

const results = pageFiles.map((relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  const source = fs.readFileSync(absolutePath, "utf8");

  const lessonEntryPoint = approvedLessonEntryPoints.find((entryPoint) =>
    hasSymbol(source, entryPoint)
  );
  const importsGenerateTrace = /from\s+["'][^"']*generateTrace["']/.test(source);

  return {
    page: relativePath,
    usesLessonShell: Boolean(lessonEntryPoint),
    lessonEntryPoint: lessonEntryPoint ?? null,
    importsGenerateTrace,
  };
});

const missingLessonShell = results.filter((item) => !item.usesLessonShell);
const missingTraceImport = results.filter((item) => !item.importsGenerateTrace);

console.log(
  [
    `Problem pages: ${results.length}`,
    `LessonShell compliant: ${results.length - missingLessonShell.length}`,
    `Missing LessonShell entry point: ${missingLessonShell.length}`,
    `Missing generateTrace import: ${missingTraceImport.length}`,
  ].join("\n")
);

if (missingLessonShell.length > 0) {
  console.log("\nPages not routed through LessonShell:");
  missingLessonShell.forEach((item) => console.log(`- ${item.page}`));
}

if (missingTraceImport.length > 0) {
  console.log("\nPages missing a generateTrace import:");
  missingTraceImport.forEach((item) => console.log(`- ${item.page}`));
}

if (missingLessonShell.length > 0 || missingTraceImport.length > 0) {
  process.exitCode = 1;
}
