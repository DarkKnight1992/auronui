import { beforeAll, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { ScrollArea } from "../ScrollArea";

// jsdom has no layout engine, so it doesn't implement ResizeObserver. Radix's
// ScrollArea uses one internally to track viewport/content size — stub it
// locally (rather than in the shared vitest.setup.ts) so this doesn't affect
// other component suites.
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

describe("ScrollArea", () => {
  it("renders the viewport with children", () => {
    const { container } = render(
      <ScrollArea>
        <p>scrollable content</p>
      </ScrollArea>,
    );
    const viewport = container.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport).not.toBeNull();
    expect(viewport?.textContent).toContain("scrollable content");
  });

  it("orientation='vertical' (default) renders exactly one vertical scrollbar", () => {
    // type="always" forces the scrollbar to render unconditionally — Radix's
    // default type="hover" gates the scrollbar behind pointer-enter/leave +
    // ResizeObserver-driven visibility state that never fires in jsdom.
    const { container } = render(
      <ScrollArea type="always">content</ScrollArea>,
    );
    const scrollbars = container.querySelectorAll("[data-orientation]");
    expect(scrollbars).toHaveLength(1);
    expect(scrollbars[0].getAttribute("data-orientation")).toBe("vertical");
    expect(scrollbars[0].className).toContain("scroll-area__scrollbar--vertical");
  });

  it("orientation='horizontal' renders exactly one horizontal scrollbar", () => {
    const { container } = render(
      <ScrollArea type="always" orientation="horizontal">
        content
      </ScrollArea>,
    );
    const scrollbars = container.querySelectorAll("[data-orientation]");
    expect(scrollbars).toHaveLength(1);
    expect(scrollbars[0].getAttribute("data-orientation")).toBe("horizontal");
    expect(scrollbars[0].className).toContain("scroll-area__scrollbar--horizontal");
  });

  it("orientation='both' renders both scrollbars", () => {
    const { container } = render(
      <ScrollArea type="always" orientation="both">
        content
      </ScrollArea>,
    );
    const scrollbars = container.querySelectorAll("[data-orientation]");
    expect(scrollbars).toHaveLength(2);
    expect(Array.from(scrollbars).map((s) => s.getAttribute("data-orientation")).sort()).toEqual([
      "horizontal",
      "vertical",
    ]);
  });

  it("applies className to the root element", () => {
    const { container } = render(<ScrollArea className="my-root-class">content</ScrollArea>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("scroll-area__root");
    expect(root.className).toContain("my-root-class");
  });

  it("applies viewportClassName to the viewport element", () => {
    const { container } = render(<ScrollArea viewportClassName="my-viewport-class">content</ScrollArea>);
    const viewport = container.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport?.className).toContain("scroll-area__viewport");
    expect(viewport?.className).toContain("my-viewport-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ScrollArea type="always">
        <p>content</p>
      </ScrollArea>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
