import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { AspectRatio } from "../AspectRatio";

describe("AspectRatio", () => {
  it("applies the given ratio as inline style", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="box">
        <img src="test.png" alt="test" />
      </AspectRatio>,
    );
    const box = screen.getByTestId("box");
    expect(box.style.aspectRatio).toBe(String(16 / 9));
  });

  it("renders children", () => {
    render(
      <AspectRatio>
        <span>content</span>
      </AspectRatio>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AspectRatio>
        <img src="test.png" alt="A test image" />
      </AspectRatio>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
