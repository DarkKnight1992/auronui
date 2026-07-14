import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Kbd } from "../Kbd";

describe("Kbd", () => {
  it("renders a <kbd> element with base class", () => {
    render(<Kbd>Ctrl</Kbd>);
    const el = screen.getByText("Ctrl").closest("kbd");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("kbd");
  });

  it("applies the 'kbd--light' modifier class", () => {
    render(<Kbd variant="light">Esc</Kbd>);
    expect(screen.getByText("Esc").closest("kbd")).toHaveClass("kbd--light");
  });

  it("renders abbr content when provided", () => {
    const { container } = render(<Kbd abbr="Control">Ctrl</Kbd>);
    const abbrEl = container.querySelector(".kbd__abbr");
    expect(abbrEl).toBeInTheDocument();
    expect(abbrEl).toHaveTextContent("Control");
  });

  it("does not render abbr element when abbr prop is omitted", () => {
    const { container } = render(<Kbd>Ctrl</Kbd>);
    expect(container.querySelector(".kbd__abbr")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Kbd>Ctrl</Kbd>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
