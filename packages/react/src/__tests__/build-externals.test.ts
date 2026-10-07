import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { isExternal } from "../../vite.external";

// Every runtime/peer dependency must stay external in the library build. A
// bundled dependency lands in dist/ under a relative pnpm-store path
// (`dist/node_modules/.pnpm/@iconify_react@…/`), which Nitro/Next-style
// production tracing does not follow, and @auronui/styles deep imports get
// duplicated into dist/packages/styles.
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf8"));
const deps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];

describe("library build externals", () => {
  it.each(deps)("externalizes %s and its subpaths", (dep) => {
    expect(isExternal(dep)).toBe(true);
    expect(isExternal(`${dep}/some/subpath`)).toBe(true);
  });

  it("bundles local source", () => {
    expect(isExternal("./Button")).toBe(false);
    expect(isExternal("/abs/src/index.ts")).toBe(false);
  });

  it("imports @auronui/styles only through its package root", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) {
          if (entry !== "__tests__") walk(p);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry)) continue;
        if (/from ['"]@auronui\/styles\/[^'"]+['"]/.test(readFileSync(p, "utf8"))) offenders.push(p);
      }
    };
    walk(resolve(__dirname, ".."));
    expect(offenders).toEqual([]);
  });
});
