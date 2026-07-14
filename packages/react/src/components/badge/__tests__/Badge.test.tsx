import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders a root div with class 'badge-anchor' and a child span with class 'badge'", () => {
    const { container } = render(<Badge />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveClass("badge-anchor");
    const badgeSpan = container.querySelector(".badge");
    expect(badgeSpan).toBeInTheDocument();
    expect(badgeSpan?.tagName).toBe("SPAN");
  });

  it("applies default modifier classes", () => {
    const { container } = render(<Badge />);
    const badgeSpan = container.querySelector(".badge");
    expect(badgeSpan).toHaveClass("badge--default", "badge--md", "badge--primary", "badge--top-right");
  });

  it("applies color/size/variant/placement overrides", () => {
    const { container } = render(
      <Badge color="accent" size="sm" variant="secondary" placement="bottom-left" />,
    );
    const badgeSpan = container.querySelector(".badge");
    expect(badgeSpan).toHaveClass("badge--accent", "badge--sm", "badge--secondary", "badge--bottom-left");
  });

  it("renders children (anchored element) and label content", () => {
    const { container, getByRole, getByText } = render(
      <Badge label="5">
        <button aria-label="Profile">Profile</button>
      </Badge>,
    );
    expect(getByRole("button")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();
    expect(container.querySelector(".badge__label")).toHaveTextContent("5");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Badge label="3">
        <button aria-label="Profile">Profile</button>
      </Badge>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
