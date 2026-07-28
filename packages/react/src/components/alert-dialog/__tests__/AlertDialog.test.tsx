import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogProps,
} from "../index";

function renderAlertDialog(
  props: Partial<AlertDialogProps> = {},
  handlers: { onConfirm?: () => void; onCancel?: () => void } = {},
) {
  return render(
    <AlertDialog {...props}>
      <AlertDialogTrigger>
        <button type="button">Delete item</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogIcon />
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handlers.onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlers.onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  );
}

describe("AlertDialog", () => {
  it("is closed by default and opens when the trigger is clicked", async () => {
    renderAlertDialog();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete item" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("renders with role=alertdialog, not role=dialog", async () => {
    renderAlertDialog({ defaultOpen: true });
    await screen.findByRole("alertdialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wires aria-labelledby to AlertDialogTitle and aria-describedby to AlertDialogDescription", async () => {
    renderAlertDialog({ defaultOpen: true });
    const dialog = await screen.findByRole("alertdialog");

    const labelledById = dialog.getAttribute("aria-labelledby");
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)).toHaveTextContent("Delete item?");

    const describedById = dialog.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById!)).toHaveTextContent("This action cannot be undone.");
  });

  it("closes on Escape", async () => {
    renderAlertDialog({ defaultOpen: true });
    await screen.findByRole("alertdialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("does NOT close when clicking outside (alert dialogs require an explicit action)", async () => {
    renderAlertDialog({ defaultOpen: true });
    await screen.findByRole("alertdialog");
    await userEvent.click(document.body);
    // Give any (incorrect) async close a chance to happen before asserting it didn't.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("AlertDialogCancel fires its callback and closes the dialog", async () => {
    const onCancel = vi.fn();
    renderAlertDialog({ defaultOpen: true }, { onCancel });
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("AlertDialogAction fires its confirm callback and closes the dialog", async () => {
    const onConfirm = vi.fn();
    renderAlertDialog({ defaultOpen: true }, { onConfirm });
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("AlertDialogCancel skips closing when onClick calls event.preventDefault()", async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogBody>Content</AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.preventDefault()}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("AlertDialogAction skips closing when onClick calls event.preventDefault() (async destructive action escape hatch)", async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogBody>Content</AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogAction onClick={(e) => e.preventDefault()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("has no accessibility violations when closed", async () => {
    renderAlertDialog();
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    renderAlertDialog({ defaultOpen: true });
    await screen.findByRole("alertdialog");
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
