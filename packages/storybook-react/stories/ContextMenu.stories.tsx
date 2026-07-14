import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type CSSProperties } from "react";
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
} from "@auronui/react";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const zoneStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 280,
  height: 160,
  border: "2px dashed #d4d4d8",
  borderRadius: 8,
  fontSize: 13,
  color: "#71717a",
};

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div style={zoneStyle}>Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent ariaLabel="Actions">
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithSections: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div style={zoneStyle}>Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent ariaLabel="File actions">
        <ContextMenuSection title="File">
          <ContextMenuItem>New</ContextMenuItem>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuSection>
        <ContextMenuSection title="Edit" showDivider>
          <ContextMenuItem>Rename</ContextMenuItem>
          <ContextMenuItem variant="danger">Delete</ContextMenuItem>
        </ContextMenuSection>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxAndRadio: Story = {
  render: () => {
    function Demo() {
      const [showHidden, setShowHidden] = useState(false);
      const [sortBy, setSortBy] = useState("name");
      return (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div style={zoneStyle}>Right-click here</div>
          </ContextMenuTrigger>
          <ContextMenuContent ariaLabel="View options">
            <ContextMenuSection title="View">
              <ContextMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
                Show hidden files
              </ContextMenuCheckboxItem>
            </ContextMenuSection>
            <ContextMenuSection title="Sort by">
              <ContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
                <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
                <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSection>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    return <Demo />;
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div style={zoneStyle}>Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent ariaLabel="Share menu">
        <ContextMenuItem>Copy link</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>Messages</ContextMenuItem>
            <ContextMenuItem>Slack</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
