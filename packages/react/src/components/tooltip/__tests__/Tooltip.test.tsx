import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
// react-aria's hover-driven tooltip open logic (useTooltipTrigger's onHoverStart)
// only opens when the global "interaction modality" is 'pointer' — real browsers
// flip that on the first real pointerdown/pointermove, but jsdom + userEvent's
// synthesized pointer events don't reliably trigger react-aria's own document-level
// modality listener. Priming it explicitly is the deterministic fix (vs. flaky
// extra pointer dispatches) — this is a private but stable react-aria testing hook.
import { setInteractionModality } from "react-aria/private/interactions/useFocusVisible";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../index";

function renderTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return render(
    <TooltipProvider delayDuration={0} closeDelay={0}>
      <Tooltip {...props}>
        <TooltipTrigger>
          <button type="button">Hover me</button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Tooltip text</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe("Tooltip", () => {
  beforeEach(() => {
    setInteractionModality("pointer");
  });

  it("does not render tooltip content when closed by default", () => {
    renderTooltip();
    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
  });

  it("renders tooltip content when defaultOpen=true", () => {
    renderTooltip({ defaultOpen: true });
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    const user = userEvent.setup();
    renderTooltip();

    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Hover me" }));

    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });
  });

  it("hides tooltip on unhover", async () => {
    const user = userEvent.setup();
    renderTooltip();

    const trigger = screen.getByRole("button", { name: "Hover me" });
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
    });
  });

  it("shows tooltip on focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0} closeDelay={0}>
        <Tooltip>
          <TooltipTrigger>
            <button type="button">Focus me</button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Tooltip text</span>
          </TooltipContent>
        </Tooltip>
        <button type="button">Elsewhere</button>
      </TooltipProvider>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Focus me" })).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
    });
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <TooltipProvider delayDuration={0} closeDelay={0}>
        <Tooltip open={false} onOpenChange={onOpenChange}>
          <TooltipTrigger>
            <button type="button">Hover me</button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Tooltip text</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();

    rerender(
      <TooltipProvider delayDuration={0} closeDelay={0}>
        <Tooltip open onOpenChange={onOpenChange}>
          <TooltipTrigger>
            <button type="button">Hover me</button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Tooltip text</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });
  });

  it("applies the trigger's interactive affordance class to any child, not just Button", () => {
    render(
      <TooltipProvider delayDuration={0} closeDelay={0}>
        <Tooltip>
          <TooltipTrigger>
            <span data-testid="plain-trigger">glossary term</span>
          </TooltipTrigger>
          <TooltipContent>
            <span>Definition</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("plain-trigger").className).toContain("tooltip__trigger");
  });

  it("merges the trigger class with a pre-existing className on the child", () => {
    render(
      <TooltipProvider delayDuration={0} closeDelay={0}>
        <Tooltip>
          <TooltipTrigger>
            <span data-testid="plain-trigger" className="custom-class">
              glossary term
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>Definition</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const cls = screen.getByTestId("plain-trigger").className;
    expect(cls).toContain("tooltip__trigger");
    expect(cls).toContain("custom-class");
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = renderTooltip();
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    // `region` audits full-page landmark structure, not applicable to an
    // isolated component mounted directly under <body> in a unit test.
    const results = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
