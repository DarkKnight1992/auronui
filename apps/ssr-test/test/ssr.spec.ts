import { describe, it, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("SSR Smoke Test", async () => {
  await setup({
    rootDir: new URL("..", import.meta.url).pathname,
    server: true,
    browser: false,
  });

  it("renders SmokeTest component server-side without errors", async () => {
    const html = await $fetch("/");
    // Server renders the "not yet hydrated" state
    expect(html).toContain("Server: not yet hydrated");
    // Component root element exists
    expect(html).toContain('data-testid="smoke-test"');
    // data-hydrated attribute is absent on server (dataAttr(false) returns undefined)
    expect(html).not.toContain('data-hydrated="true"');
  });

  it("does not throw during SSR rendering", async () => {
    // $fetch would throw on server error; if we reach here, SSR succeeded
    await expect($fetch("/")).resolves.toBeTruthy();
  });
});
