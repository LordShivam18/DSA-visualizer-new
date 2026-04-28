import { buildRegistryAudit } from "./problem-registry-utils.mjs";

const rootDir = process.cwd();
const audit = buildRegistryAudit(rootDir);

const failures = [
  ...audit.duplicateProblemIds.map((id) => `Duplicate problem id: ${id}`),
  ...audit.duplicateProblemPaths.map((route) => `Duplicate problem route: ${route}`),
  ...audit.duplicateCategoryIds.map((id) => `Duplicate category id: ${id}`),
  ...audit.missingRegistryRoutes.map(
    (route) => `Problem page missing from registry: ${route}`
  ),
  ...audit.unusedRegistryRoutes.map(
    (route) => `Registry entry has no matching problem page: ${route}`
  ),
  ...audit.missingRouteFiles.map((route) => `Registry route has no page: ${route}`),
  ...audit.undefinedCategories.map(
    (item) => `Problem references unknown category: ${item}`
  ),
  ...audit.emptyCategories.map((id) => `Category has no problems: ${id}`),
  ...audit.missingCategoryDefinitions.map(
    (id) => `App category missing from category registry: ${id}`
  ),
  ...audit.problemIdentityMismatches.map(
    (item) => `Problem id/category/slug mismatch: ${item}`
  ),
  ...audit.problemPathMismatches.map(
    (item) => `Problem path/category/slug mismatch: ${item}`
  ),
  ...audit.categoryPathMismatches.map(
    (item) => `Category id/path mismatch: ${item}`
  ),
];

console.log(`Registry problems: ${audit.problemRegistry.length}`);
console.log(`App problem pages: ${audit.appProblemRoutes.length}`);
console.log(`Registry categories: ${audit.categoryRegistry.length}`);
console.log(`App categories: ${audit.appCategories.length}`);
console.log(`Duplicate problem ids: ${audit.duplicateProblemIds.length}`);
console.log(`Duplicate problem routes: ${audit.duplicateProblemPaths.length}`);
console.log(`Duplicate category ids: ${audit.duplicateCategoryIds.length}`);
console.log(`Missing registry entries: ${audit.missingRegistryRoutes.length}`);
console.log(`Unused registry entries: ${audit.unusedRegistryRoutes.length}`);
console.log(`Missing route files: ${audit.missingRouteFiles.length}`);
console.log(`Undefined problem categories: ${audit.undefinedCategories.length}`);
console.log(`Empty categories: ${audit.emptyCategories.length}`);
console.log(`Missing category definitions: ${audit.missingCategoryDefinitions.length}`);
console.log(`Problem identity mismatches: ${audit.problemIdentityMismatches.length}`);
console.log(`Problem path mismatches: ${audit.problemPathMismatches.length}`);
console.log(`Category path mismatches: ${audit.categoryPathMismatches.length}`);

if (
  audit.problemRegistry.length !== audit.appProblemRoutes.length ||
  audit.categoryRegistry.length !== audit.appCategories.length
) {
  failures.push("Registry totals do not match the app route inventory.");
}

if (failures.length > 0) {
  console.log("\nRegistry validation failures:");
  failures.forEach((failure) => console.log(`- ${failure}`));
  process.exitCode = 1;
}
