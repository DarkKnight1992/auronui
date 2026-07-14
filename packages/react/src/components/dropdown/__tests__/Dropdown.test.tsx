import { useState } from "react";
import type { Key } from "react-aria-components";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Button } from "../../button/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSection,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
} from "../index";

function BasicDropdown({ onAction }: { onAction?: (key: Key) => void }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>Open menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" onAction={onAction}>
        <DropdownItem id="new">New file</DropdownItem>
        <DropdownItem id="copy">Copy link</DropdownItem>
        <DropdownItem id="delete" variant="danger">
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

describe("Dropdown", () => {
  it("opens the menu when the trigger is clicked", async () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(trigger);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "New file" })).toBeInTheDocument();
  });

  it("selects an item via keyboard", async () => {
    const onAction = vi.fn();
    render(<BasicDropdown onAction={onAction} />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(onAction).toHaveBeenCalled());
    expect(onAction.mock.calls[0][0]).toBe("new");
  });

  it("closes the menu on Escape", async () => {
    render(<BasicDropdown />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("does not open when the trigger is disabled", async () => {
    render(
      <Dropdown>
        <DropdownTrigger isDisabled>
          <Button>Open menu</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem id="new">New file</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles an independently-controlled checkbox item", async () => {
    function Harness() {
      const [checked, setChecked] = useState(false);
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button>Options</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Options">
            <DropdownCheckboxItem isSelected={checked} onSelectedChange={setChecked}>
              Show hidden files
            </DropdownCheckboxItem>
          </DropdownMenu>
        </Dropdown>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const item = await screen.findByRole("menuitemcheckbox", { name: "Show hidden files" });
    expect(item).toHaveAttribute("aria-checked", "false");
    await userEvent.click(item);
    await waitFor(() => expect(item).toHaveAttribute("aria-checked", "true"));
  });

  it("selects a radio item within a DropdownRadioGroup", async () => {
    // shouldCloseOnSelect=false here so the item stays mounted after the click and its
    // updated aria-checked attribute can be observed — selecting a radio item closes the
    // dropdown by default, at which point the item is unmounted and asserting against the
    // (now-detached) node would be meaningless.
    const onChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState("asc");
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button>Sort</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort" shouldCloseOnSelect={false}>
            <DropdownRadioGroup
              value={value}
              onChange={(next) => {
                setValue(next);
                onChange(next);
              }}
            >
              <DropdownRadioItem value="asc">Ascending</DropdownRadioItem>
              <DropdownRadioItem value="desc">Descending</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownMenu>
        </Dropdown>
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    const descending = await screen.findByRole("menuitemradio", { name: "Descending" });
    await userEvent.click(descending);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("desc"));
    await waitFor(() => expect(descending).toHaveAttribute("aria-checked", "true"));
  });

  it("renders a titled section with a divider", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <Button>Open</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Grouped">
          <DropdownSection title="Recent" showDivider>
            <DropdownItem id="a">Item A</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Recent")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Item A" })).toBeInTheDocument();
  });

  it("opens a nested submenu", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <Button>File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File">
          <DropdownItem id="new">New</DropdownItem>
          <DropdownSub>
            <DropdownSubTrigger>Share</DropdownSubTrigger>
            <DropdownSubContent aria-label="Share">
              <DropdownItem id="email">Email</DropdownItem>
              <DropdownItem id="link">Copy link</DropdownItem>
            </DropdownSubContent>
          </DropdownSub>
        </DropdownMenu>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole("button", { name: "File" }));
    const subTrigger = await screen.findByRole("menuitem", { name: "Share" });
    await userEvent.click(subTrigger);

    expect(await screen.findByRole("menuitem", { name: "Email" })).toBeInTheDocument();
  });

  it("has no accessibility violations while open", async () => {
    render(<BasicDropdown />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("menu");

    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
