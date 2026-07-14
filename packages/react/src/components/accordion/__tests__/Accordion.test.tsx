import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from "../index";

function BasicAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return (
    <Accordion type="single" collapsible {...props}>
      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionTrigger>One</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionTrigger>Two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content two</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders triggers and applies the base class", () => {
    const { container } = render(<BasicAccordion />);
    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(container.querySelector(".accordion")).toBeInTheDocument();
  });

  it("expands an item on click and collapses it again", async () => {
    render(<BasicAccordion />);
    const trigger = screen.getByRole("button", { name: "One" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content one")).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard activation via Enter", async () => {
    render(<BasicAccordion />);
    const trigger = screen.getByRole("button", { name: "One" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders the shorthand items API", () => {
    render(
      <Accordion
        type="single"
        items={[
          { value: "a", title: "A", content: "A content" },
          { value: "b", title: "B", content: "B content" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<BasicAccordion />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with an item expanded", async () => {
    const { container } = render(<BasicAccordion defaultValue="one" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
