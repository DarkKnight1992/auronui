import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Timeline, TimelineItem } from "../index";

describe("Timeline", () => {
  it('renders role="list" on the root and role="listitem" on each item', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="A" />
        <TimelineItem title="B" />
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline"]')).toHaveAttribute("role", "list");
    expect(container.querySelectorAll('[data-slot="timeline-item"]')).toHaveLength(2);
    expect(container.querySelectorAll('[role="listitem"]')).toHaveLength(2);
  });

  it("renders title, description, and timestamp when provided", () => {
    const { container } = render(
      <TimelineItem title="Order placed" description="Confirmed via email" timestamp="Jan 3" />,
    );
    expect(container.querySelector('[data-slot="timeline-title"]')?.textContent).toBe("Order placed");
    expect(container.querySelector('[data-slot="timeline-description"]')?.textContent).toBe(
      "Confirmed via email",
    );
    expect(container.querySelector('[data-slot="timeline-timestamp"]')?.textContent).toBe("Jan 3");
  });

  it("renders none of title/description/timestamp spans when not provided", () => {
    const { container } = render(<TimelineItem />);
    expect(container.querySelector('[data-slot="timeline-title"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-description"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-timestamp"]')).not.toBeInTheDocument();
  });

  it("children override the title/description/timestamp props", () => {
    const { container } = render(
      <TimelineItem title="Ignored">
        <span className="custom">Custom content</span>
      </TimelineItem>,
    );
    expect(container.querySelector('[data-slot="timeline-title"]')).not.toBeInTheDocument();
    expect(container.querySelector(".custom")?.textContent).toBe("Custom content");
  });

  it("applies status classes to the dot", () => {
    const statuses = ["done", "current", "pending"] as const;
    for (const status of statuses) {
      const { container } = render(<TimelineItem status={status} />);
      expect(container.querySelector('[data-slot="timeline-dot"]')).toHaveClass(`timeline__dot--${status}`);
    }
  });

  it("applies all color variants to the dot", () => {
    const colors = ["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const;
    for (const color of colors) {
      const { container } = render(<TimelineItem color={color} />);
      expect(container.querySelector('[data-slot="timeline-dot"]')).toHaveClass(`timeline__dot--color-${color}`);
    }
  });

  it("defaults to vertical orientation", () => {
    const { container } = render(<Timeline />);
    expect(container.querySelector('[data-slot="timeline"]')).toHaveClass("timeline--vertical");
  });

  it("orientation=horizontal applies the horizontal class to root and items", () => {
    const { container } = render(
      <Timeline orientation="horizontal">
        <TimelineItem title="A" />
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline"]')).toHaveClass("timeline--horizontal");
    expect(container.querySelector('[data-slot="timeline-item"]')).toHaveClass("timeline__item--horizontal");
  });

  it("the connecting line and dot are decorative (aria-hidden)", () => {
    const { container } = render(<TimelineItem />);
    expect(container.querySelector('[data-slot="timeline-line"]')).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-slot="timeline-dot"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("merges custom className with base classes on the root", () => {
    const { container } = render(<Timeline className="custom-class" />);
    const root = container.querySelector('[data-slot="timeline"]');
    expect(root).toHaveClass("custom-class");
    expect(root).toHaveClass("timeline");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Order placed" timestamp="Jan 3" status="done" />
        <TimelineItem title="Shipped" timestamp="Jan 5" status="current" />
        <TimelineItem title="Delivered" status="pending" />
      </Timeline>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
