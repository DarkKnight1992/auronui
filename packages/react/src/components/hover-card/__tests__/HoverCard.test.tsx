import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../index";

function renderHoverCard(props: Partial<React.ComponentProps<typeof HoverCard>> = {}) {
  return render(
    <HoverCard openDelay={0} closeDelay={0} {...props}>
      <HoverCardTrigger>
        <a href="#profile">@auronui</a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>
          <h2>Auron UI</h2>
          <p>React component library.</p>
        </div>
      </HoverCardContent>
    </HoverCard>,
  );
}

describe("HoverCard", () => {
  it("does not render content in the DOM when closed by default", () => {
    renderHoverCard();
    expect(screen.queryByText("Auron UI")).not.toBeInTheDocument();
  });

  it("renders content in the DOM when defaultOpen=true", () => {
    renderHoverCard({ defaultOpen: true });
    expect(screen.getByText("Auron UI")).toBeInTheDocument();
  });

  it("opens on trigger hover", async () => {
    const user = userEvent.setup();
    renderHoverCard();

    expect(screen.queryByText("Auron UI")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("link", { name: "@auronui" }));

    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });
  });

  it("closes when the pointer leaves both trigger and content", async () => {
    const user = userEvent.setup();
    renderHoverCard();

    const trigger = screen.getByRole("link", { name: "@auronui" });
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText("Auron UI")).not.toBeInTheDocument();
    });
  });

  it("stays open while the pointer moves from trigger to content", async () => {
    const user = userEvent.setup();
    // A non-zero closeDelay is required for this test to mean anything: it's the
    // window during which HoverCardContent's onPointerEnter (ctx.cancelClose())
    // can cancel the trigger's scheduled close before it fires.
    renderHoverCard({ closeDelay: 150 });

    const trigger = screen.getByRole("link", { name: "@auronui" });
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });

    await user.unhover(trigger);
    await user.hover(screen.getByText("Auron UI"));

    // Wait past the closeDelay window to confirm the scheduled close was cancelled.
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(screen.getByText("Auron UI")).toBeInTheDocument();
  });

  it("opens on trigger focus for keyboard users", async () => {
    const user = userEvent.setup();
    renderHoverCard();

    await user.tab();
    expect(screen.getByRole("link", { name: "@auronui" })).toHaveFocus();

    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <HoverCard open={false} onOpenChange={onOpenChange}>
        <HoverCardTrigger>
          <a href="#profile">@auronui</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div>Auron UI</div>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.queryByText("Auron UI")).not.toBeInTheDocument();

    rerender(
      <HoverCard open onOpenChange={onOpenChange}>
        <HoverCardTrigger>
          <a href="#profile">@auronui</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div>Auron UI</div>
        </HoverCardContent>
      </HoverCard>,
    );

    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = renderHoverCard();
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const user = userEvent.setup();
    renderHoverCard();
    await user.hover(screen.getByRole("link", { name: "@auronui" }));
    await waitFor(() => {
      expect(screen.getByText("Auron UI")).toBeInTheDocument();
    });

    // `region` audits full-page landmark structure, not applicable to an
    // isolated component mounted directly under <body> in a unit test.
    const results = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
