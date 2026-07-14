import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSection,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "../index";

function BasicMenubar() {
  return (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem isDisabled>New Window</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarSection title="Display">
            <MenubarCheckboxItem checked>Show Bookmarks</MenubarCheckboxItem>
          </MenubarSection>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe("Menubar", () => {
  it("renders one trigger per MenubarMenu", () => {
    render(<BasicMenubar />);
    expect(screen.getByRole("menuitem", { name: "File" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "View" })).toBeInTheDocument();
  });

  it("menu content is not in the document until a trigger is clicked", () => {
    render(<BasicMenubar />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("clicking a trigger opens its menu with the expected items", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "File" }));

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("New Tab")).toBeInTheDocument();
    expect(within(menu).getByText("New Window")).toBeInTheDocument();
  });

  it("disabled item has data-disabled attribute", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "File" }));

    const disabledItem = await screen.findByText("New Window");
    expect(disabledItem.closest('[role="menuitem"]')).toHaveAttribute("data-disabled");
  });

  it("navigates between top-level menus with ArrowRight/ArrowLeft while open", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    const fileTrigger = screen.getByRole("menuitem", { name: "File" });
    await user.click(fileTrigger);
    await screen.findByRole("menu");

    await user.keyboard("{ArrowRight}");

    // Moving right from File should open Edit's menu and close File's.
    const editTrigger = screen.getByRole("menuitem", { name: "Edit" });
    expect(editTrigger).toHaveAttribute("data-state", "open");
    expect(fileTrigger).toHaveAttribute("data-state", "closed");

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Undo")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(fileTrigger).toHaveAttribute("data-state", "open");
    expect(editTrigger).toHaveAttribute("data-state", "closed");
  });

  it("navigates down into items with ArrowDown and selects with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    function MenubarWithSelect() {
      return (
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={onSelect}>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    }

    render(<MenubarWithSelect />);
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    await screen.findByRole("menu");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("CheckboxItem renders with role menuitemcheckbox and reflects checked state", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "View" }));

    const checkboxItem = await screen.findByRole("menuitemcheckbox", { name: "Show Bookmarks" });
    expect(checkboxItem).toHaveAttribute("aria-checked", "true");
  });

  it("RadioItem renders with role menuitemradio and the selected item has aria-checked true", async () => {
    const user = userEvent.setup();

    function MenubarWithRadio() {
      return (
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value="list">
                <MenubarRadioItem value="list">List</MenubarRadioItem>
                <MenubarRadioItem value="grid">Grid</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    }

    render(<MenubarWithRadio />);
    await user.click(screen.getByRole("menuitem", { name: "View" }));

    const listItem = await screen.findByRole("menuitemradio", { name: "List" });
    const gridItem = screen.getByRole("menuitemradio", { name: "Grid" });
    expect(listItem).toHaveAttribute("aria-checked", "true");
    expect(gridItem).toHaveAttribute("aria-checked", "false");
  });

  it("MenubarSection renders a label when title is given", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "View" }));

    expect(await screen.findByText("Display")).toBeInTheDocument();
  });

  it("Escape key closes an open menu", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "File" }));
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no accessibility violations in the closed state", async () => {
    const { container } = render(<BasicMenubar />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in the open state with mixed item types", async () => {
    const user = userEvent.setup();
    render(<BasicMenubar />);

    await user.click(screen.getByRole("menuitem", { name: "View" }));
    await screen.findByRole("menu");

    // Verified empirically (mirrors the Vue port's Menubar.test.ts): MenubarContent portals via
    // Radix's Popper-based Portal (same mechanism as ContextMenu/Dropdown), producing a genuine
    // "region" violation on the portaled wrapper div (not contained by a landmark) that is
    // unrelated to Menubar's own markup. Confirmed by running this test with the rule enabled
    // first and reading the actual violation output.
    const results = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});
