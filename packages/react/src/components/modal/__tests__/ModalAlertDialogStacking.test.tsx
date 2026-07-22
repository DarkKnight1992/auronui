import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "../index";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "../../alert-dialog/index";

// Regression coverage for a bug where Modal, AlertDialog, and Drawer all
// rendered on the exact same static z-index tier (--z-modal-backdrop: 50,
// --z-modal: 100). An AlertDialog opened over a Modal left the Modal's edges
// undimmed, since its own backdrop (z=50) sat below the Modal's panel
// (z=100) regardless of open order. See useOverlayLayer for the fix.
// Mirrors the Vue package's ModalAlertDialogStacking.test.ts.
function renderModalWithAlertDialog() {
  return render(
    <Modal defaultOpen>
      <ModalTrigger>
        <button type="button">Open Modal</button>
      </ModalTrigger>
      <ModalContent>
        <ModalBody>
          <AlertDialog>
            <AlertDialogTrigger>
              <button type="button">Delete</button>
            </AlertDialogTrigger>
            <AlertDialogContent>content</AlertDialogContent>
          </AlertDialog>
        </ModalBody>
      </ModalContent>
    </Modal>,
  );
}

describe("Modal + AlertDialog stacking", () => {
  it("gives the AlertDialog a higher z-index than the Modal beneath it, on both backdrop and panel", async () => {
    const user = userEvent.setup();
    renderModalWithAlertDialog();

    const modalContainer = document.querySelector(".modal__container") as HTMLElement;
    expect(modalContainer).not.toBeNull();
    const modalBackdrop = document.querySelector(".modal__backdrop") as HTMLElement;
    expect(modalBackdrop).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    const alertBackdrop = document.querySelector(".alert-dialog__backdrop") as HTMLElement;
    const alertContainer = document.querySelector(".alert-dialog__container") as HTMLElement;
    expect(alertBackdrop).not.toBeNull();
    expect(alertContainer).not.toBeNull();

    const modalPanelZ = Number(modalContainer.style.getPropertyValue("--z-modal"));
    const modalBackdropZ = Number(modalBackdrop.style.getPropertyValue("--z-modal-backdrop"));
    const alertBackdropZ = Number(alertBackdrop.style.getPropertyValue("--z-modal-backdrop"));
    const alertPanelZ = Number(alertContainer.style.getPropertyValue("--z-modal"));

    // The alert dialog's backdrop must outrank the modal's own panel —
    // otherwise the modal's panel paints through it wherever the (typically
    // smaller) alert dialog doesn't geometrically cover it.
    expect(alertBackdropZ).toBeGreaterThan(modalPanelZ);
    expect(alertPanelZ).toBeGreaterThan(alertBackdropZ);
    expect(modalPanelZ).toBeGreaterThan(modalBackdropZ);
  });
});
