import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ToastProvider } from "../ToastProvider";
import { useToast } from "../../../hooks";

function Trigger() {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast({ title: "Saved", description: "Your changes were saved.", duration: 30000 })
      }
    >
      Show toast
    </button>
  );
}

// useToast() is a hook — it must be called from inside a rendered
// component, not directly from a test's afterEach. This tiny harness lets
// afterEach drain the module-level toast store (shared across every
// useToast() call in the app, by design) between tests.
function DrainAllToasts() {
  const { toasts, remove } = useToast();
  toasts.forEach((t) => remove(t.id));
  return null;
}

describe("ToastProvider", () => {
  afterEach(() => {
    const { unmount } = render(<DrainAllToasts />);
    unmount();
  });

  it("renders nothing when there are no active toasts", () => {
    const { container } = render(<ToastProvider />);
    expect(container.querySelector('[data-slot="toast-region"]')).not.toBeInTheDocument();
  });

  it("shows a toast triggered via useToast() and dismisses it via the close button", async () => {
    render(
      <>
        <Trigger />
        <ToastProvider />
      </>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Close notification" }));
    await waitFor(() => expect(screen.queryByText("Saved")).not.toBeInTheDocument());
  });

  it("sets data-state to drive the CSS enter/exit animation, and stays mounted through the removal grace period after dismiss", async () => {
    render(
      <>
        <Trigger />
        <ToastProvider />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    await screen.findByText("Saved");
    const toastEl = document.querySelector('[data-slot="toast"]') as HTMLElement;
    expect(toastEl).toHaveAttribute("data-state", "open");

    await userEvent.click(screen.getByRole("button", { name: "Close notification" }));
    // Immediately after dismiss (before the removal timer fires), the toast
    // must still be in the DOM with data-state="closed" so the CSS exit
    // animation actually has something to animate.
    expect(document.querySelector('[data-slot="toast"]')).toHaveAttribute("data-state", "closed");

    await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).not.toBeInTheDocument());
  });

  it("lays out the title/description and the close button as a row, not stacked", async () => {
    render(
      <>
        <Trigger />
        <ToastProvider />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const content = await screen.findByText("Your changes were saved.").then((el) => el.closest('[data-slot="toast-content"]'));
    const closeButton = screen.getByRole("button", { name: "Close notification" });
    // The content block and the close button must be siblings under the same
    // flex row (the live-region wrapper), not nested inside separate
    // unstyled block-level containers that stack vertically.
    expect(content?.parentElement).toBe(closeButton.closest('[role="status"], [role="alert"]'));
  });

  it("danger-variant toasts announce assertively via role=alert", async () => {
    function DangerTrigger() {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast({ title: "Error", variant: "danger", duration: 30000 })}>
          Fire
        </button>
      );
    }
    render(
      <>
        <DangerTrigger />
        <ToastProvider />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Fire" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Error");
  });

  it("auto-dismisses after its duration elapses", async () => {
    vi.useFakeTimers();
    function ShortTrigger() {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast({ title: "Bye", duration: 100 })}>
          Fire
        </button>
      );
    }
    render(
      <>
        <ShortTrigger />
        <ToastProvider />
      </>,
    );
    await act(async () => {
      screen.getByRole("button", { name: "Fire" }).click();
    });
    expect(screen.getByText("Bye")).toBeInTheDocument();

    // Async variant: dismiss (open:false) at t=100 triggers a re-render whose
    // effect schedules a SECOND setTimeout (the 250ms removal grace period —
    // see ToastProvider.tsx). The sync `advanceTimersByTime` doesn't yield
    // between chained timers, so it can fast-forward past the whole window
    // before that second timer is even registered, and it never fires within
    // the same call. The async variant yields after each timer fires, giving
    // React's effect a chance to schedule the next one before continuing.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100 + 250 + 10);
    });
    expect(screen.queryByText("Bye")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has no accessibility violations with an active toast", async () => {
    const { container } = render(
      <>
        <Trigger />
        <ToastProvider />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    await screen.findByText("Saved");

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
