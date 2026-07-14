import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Surface } from "../Surface";
import { useSurfaceContext } from "../surface.context";

function ContextConsumer() {
  const ctx = useSurfaceContext({ variant: "default" });
  return <div data-testid="ctx-variant">{ctx.variant}</div>;
}

describe("Surface", () => {
  it("renders as <div> by default with base class", () => {
    const { container } = render(<Surface />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveClass("surface", "surface--default");
  });

  it("renders as <section> when as='section'", () => {
    const { container } = render(<Surface as="section" />);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });

  it("applies variant modifier classes", () => {
    const { container } = render(<Surface variant="secondary" />);
    expect(container.firstElementChild).toHaveClass("surface--secondary");
  });

  it("provides SurfaceContext so children can read the current variant", () => {
    const { getByTestId } = render(
      <Surface variant="tertiary">
        <ContextConsumer />
      </Surface>,
    );
    expect(getByTestId("ctx-variant")).toHaveTextContent("tertiary");
  });

  it("merges consumer className prop", () => {
    const { container } = render(<Surface className="my-custom-class" />);
    expect(container.firstElementChild).toHaveClass("surface", "my-custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Surface />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
