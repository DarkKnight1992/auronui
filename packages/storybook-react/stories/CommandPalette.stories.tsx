import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CommandPalette } from "@auronui/react";
import type { CommandPaletteItemData } from "@auronui/react";

const baseItems: CommandPaletteItemData[] = [
  { value: "new-file", label: "New File", group: "File", shortcut: "⌘N" },
  { value: "open-file", label: "Open File", group: "File", shortcut: "⌘O" },
  { value: "save-file", label: "Save File", group: "File", shortcut: "⌘S" },
  { value: "toggle-theme", label: "Toggle Theme", group: "View" },
  { value: "toggle-sidebar", label: "Toggle Sidebar", group: "View", shortcut: "⌘B" },
  { value: "go-home", label: "Go to Home" },
  { value: "go-settings", label: "Go to Settings" },
];

const meta: Meta<typeof CommandPalette> = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    shortcut: { control: "text" },
    emptyMessage: { control: "text" },
  },
  args: {
    placeholder: "Type a command or search…",
    shortcut: "mod+k",
    emptyMessage: "No results found.",
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            Press <kbd>Cmd/Ctrl+K</kbd> anywhere on this page, or click the button below.
          </p>
          <Button onClick={() => setIsOpen(true)}>Open Command Palette</Button>
          <CommandPalette
            {...args}
            open={isOpen}
            onOpenChange={setIsOpen}
            items={baseItems}
            onSelect={(item) => console.log("selected", item)}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const AlwaysOpen: Story = {
  name: "Open (for visual review)",
  render: (args) => {
    function Demo() {
      const [isOpen, setIsOpen] = useState(true);
      return <CommandPalette {...args} open={isOpen} onOpenChange={setIsOpen} items={baseItems} />;
    }
    return <Demo />;
  },
};

export const EmptyResults: Story = {
  name: 'Empty state (search for "zzz")',
  render: (args) => {
    function Demo() {
      const [isOpen, setIsOpen] = useState(true);
      return <CommandPalette {...args} open={isOpen} onOpenChange={setIsOpen} items={baseItems} />;
    }
    return <Demo />;
  },
};

export const CustomShortcut: Story = {
  name: "Custom shortcut (Cmd/Ctrl+P)",
  args: { shortcut: "mod+p" },
  render: (args) => {
    function Demo() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            Press <kbd>Cmd/Ctrl+P</kbd> to open (not the default Cmd/Ctrl+K).
          </p>
          <Button onClick={() => setIsOpen(true)}>Open Command Palette</Button>
          <CommandPalette {...args} open={isOpen} onOpenChange={setIsOpen} items={baseItems} />
        </div>
      );
    }
    return <Demo />;
  },
};
