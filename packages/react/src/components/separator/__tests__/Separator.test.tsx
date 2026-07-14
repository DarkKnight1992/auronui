import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Separator } from "../Separator";

describe("Separator", () => {
  it("renders <hr> when orientation='horizontal' (default) with no label", () => {
    const { container } = render(<Separator />);
    expect(container.querySelector("hr")).toBeInTheDocument();
    expect(container.querySelector("hr")).toHaveClass("separator", "separator--horizontal", "separator--default");
  });

  it("renders <div role='separator'> when orientation='vertical'", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const el = container.querySelector('[role="separator"]');
    expect(el?.tagName).toBe("DIV");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("renders label content between two separator__line divs", () => {
    const { container } = render(<Separator>Label</Separator>);
    expect(container.querySelectorAll(".separator__line")).toHaveLength(2);
    const content = container.querySelector(".separator__content");
    expect(content).toHaveTextContent("Label");
  });

  it("has no accessibility violations for horizontal separator", async () => {
    const { container } = render(<Separator />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for vertical separator", async () => {
    const { container } = render(<Separator orientation="vertical" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
