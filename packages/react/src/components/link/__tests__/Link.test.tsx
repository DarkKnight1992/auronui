import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Link } from "../Link";

describe("Link", () => {
  it("renders as <a> element by default with base class", () => {
    render(<Link href="#">Click</Link>);
    const el = screen.getByText("Click");
    expect(el.tagName).toBe("A");
    expect(el).toHaveClass("link");
  });

  it("isExternal=false: no target, no rel, no svg glyph", () => {
    render(
      <Link href="https://example.com" isExternal={false}>
        Example
      </Link>,
    );
    const el = screen.getByText("Example");
    expect(el).not.toHaveAttribute("target");
    expect(el).not.toHaveAttribute("rel");
    expect(el.querySelector("svg")).not.toBeInTheDocument();
  });

  it("isExternal=true: sets target/rel and renders svg glyph", () => {
    render(
      <Link href="https://example.com" isExternal>
        External
      </Link>,
    );
    const el = screen.getByText("External", { exact: false });
    expect(el.closest("a")).toHaveAttribute("target", "_blank");
    expect(el.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
    expect(el.closest("a")?.querySelector("svg")).toBeInTheDocument();
  });

  it("polymorphic as='button': renders as <button>", () => {
    render(<Link as="button">Click</Link>);
    expect(screen.getByText("Click").tagName).toBe("BUTTON");
  });

  it("applies color variant class", () => {
    render(
      <Link href="#" color="secondary">
        Click
      </Link>,
    );
    expect(screen.getByText("Click")).toHaveClass("link--color-secondary");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Link href="#">Accessible link</Link>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
