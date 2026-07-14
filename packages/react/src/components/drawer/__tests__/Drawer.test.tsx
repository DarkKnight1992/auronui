import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerProps,
} from "../index";

function renderDrawer(props: Partial<DrawerProps> = {}) {
  return render(
    <Drawer {...props}>
      <DrawerTrigger>
        <button type="button">Open Drawer</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Test Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer content goes here.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose>
            <button type="button">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
  );
}

describe("Drawer", () => {
  it("is closed by default and opens when the trigger is clicked", async () => {
    renderDrawer();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    renderDrawer();
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes when DrawerClose is clicked", async () => {
    renderDrawer();
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("renders the panel with the requested placement as a data attribute", async () => {
    renderDrawer({ placement: "left" });
    await userEvent.click(screen.getByRole("button", { name: "Open Drawer" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.closest('[data-placement="left"]')).toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    const { rerender } = render(
      <Drawer open={false}>
        <DrawerTrigger>
          <button type="button">Open Drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerBody>Drawer content goes here.</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Drawer open>
        <DrawerTrigger>
          <button type="button">Open Drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerBody>Drawer content goes here.</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  describe("dock mode", () => {
    function renderDockDrawer(props: Partial<DrawerProps> = {}) {
      return render(
        <Drawer dock {...props}>
          <DrawerTrigger>
            <button type="button">Toggle Drawer</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Dock Drawer</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <p>Dock content.</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>,
      );
    }

    it("renders the panel hidden by default and toggles it via the trigger, with no react-aria-components dialog role", async () => {
      renderDockDrawer();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByText("Dock content.")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Toggle Drawer" }));
      expect(screen.getByText("Dock content.")).toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Toggle Drawer" }));
      expect(screen.getByText("Dock content.")).not.toBeVisible();
    });
  });

  it("has no accessibility violations when closed", async () => {
    renderDrawer();
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    renderDrawer({ defaultOpen: true });
    await screen.findByRole("dialog");
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
