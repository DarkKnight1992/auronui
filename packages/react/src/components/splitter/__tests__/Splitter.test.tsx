import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { SplitterGroup } from "../SplitterGroup";
import { SplitterPanel } from "../SplitterPanel";
import { SplitterResizeHandle } from "../SplitterResizeHandle";

describe("SplitterGroup", () => {
  it("renders data-slot='splitter-group' on the root", () => {
    render(
      <SplitterGroup>
        <SplitterPanel />
        <SplitterResizeHandle />
        <SplitterPanel />
      </SplitterGroup>,
    );
    expect(document.querySelector('[data-slot="splitter-group"]')).toBeInTheDocument();
  });

  it("direction prop forwards to the descendant handle (horizontal vs vertical class)", () => {
    const { unmount } = render(
      <SplitterGroup direction="horizontal">
        <SplitterPanel />
        <SplitterResizeHandle />
        <SplitterPanel />
      </SplitterGroup>,
    );
    const horizontalHandle = document.querySelector('[data-slot="splitter-handle"]') as HTMLElement;
    expect(horizontalHandle.className).toContain("splitter-handle--horizontal");
    expect(horizontalHandle.className).not.toContain("splitter-handle--vertical");
    unmount();

    render(
      <SplitterGroup direction="vertical">
        <SplitterPanel />
        <SplitterResizeHandle />
        <SplitterPanel />
      </SplitterGroup>,
    );
    const verticalHandle = document.querySelector('[data-slot="splitter-handle"]') as HTMLElement;
    expect(verticalHandle.className).toContain("splitter-handle--vertical");
    expect(verticalHandle.className).not.toContain("splitter-handle--horizontal");
  });

  it("composes SplitterPanel and SplitterResizeHandle children", () => {
    render(
      <SplitterGroup>
        <SplitterPanel id="left" />
        <SplitterResizeHandle />
        <SplitterPanel id="right" />
      </SplitterGroup>,
    );
    expect(document.querySelectorAll('[data-slot="splitter-panel"]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-slot="splitter-handle"]')).toHaveLength(1);
  });

  it("initializes panel sizes from defaultSize, distributing the remainder evenly", () => {
    render(
      <SplitterGroup>
        <SplitterPanel id="left" defaultSize={30} />
        <SplitterResizeHandle />
        <SplitterPanel id="right" />
      </SplitterGroup>,
    );
    const left = document.getElementById("left") as HTMLElement;
    const right = document.getElementById("right") as HTMLElement;
    expect(left.style.flexBasis).toBe("30%");
    expect(right.style.flexBasis).toBe("70%");
  });

  it("keyboard ArrowRight/ArrowLeft on the handle resizes the adjacent panel pair", () => {
    render(
      <SplitterGroup direction="horizontal" keyboardResizeBy={10}>
        <SplitterPanel id="left" defaultSize={50} />
        <SplitterResizeHandle />
        <SplitterPanel id="right" defaultSize={50} />
      </SplitterGroup>,
    );
    const handle = screen.getByRole("separator");
    const left = document.getElementById("left") as HTMLElement;
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(left.style.flexBasis).toBe("60%");
  });

  it("calls onLayout when sizes change via keyboard", () => {
    const onLayout = vi.fn();
    render(
      <SplitterGroup direction="horizontal" keyboardResizeBy={10} onLayout={onLayout}>
        <SplitterPanel defaultSize={50} />
        <SplitterResizeHandle />
        <SplitterPanel defaultSize={50} />
      </SplitterGroup>,
    );
    const handle = screen.getByRole("separator");
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onLayout).toHaveBeenCalledWith([60, 40]);
  });
});

describe("SplitterPanel", () => {
  it("renders data-slot='splitter-panel' on the root", () => {
    render(
      <SplitterGroup>
        <SplitterPanel />
        <SplitterResizeHandle />
        <SplitterPanel />
      </SplitterGroup>,
    );
    expect(document.querySelector('[data-slot="splitter-panel"]')).toBeInTheDocument();
  });
});

describe("SplitterResizeHandle", () => {
  it("deprecated bare disabled prop sets data-disabled on the resize handle", () => {
    render(
      <SplitterGroup>
        <SplitterPanel />
        <SplitterResizeHandle disabled />
        <SplitterPanel />
      </SplitterGroup>,
    );
    const handle = document.querySelector('[data-slot="splitter-handle"]') as HTMLElement;
    expect(handle.getAttribute("data-disabled")).toBe("true");
  });

  it("renders role='separator' with aria-valuenow reflecting the panel size", () => {
    render(
      <SplitterGroup>
        <SplitterPanel defaultSize={30} />
        <SplitterResizeHandle />
        <SplitterPanel defaultSize={70} />
      </SplitterGroup>,
    );
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-valuenow", "30");
  });

  it("default content renders a drag-bar div when no children are given", () => {
    render(
      <SplitterGroup>
        <SplitterPanel />
        <SplitterResizeHandle />
        <SplitterPanel />
      </SplitterGroup>,
    );
    const handle = document.querySelector('[data-slot="splitter-handle"]') as HTMLElement;
    expect(handle.querySelector(".splitter-handle__bar")).toBeInTheDocument();
  });

  it("custom children override the fallback drag-bar div", () => {
    render(
      <SplitterGroup>
        <SplitterPanel />
        <SplitterResizeHandle>
          <span className="custom-handle-content">grip</span>
        </SplitterResizeHandle>
        <SplitterPanel />
      </SplitterGroup>,
    );
    const handle = document.querySelector('[data-slot="splitter-handle"]') as HTMLElement;
    expect(handle.querySelector(".custom-handle-content")).toBeInTheDocument();
    expect(handle.querySelector(".splitter-handle__bar")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SplitterGroup>
        <SplitterPanel defaultSize={50}>left</SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel defaultSize={50}>right</SplitterPanel>
      </SplitterGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
