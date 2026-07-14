import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Text } from "../Text";

describe("Text", () => {
  it("renders as <p> by default with default classes", () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("text-base", "text-foreground");
  });

  it("renders as <h1> when as='h1'", () => {
    render(<Text as="h1">Title</Text>);
    expect(screen.getByText("Title").tagName).toBe("H1");
  });

  it("applies size and variant classes", () => {
    render(
      <Text size="lg" variant="danger">
        Warn
      </Text>,
    );
    const el = screen.getByText("Warn");
    expect(el).toHaveClass("text-lg", "text-danger");
  });

  it("merges consumer className prop", () => {
    render(<Text className="custom-class">Text</Text>);
    expect(screen.getByText("Text")).toHaveClass("custom-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Text>Accessible text</Text>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
