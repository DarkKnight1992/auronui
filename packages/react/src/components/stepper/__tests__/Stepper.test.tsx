import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperContent,
  StepperDescription,
  StepperSeparator,
  StepperTitle,
} from "../index";

describe("Stepper", () => {
  it("shorthand items API renders one StepperItem per item", () => {
    const { container } = render(<Stepper items={[{ title: "One" }, { title: "Two" }, { title: "Three" }]} />);
    expect(container.querySelectorAll('[data-slot="stepper-item"]')).toHaveLength(3);
  });

  it("shorthand items API renders titles and descriptions", () => {
    render(
      <Stepper
        items={[
          { title: "Account", description: "Create your account" },
          { title: "Profile" },
        ]}
      />,
    );
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("shorthand items API renders one fewer separator than items", () => {
    const { container } = render(<Stepper items={[{ title: "One" }, { title: "Two" }, { title: "Three" }]} />);
    expect(container.querySelectorAll('[data-slot="stepper-separator"]')).toHaveLength(2);
  });

  it('root has data-slot="stepper" and aria-label "Step X of Y"', () => {
    const { container } = render(
      <Stepper defaultValue={2} items={[{ title: "One" }, { title: "Two" }, { title: "Three" }]} />,
    );
    const root = container.querySelector('[data-slot="stepper"]');
    expect(root).toHaveAttribute("aria-label", "Step 2 of 3");
  });

  it("compound children API renders equivalent structure to shorthand items API", () => {
    const { container } = render(
      <Stepper defaultValue={1}>
        <StepperItem step={1}>
          <StepperIndicator>1</StepperIndicator>
          <StepperSeparator />
          <StepperContent>
            <StepperTitle>Account</StepperTitle>
            <StepperDescription>Create your account</StepperDescription>
          </StepperContent>
        </StepperItem>
        <StepperItem step={2}>
          <StepperIndicator>2</StepperIndicator>
          <StepperContent>
            <StepperTitle>Profile</StepperTitle>
          </StepperContent>
        </StepperItem>
      </Stepper>,
    );
    expect(container.querySelectorAll('[data-slot="stepper-item"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="stepper-separator"]')).toHaveLength(1);
  });

  it("resolvedTotalSteps derives from items.length when items is provided (ignores totalSteps prop)", () => {
    const { container } = render(<Stepper totalSteps={10} items={[{ title: "One" }, { title: "Two" }]} />);
    expect(container.querySelector('[data-slot="stepper"]')).toHaveAttribute("aria-label", "Step 1 of 2");
  });

  it("controlled value updates data-status on StepperItem", () => {
    const { container, rerender } = render(
      <Stepper value={1} totalSteps={3}>
        <StepperItem step={1} />
        <StepperItem step={2} />
        <StepperItem step={3} />
      </Stepper>,
    );
    const items = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(items[0]).toHaveAttribute("data-status", "current");
    expect(items[1]).toHaveAttribute("data-status", "pending");

    rerender(
      <Stepper value={2} totalSteps={3}>
        <StepperItem step={1} />
        <StepperItem step={2} />
        <StepperItem step={3} />
      </Stepper>,
    );
    const updated = container.querySelectorAll('[data-slot="stepper-item"]');
    expect(updated[0]).toHaveAttribute("data-status", "completed");
    expect(updated[1]).toHaveAttribute("data-status", "current");
  });

  it("orientation prop reaches StepperItem/StepperSeparator via context (vertical)", () => {
    const { container } = render(
      <Stepper orientation="vertical" items={[{ title: "One" }, { title: "Two" }]} />,
    );
    expect(container.querySelector('[data-slot="stepper"]')).toHaveClass("stepper--vertical");
    expect(container.querySelector('[data-slot="stepper-item"]')).toHaveClass("stepper__item--vertical");
    expect(container.querySelector('[data-slot="stepper-separator"]')).toHaveClass("stepper__separator--vertical");
  });

  it("size and color props reach StepperIndicator/StepperTitle via context", () => {
    const { container } = render(<Stepper size="lg" color="danger" items={[{ title: "One" }]} />);
    expect(container.querySelector('[data-slot="stepper-indicator"]')).toHaveClass("stepper__indicator--lg");
    expect(container.querySelector('[data-slot="stepper-title"]')).toHaveClass("stepper__title--lg");
    expect(container.querySelector('[data-slot="stepper-indicator"]')).toHaveClass("stepper__indicator--danger");
  });

  it("mounted standalone without a Stepper ancestor falls back to status pending", () => {
    const { container } = render(<StepperItem step={1} />);
    expect(container.querySelector('[data-slot="stepper-item"]')).toHaveAttribute("data-status", "pending");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Stepper defaultValue={2} items={[{ title: "One" }, { title: "Two", description: "Second step" }]} />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
