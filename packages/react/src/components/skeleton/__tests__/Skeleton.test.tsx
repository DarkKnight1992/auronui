import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Skeleton } from "../Skeleton";

describe("Skeleton", () => {
  it("renders a div with aria-hidden and default shimmer class", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveClass("skeleton", "skeleton--shimmer");
  });

  it("applies animationType='pulse'/'none' classes", () => {
    const { container: pulseContainer } = render(<Skeleton animationType="pulse" />);
    expect(pulseContainer.firstElementChild).toHaveClass("skeleton--pulse");

    const { container: noneContainer } = render(<Skeleton animationType="none" />);
    expect(noneContainer.firstElementChild).toHaveClass("skeleton--none");
  });

  it("renders children content", () => {
    const { getByText } = render(
      <Skeleton>
        <span>Content</span>
      </Skeleton>,
    );
    expect(getByText("Content")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Skeleton />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
