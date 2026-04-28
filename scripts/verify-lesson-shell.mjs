import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");
const componentsDir = path.join(rootDir, "components");

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

const bannedLegacyShellSymbols = ["AcademyLessonShell"];
const bannedPageTimelineSymbols = ["useTimeline"];
const bannedPageTraceProps = ["buildTrace="];

function hasSymbol(source, symbol) {
  return new RegExp(`\\b${symbol}\\b`).test(source);
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

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
const missingGenerateTraceProp = results.filter((item) => {
  const absolutePath = path.join(rootDir, item.page);
  const source = fs.readFileSync(absolutePath, "utf8");

  return !/\bgenerateTrace\s*=/.test(source);
});

const legacyTracePropPages = pageFiles.filter((relativePath) => {
  const source = fs.readFileSync(path.join(rootDir, relativePath), "utf8");

  return bannedPageTraceProps.some((prop) => source.includes(prop));
});

const manualTimelinePages = pageFiles.filter((relativePath) => {
  const source = fs.readFileSync(path.join(rootDir, relativePath), "utf8");

  return bannedPageTimelineSymbols.some((symbol) => hasSymbol(source, symbol));
});

const sourceFiles = [appDir, componentsDir]
  .flatMap(walk)
  .filter((filePath) => /\.(tsx?|jsx?)$/.test(filePath));

const legacyShellReferences = sourceFiles
  .map((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    const symbols = bannedLegacyShellSymbols.filter((symbol) =>
      hasSymbol(source, symbol)
    );

    return symbols.length > 0
      ? {
          file: toAppRelative(filePath),
          symbols,
        }
      : null;
  })
  .filter(Boolean);

console.log(
  [
    `Problem pages: ${results.length}`,
    `LessonShell compliant: ${results.length - missingLessonShell.length}`,
    `Missing LessonShell entry point: ${missingLessonShell.length}`,
    `Missing generateTrace import: ${missingTraceImport.length}`,
    `Missing generateTrace prop: ${missingGenerateTraceProp.length}`,
    `Legacy buildTrace page props: ${legacyTracePropPages.length}`,
    `Manual timeline usage in pages: ${manualTimelinePages.length}`,
    `Legacy shell references: ${legacyShellReferences.length}`,
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

if (missingGenerateTraceProp.length > 0) {
  console.log("\nPages missing a generateTrace prop:");
  missingGenerateTraceProp.forEach((item) => console.log(`- ${item.page}`));
}

if (legacyTracePropPages.length > 0) {
  console.log("\nPages still using legacy buildTrace props:");
  legacyTracePropPages.forEach((page) => console.log(`- ${page}`));
}

if (manualTimelinePages.length > 0) {
  console.log("\nPages wiring the timeline manually:");
  manualTimelinePages.forEach((page) => console.log(`- ${page}`));
}

if (legacyShellReferences.length > 0) {
  console.log("\nLegacy shell references:");
  legacyShellReferences.forEach((item) =>
    console.log(`- ${item.file}: ${item.symbols.join(", ")}`)
  );
}

if (
  missingLessonShell.length > 0 ||
  missingTraceImport.length > 0 ||
  missingGenerateTraceProp.length > 0 ||
  legacyTracePropPages.length > 0 ||
  manualTimelinePages.length > 0 ||
  legacyShellReferences.length > 0
) {
  process.exitCode = 1;
}
