import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSection,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "..";

// Disable "region": portalled context-menu content lands directly in document.body,
// outside any landmark — matches the Vue port's axe config for this component.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
};

function rightClick(el: Element) {
  el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
}

function BasicContextMenu({ onSelect }: { onSelect?: (label: string) => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent ariaLabel="Basic menu">
        <ContextMenuItem onSelect={() => onSelect?.("Item 1")}>Item 1</ContextMenuItem>
        <ContextMenuItem onSelect={() => onSelect?.("Item 2")}>Item 2</ContextMenuItem>
        <ContextMenuItem onSelect={() => onSelect?.("Item 3")}>Item 3</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe("ContextMenu — render", () => {
  it("renders the trigger area", () => {
    render(<BasicContextMenu />);
    expect(screen.getByText("Right-click me")).toBeInTheDocument();
  });

  it("menu is hidden until right-click", () => {
    render(<BasicContextMenu />);
    expect(document.querySelectorAll('[role="menuitem"]').length).toBe(0);
  });

  it("right-clicking the trigger opens the menu", async () => {
    render(<BasicContextMenu />);
    rightClick(screen.getByText("Right-click me"));

    const items = await screen.findAllByRole("menuitem");
    expect(items).toHaveLength(3);
    expect(screen.getByRole("menu", { name: "Basic menu" })).toBeInTheDocument();
  });
});

describe("ContextMenu — item selection", () => {
  it("selects an item via keyboard (ArrowDown + Enter)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BasicContextMenu onSelect={onSelect} />);

    rightClick(screen.getByText("Right-click me"));
    await screen.findAllByRole("menuitem");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith("Item 1");
  });

  it("closes the menu after selecting an item", async () => {
    const user = userEvent.setup();
    render(<BasicContextMenu />);

    rightClick(screen.getByText("Right-click me"));
    await screen.findAllByRole("menuitem");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(document.querySelectorAll('[role="menuitem"]').length).toBe(0);
  });

  it("does not open when the trigger is disabled", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger isDisabled>
          <div>Disabled trigger</div>
        </ContextMenuTrigger>
        <ContextMenuContent ariaLabel="Disabled menu">
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    rightClick(screen.getByText("Disabled trigger"));
    expect(document.querySelectorAll('[role="menuitem"]').length).toBe(0);
  });
});

describe("ContextMenu — checkbox and radio items", () => {
  it("toggles a checkbox item", async () => {
    const onCheckedChange = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent ariaLabel="Checkbox menu">
          <ContextMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Show toolbar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    rightClick(screen.getByText("Right-click me"));
    const checkboxItem = await screen.findByRole("menuitemcheckbox");
    await userEvent.click(checkboxItem);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("selects a radio item within a group", async () => {
    const onValueChange = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent ariaLabel="Radio menu">
          <ContextMenuRadioGroup value="a" onValueChange={onValueChange}>
            <ContextMenuRadioItem value="a">Option A</ContextMenuRadioItem>
            <ContextMenuRadioItem value="b">Option B</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>,
    );

    rightClick(screen.getByText("Right-click me"));
    const radioItems = await screen.findAllByRole("menuitemradio");
    await userEvent.click(radioItems[1]);

    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});

describe("ContextMenu — sections and submenus", () => {
  it("renders a titled section with a divider", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent ariaLabel="Section menu">
          <ContextMenuSection title="Actions" showDivider>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuSection>
        </ContextMenuContent>
      </ContextMenu>,
    );

    rightClick(screen.getByText("Right-click me"));
    expect(await screen.findByText("Actions")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("opens a submenu via its trigger", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent ariaLabel="Sub menu root">
          <ContextMenuSub>
            <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Nested item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );

    rightClick(screen.getByText("Right-click me"));
    const subTrigger = await screen.findByText("More options");

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowRight}");

    expect(await screen.findByText("Nested item")).toBeInTheDocument();
    expect(subTrigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("ContextMenu — accessibility", () => {
  it("has no accessibility violations while open", async () => {
    render(<BasicContextMenu />);
    rightClick(screen.getByText("Right-click me"));
    await screen.findAllByRole("menuitem");

    const results = await axe.run(document.body, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });
});
