import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// The theme's light/dark token blocks used to need (0,5,0) selectors to beat
// each other (`:root:not(.light):not([data-theme="light"])…`), so an app
// re-theming the dark palette had to copy that selector to win. Every token
// block is wrapped in `:where()` — zero specificity — and ordered light → dark
// media → explicit dark, so source order alone decides between them and any
// app selector (even a bare `.dark`) overrides a token.
const css = readFileSync(resolve(__dirname, "../../themes/default/variables.css"), "utf8");

function selectorBlocks(source: string): string[] {
  // Selector text before each "{" that opens a declaration block (skip at-rules).
  return [...source.matchAll(/([^{};]+)\{/g)]
    .map((m) => (m[1] ?? "").replace(/\/\*[\s\S]*?\*\//g, "").trim())
    .filter((sel) => sel && !sel.startsWith("@"));
}

describe("default theme token selectors", () => {
  it("are all zero-specificity (:where)", () => {
    const offenders = selectorBlocks(css).filter((sel) => !/^:where\([\s\S]*\)$/.test(sel));
    expect(offenders).toEqual([]);
  });
});
