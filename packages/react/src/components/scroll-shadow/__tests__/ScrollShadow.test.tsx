import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { ScrollShadow } from "../ScrollShadow";

/**
 * jsdom does not perform layout, so scrollTop/scrollHeight/clientHeight are
 * all 0 by default. Each test stubs these geometry properties on the
 * container to simulate a given scroll position, then fires a `scroll`
 * event (mirrors the Vue suite's approach of mocking @vueuse/core's
 * arrivedState directly).
 */
function stubGeometry(
  el: HTMLElement,
  { scrollTop = 0, scrollHeight = 100, clientHeight = 50, scrollLeft = 0, scrollWidth = 100, clientWidth = 50 }: Partial<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    scrollLeft: number;
    scrollWidth: number;
    clientWidth: number;
  }>,
) {
  Object.defineProperty(el, "scrollTop", { value: scrollTop, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
  Object.defineProperty(el, "scrollLeft", { value: scrollLeft, configurable: true });
  Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(el, "clientWidth", { value: clientWidth, configurable: true });
}

describe("ScrollShadow", () => {
  it("renders its children", () => {
    render(
      <ScrollShadow>
        <p>Long content</p>
      </ScrollShadow>,
    );
    expect(screen.getByText("Long content")).toBeInTheDocument();
  });

  it("shows bottom shadow and hides top shadow when at top", () => {
    const { container } = render(
      <ScrollShadow>
        <p>Content</p>
      </ScrollShadow>,
    );
    const el = container.firstElementChild as HTMLElement;
    stubGeometry(el, { scrollTop: 0, scrollHeight: 100, clientHeight: 50 });
    fireEvent.scroll(el);

    expect(el.getAttribute("data-top-scroll")).not.toBe("true");
    expect(el.getAttribute("data-bottom-scroll")).toBe("true");
  });

  it("shows both shadows when scrolled to the middle", () => {
    const { container } = render(
      <ScrollShadow>
        <p>Content</p>
      </ScrollShadow>,
    );
    const el = container.firstElementChild as HTMLElement;
    stubGeometry(el, { scrollTop: 25, scrollHeight: 100, clientHeight: 50 });
    fireEvent.scroll(el);

    expect(el.getAttribute("data-top-scroll")).toBe("true");
    expect(el.getAttribute("data-bottom-scroll")).toBe("true");
  });

  it("shows top shadow and hides bottom shadow when at the bottom", () => {
    const { container } = render(
      <ScrollShadow>
        <p>Content</p>
      </ScrollShadow>,
    );
    const el = container.firstElementChild as HTMLElement;
    stubGeometry(el, { scrollTop: 50, scrollHeight: 100, clientHeight: 50 });
    fireEvent.scroll(el);

    expect(el.getAttribute("data-top-scroll")).toBe("true");
    expect(el.getAttribute("data-bottom-scroll")).not.toBe("true");
  });

  it("tracks left/right scroll state for horizontal orientation", () => {
    const { container } = render(
      <ScrollShadow orientation="horizontal">
        <p>Content</p>
      </ScrollShadow>,
    );
    const el = container.firstElementChild as HTMLElement;
    stubGeometry(el, { scrollLeft: 25, scrollWidth: 100, clientWidth: 50 });
    fireEvent.scroll(el);

    expect(el.getAttribute("data-orientation")).toBe("horizontal");
    expect(el.getAttribute("data-left-scroll")).toBe("true");
    expect(el.getAttribute("data-right-scroll")).toBe("true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ScrollShadow>
        <p>Scrollable content here</p>
      </ScrollShadow>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
