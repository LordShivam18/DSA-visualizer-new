import fs from "node:fs";
import path from "node:path";
import {
  buildRegistryAudit,
  formatSeed,
  seedForRoute,
} from "./problem-registry-utils.mjs";

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const asJson = args.has("--json");
const audit = buildRegistryAudit(rootDir);
const missingSeeds = audit.missingRegistryRoutes.map((route) =>
  seedForRoute(route, audit.categoryRegistry)
);

function printHumanReport() {
  console.log(`Scanned app problem pages: ${audit.appProblemRoutes.length}`);
  console.log(`Registry problems: ${audit.problemRegistry.length}`);
  console.log(`Missing registry entries: ${audit.missingRegistryRoutes.length}`);
  console.log(`Unused registry entries: ${audit.unusedRegistryRoutes.length}`);

  if (audit.missingRegistryRoutes.length > 0) {
    console.log("\nMissing routes:");
    audit.missingRegistryRoutes.forEach((route) => console.log(`- ${route}`));
  }

  if (audit.unusedRegistryRoutes.length > 0) {
    console.log("\nRegistry entries without matching pages:");
    audit.unusedRegistryRoutes.forEach((route) => console.log(`- ${route}`));
  }

  if (missingSeeds.length > 0) {
    console.log("\nGenerated ProblemSeed entries:");
    missingSeeds.forEach((seed) => console.log(`  ${formatSeed(seed)},`));
  }
}

function writeMissingSeeds() {
  if (missingSeeds.length === 0) {
    return false;
  }

  const registryPath = path.join(rootDir, "lib", "academy", "problemRegistry.ts");
  const source = fs.readFileSync(registryPath, "utf8");
  const marker = "\n];\n\nfunction tagsFromTaxonomy";

  if (!source.includes(marker)) {
    throw new Error("Could not find the problemSeeds array closing marker.");
  }

  const insertion = missingSeeds
    .map((seed) => `  ${formatSeed(seed)},`)
    .join("\n");
  const nextSource = source.replace(marker, `\n${insertion}\n];\n\nfunction tagsFromTaxonomy`);

  fs.writeFileSync(registryPath, nextSource);
  return true;
}

if (asJson) {
  console.log(
    JSON.stringify(
      {
        appProblemRoutes: audit.appProblemRoutes,
        registryRoutes: audit.registryRoutes,
        missingRegistryRoutes: audit.missingRegistryRoutes,
        unusedRegistryRoutes: audit.unusedRegistryRoutes,
        generatedSeeds: missingSeeds,
      },
      null,
      2
    )
  );
} else {
  printHumanReport();
}

if (shouldWrite) {
  const wrote = writeMissingSeeds();

  if (wrote) {
    console.log(
      `\nWrote ${missingSeeds.length} generated entr${
        missingSeeds.length === 1 ? "y" : "ies"
      } to lib/academy/problemRegistry.ts.`
    );
  } else {
    console.log("\nNo missing registry entries to write.");
  }
}

if (!shouldWrite && audit.missingRegistryRoutes.length > 0) {
  process.exitCode = 1;
}
