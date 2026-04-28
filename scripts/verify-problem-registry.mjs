import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "app");
const originalResolve = Module._resolveFilename;
const require = createRequire(import.meta.url);

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const basePath = path.join(rootDir, request.slice(2));
    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      path.join(basePath, "index.ts"),
      path.join(basePath, "index.tsx"),
    ];
    const match = candidates.find((candidate) => fs.existsSync(candidate));

    if (match) {
      return match;
    }
  }

  return originalResolve.call(this, request, parent, isMain, options);
};

for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = function compileTypeScript(module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText;

    module._compile(output, filename);
  };
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

function toAppRoute(filePath) {
  return `/${path
    .relative(appDir, path.dirname(filePath))
    .split(path.sep)
    .join("/")}`;
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
      return;
    }

    seen.add(value);
  });

  return [...duplicates].sort();
}

const { categoryRegistry, problemRegistry } = require("../lib/academy/problemRegistry.ts");

const appProblemRoutes = walk(appDir)
  .filter((filePath) => filePath.endsWith(`${path.sep}page.tsx`))
  .map(toAppRoute)
  .filter((route) => route.split("/").filter(Boolean).length === 2)
  .sort();

const appCategories = [...new Set(appProblemRoutes.map((route) => route.split("/")[1]))].sort();
const registryRoutes = problemRegistry.map((problem) => problem.path).sort();
const registryCategories = categoryRegistry.map((category) => category.id).sort();
const categoryIds = new Set(registryCategories);

const duplicateProblemIds = duplicateValues(problemRegistry.map((problem) => problem.id));
const duplicateProblemPaths = duplicateValues(problemRegistry.map((problem) => problem.path));
const duplicateCategoryIds = duplicateValues(categoryRegistry.map((category) => category.id));
const missingRouteFiles = registryRoutes.filter(
  (route) => !fs.existsSync(path.join(appDir, ...route.slice(1).split("/"), "page.tsx"))
);
const missingRegistryRoutes = appProblemRoutes.filter(
  (route) => !registryRoutes.includes(route)
);
const undefinedCategories = problemRegistry
  .filter((problem) => !categoryIds.has(problem.category))
  .map((problem) => `${problem.id} -> ${problem.category}`);
const emptyCategories = categoryRegistry
  .filter(
    (category) =>
      !problemRegistry.some((problem) => problem.category === category.id)
  )
  .map((category) => category.id);
const missingCategoryDefinitions = appCategories.filter(
  (category) => !categoryIds.has(category)
);

const failures = [
  ...duplicateProblemIds.map((id) => `Duplicate problem id: ${id}`),
  ...duplicateProblemPaths.map((route) => `Duplicate problem route: ${route}`),
  ...duplicateCategoryIds.map((id) => `Duplicate category id: ${id}`),
  ...missingRouteFiles.map((route) => `Registry route has no page: ${route}`),
  ...missingRegistryRoutes.map((route) => `Problem page missing from registry: ${route}`),
  ...undefinedCategories.map((item) => `Problem references unknown category: ${item}`),
  ...emptyCategories.map((id) => `Category has no problems: ${id}`),
  ...missingCategoryDefinitions.map(
    (id) => `App category missing from category registry: ${id}`
  ),
];

console.log(`Registry problems: ${problemRegistry.length}`);
console.log(`App problem pages: ${appProblemRoutes.length}`);
console.log(`Registry categories: ${categoryRegistry.length}`);
console.log(`App categories: ${appCategories.length}`);
console.log(`Duplicate problem ids: ${duplicateProblemIds.length}`);
console.log(`Duplicate problem routes: ${duplicateProblemPaths.length}`);
console.log(`Duplicate category ids: ${duplicateCategoryIds.length}`);
console.log(`Missing route files: ${missingRouteFiles.length}`);
console.log(`Missing registry routes: ${missingRegistryRoutes.length}`);
console.log(`Undefined problem categories: ${undefinedCategories.length}`);
console.log(`Empty categories: ${emptyCategories.length}`);

if (
  problemRegistry.length !== appProblemRoutes.length ||
  categoryRegistry.length !== appCategories.length
) {
  failures.push("Registry totals do not match the app route inventory.");
}

if (failures.length > 0) {
  console.log("\nRegistry validation failures:");
  failures.forEach((failure) => console.log(`- ${failure}`));
  process.exitCode = 1;
}
