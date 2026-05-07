import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const distDir = new URL("./dist/assets", import.meta.url).pathname;

// Get all JS files in dist/assets
const jsFiles = readdirSync(distDir).filter((f) => f.endsWith(".js"));

if (jsFiles.length === 0) {
  console.error("ERROR: No JS files found in dist/assets/");
  process.exit(1);
}

const bundleContent = jsFiles
  .map((f) => readFileSync(join(distDir, f), "utf-8"))
  .join("\n");

// These identifiers must NOT appear in the bundle if tree-shaking works correctly
const EXCLUDED_IDENTIFIERS = [
  "useListData",
  "useOverlayState",
  "useIsMounted",
  "useMeasuredHeight",
  "composeClassName",
  "createContext",
];

const found = EXCLUDED_IDENTIFIERS.filter((id) => bundleContent.includes(id));

if (found.length > 0) {
  console.error("TREE-SHAKING FAILURE: Bundle contains excluded identifiers:");
  found.forEach((id) => console.error(`  - ${id}`));
  console.error(
    "This means sideEffects:false is not working or rollup is not tree-shaking correctly.",
  );
  process.exit(1);
}

console.log("Tree-shaking check PASSED:");
console.log(`  Bundle files: ${jsFiles.join(", ")}`);
console.log(
  `  Excluded identifiers not found: ${EXCLUDED_IDENTIFIERS.join(", ")}`,
);
process.exit(0);
