import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const originalResolve = Module._resolveFilename;
let typeScriptRegistered = false;

export function registerTypeScriptRuntime(rootDir) {
  if (!typeScriptRegistered) {
    Module._resolveFilename = function resolveAlias(
      request,
      parent,
      isMain,
      options
    ) {
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

    typeScriptRegistered = true;
  }
}

export function walk(dir) {
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

export function toAppRoute(appDir, filePath) {
  return `/${path
    .relative(appDir, path.dirname(filePath))
    .split(path.sep)
    .join("/")}`;
}

export function getAppProblemRoutes(rootDir) {
  const appDir = path.join(rootDir, "app");

  return walk(appDir)
    .filter((filePath) => filePath.endsWith(`${path.sep}page.tsx`))
    .map((filePath) => toAppRoute(appDir, filePath))
    .filter((route) => route.split("/").filter(Boolean).length === 2)
    .sort();
}

export function duplicateValues(values) {
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

export function loadProblemRegistry(rootDir) {
  registerTypeScriptRuntime(rootDir);

  const require = createRequire(import.meta.url);

  return require(path.join(rootDir, "lib", "academy", "problemRegistry.ts"));
}

export function buildRegistryAudit(rootDir) {
  const appDir = path.join(rootDir, "app");
  const { categoryRegistry, problemRegistry } = loadProblemRegistry(rootDir);
  const appProblemRoutes = getAppProblemRoutes(rootDir);
  const appCategories = [
    ...new Set(appProblemRoutes.map((route) => route.split("/")[1])),
  ].sort();
  const registryRoutes = problemRegistry.map((problem) => problem.path).sort();
  const registryCategories = categoryRegistry.map((category) => category.id).sort();
  const categoryIds = new Set(registryCategories);
  const registryRouteSet = new Set(registryRoutes);
  const appRouteSet = new Set(appProblemRoutes);
  const duplicateProblemIds = duplicateValues(
    problemRegistry.map((problem) => problem.id)
  );
  const duplicateProblemPaths = duplicateValues(
    problemRegistry.map((problem) => problem.path)
  );
  const duplicateCategoryIds = duplicateValues(
    categoryRegistry.map((category) => category.id)
  );
  const unusedRegistryRoutes = registryRoutes.filter(
    (route) => !appRouteSet.has(route)
  );
  const missingRegistryRoutes = appProblemRoutes.filter(
    (route) => !registryRouteSet.has(route)
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
  const problemIdentityMismatches = problemRegistry
    .filter((problem) => problem.id !== `${problem.category}:${problem.slug}`)
    .map(
      (problem) =>
        `${problem.id} should be ${problem.category}:${problem.slug}`
    );
  const problemPathMismatches = problemRegistry
    .filter((problem) => problem.path !== `/${problem.category}/${problem.slug}`)
    .map(
      (problem) =>
        `${problem.id} path ${problem.path} should be /${problem.category}/${problem.slug}`
    );
  const categoryPathMismatches = categoryRegistry
    .filter((category) => category.path !== `/${category.id}`)
    .map(
      (category) => `${category.id} path ${category.path} should be /${category.id}`
    );
  const missingRouteFiles = registryRoutes.filter(
    (route) => !fs.existsSync(path.join(appDir, ...route.slice(1).split("/"), "page.tsx"))
  );

  return {
    appProblemRoutes,
    appCategories,
    registryRoutes,
    registryCategories,
    categoryRegistry,
    problemRegistry,
    duplicateProblemIds,
    duplicateProblemPaths,
    duplicateCategoryIds,
    unusedRegistryRoutes,
    missingRegistryRoutes,
    undefinedCategories,
    emptyCategories,
    missingCategoryDefinitions,
    problemIdentityMismatches,
    problemPathMismatches,
    categoryPathMismatches,
    missingRouteFiles,
  };
}

export function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (/^[ivxlcdm]+$/i.test(part)) {
        return part.toUpperCase();
      }

      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");
}

export function seedForRoute(route, categoryRegistry) {
  const [, categoryId, slug] = route.split("/");
  const category = categoryRegistry.find((item) => item.id === categoryId);
  const title = titleFromSlug(slug);

  return {
    category: categoryId,
    slug,
    title,
    difficulty: "medium",
    description: `Trace the ${title} algorithm from parsed input through each decision point.`,
    taxonomy: `${category?.label ?? titleFromSlug(categoryId)} / Trace-driven lesson`,
  };
}

export function formatSeed(seed) {
  return `{ category: "${seed.category}", slug: "${seed.slug}", title: "${seed.title}", difficulty: "${seed.difficulty}", description: "${seed.description}", taxonomy: "${seed.taxonomy}" }`;
}
