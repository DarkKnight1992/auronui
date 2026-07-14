import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  type ModalProps,
} from "../index";

function renderModal(props: Partial<ModalProps> = {}) {
  return render(
    <Modal {...props}>
      <ModalTrigger>
        <button type="button">Open Modal</button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Test Modal</ModalTitle>
          <ModalDescription>A description of the modal.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>Modal content goes here.</p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <button type="button">Close</button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>,
  );
}

describe("Modal", () => {
  it("is closed by default and opens when the trigger is clicked", async () => {
    renderModal();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open Modal" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Open Modal" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes when ModalClose is clicked", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Open Modal" }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("clicking outside the dialog closes it (isDismissable default)", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Open Modal" }));
    await screen.findByRole("dialog");
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("wires aria-labelledby to ModalTitle and aria-describedby to ModalDescription", async () => {
    renderModal({ defaultOpen: true });
    const dialog = await screen.findByRole("dialog");

    const labelledById = dialog.getAttribute("aria-labelledby");
    expect(labelledById).toBeTruthy();
    expect(document.getElementById(labelledById!)).toHaveTextContent("Test Modal");

    const describedById = dialog.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById!)).toHaveTextContent("A description of the modal.");
  });

  it("has no accessibility violations when closed", async () => {
    renderModal();
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    renderModal({ defaultOpen: true });
    await screen.findByRole("dialog");
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
