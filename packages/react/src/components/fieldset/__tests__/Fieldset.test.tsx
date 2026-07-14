import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Fieldset } from "../Fieldset";

describe("Fieldset", () => {
  it("renders as a <fieldset> element with base class", () => {
    const { container } = render(<Fieldset />);
    expect(container.firstElementChild?.tagName).toBe("FIELDSET");
    expect(container.firstElementChild).toHaveClass("fieldset");
  });

  it("renders <legend> when legend prop is provided", () => {
    render(<Fieldset legend="Contact Details" />);
    const legend = screen.getByText("Contact Details");
    expect(legend.tagName).toBe("LEGEND");
    expect(legend).toHaveClass("fieldset__legend");
  });

  it("does not render <legend> when legend prop is omitted", () => {
    const { container } = render(<Fieldset />);
    expect(container.querySelector("legend")).not.toBeInTheDocument();
  });

  it("sets disabled attribute when isDisabled=true", () => {
    const { container } = render(<Fieldset isDisabled />);
    expect((container.firstElementChild as HTMLFieldSetElement).disabled).toBe(true);
  });

  it("does not set disabled attribute by default", () => {
    const { container } = render(<Fieldset />);
    expect((container.firstElementChild as HTMLFieldSetElement).disabled).toBe(false);
  });

  it("renders children", () => {
    render(
      <Fieldset>
        <input type="text" aria-label="Name" />
      </Fieldset>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Fieldset legend="Personal Information">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </Fieldset>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
