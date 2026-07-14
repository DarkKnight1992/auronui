import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Image } from "../index";

// jsdom does not implement IntersectionObserver — install a minimal stub
// that records instances/callbacks so lazy-loading tests can manually
// simulate the element entering the viewport.
let observerInstances: { callback: IntersectionObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = [];

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observerInstances.push(this);
  }
}

function triggerIntersect(isIntersecting: boolean) {
  act(() => {
    const instance = observerInstances[observerInstances.length - 1];
    instance?.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      instance as unknown as IntersectionObserver,
    );
  });
}

describe("Image", () => {
  beforeEach(() => {
    observerInstances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("isLazy=false renders the image immediately without waiting for intersection", () => {
    render(<Image src="/photo.jpg" alt="A photo" isLazy={false} />);
    expect(screen.getByAltText("A photo")).toHaveAttribute("src", "/photo.jpg");
  });

  it("isLazy=true (default) does not render the image until it intersects the viewport", () => {
    render(<Image src="/photo.jpg" alt="A photo" />);
    expect(screen.queryByAltText("A photo")).not.toBeInTheDocument();

    triggerIntersect(true);
    expect(screen.getByAltText("A photo")).toHaveAttribute("src", "/photo.jpg");
  });

  it("stops observing once the image becomes visible", () => {
    render(<Image src="/photo.jpg" alt="A photo" />);
    triggerIntersect(true);
    expect(observerInstances[0]?.disconnect).toHaveBeenCalled();
  });

  it("renders a fallback while the image has not yet loaded", () => {
    const { container } = render(<Image src="/photo.jpg" alt="A photo" isLazy={false} />);
    expect(container.querySelector('[data-slot="image-fallback"]')).toBeInTheDocument();
  });

  it("hides the fallback once the image fires onLoad", async () => {
    const { container } = render(<Image src="/photo.jpg" alt="A photo" isLazy={false} />);
    const img = screen.getByAltText("A photo");
    fireEvent.load(img);
    expect(container.querySelector('[data-slot="image-fallback"]')).not.toBeInTheDocument();
  });

  it("custom fallback content overrides the default icon", () => {
    render(
      <Image src="/photo.jpg" alt="A photo" isLazy={false} fallback={<span>Loading…</span>} />,
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("applies fit and radius classes", () => {
    const { container } = render(<Image src="/photo.jpg" alt="X" fit="contain" radius="full" isLazy={false} />);
    expect(container.querySelector('[data-slot="image"]')).toHaveClass("image--radius-full");
  });

  it("isZoomable=false renders no zoom trigger button", () => {
    const { container } = render(<Image src="/photo.jpg" alt="X" isLazy={false} isZoomable={false} />);
    expect(container.querySelector('[data-slot="image-zoom-trigger"]')).not.toBeInTheDocument();
  });

  it("isZoomable=true renders a zoom trigger button once loaded, with an aria-label", () => {
    const { container } = render(<Image src="/photo.jpg" alt="Sunset" isLazy={false} isZoomable />);
    fireEvent.load(screen.getByAltText("Sunset"));
    const trigger = container.querySelector('[data-slot="image-zoom-trigger"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-label", "Zoom in on Sunset");
  });

  it("clicking the zoom trigger opens the Modal", async () => {
    const { container } = render(<Image src="/photo.jpg" alt="Sunset" isLazy={false} isZoomable />);
    fireEvent.load(screen.getByAltText("Sunset"));
    const trigger = container.querySelector('[data-slot="image-zoom-trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("merges custom className with base classes on the root", () => {
    const { container } = render(<Image src="/photo.jpg" alt="X" className="custom-class" isLazy={false} />);
    const root = container.querySelector('[data-slot="image"]');
    expect(root).toHaveClass("custom-class");
    expect(root).toHaveClass("image");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Image src="/photo.jpg" alt="A mountain landscape" isLazy={false} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
