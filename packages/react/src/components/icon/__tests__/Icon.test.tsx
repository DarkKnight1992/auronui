import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Icon } from "../index";

describe("Icon", () => {
  it("re-exports @iconify/react's Icon component and renders an svg-like element", () => {
    const { container } = render(<Icon icon="mdi:home" aria-hidden="true" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("has no accessibility violations when marked decorative", async () => {
    const { container } = render(<Icon icon="mdi:home" aria-hidden="true" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
