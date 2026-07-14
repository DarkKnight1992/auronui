import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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
} from "@auronui/react";

const meta: Meta<typeof Menubar> = {
  title: "Components/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent ariaLabel="File menu">
          <MenubarItem>New File</MenubarItem>
          <MenubarItem>Open...</MenubarItem>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent ariaLabel="Edit menu">
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent ariaLabel="View menu">
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent ariaLabel="File menu">
          <MenubarSection title="Recent">
            <MenubarItem>report.pdf</MenubarItem>
            <MenubarItem>notes.txt</MenubarItem>
          </MenubarSection>
          <MenubarSection title="Actions" showDivider>
            <MenubarItem>New</MenubarItem>
            <MenubarItem variant="danger">Delete</MenubarItem>
          </MenubarSection>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithCheckboxAndRadio: Story = {
  render: () => {
    function Demo() {
      const [showToolbar, setShowToolbar] = useState(true);
      const [zoom, setZoom] = useState("100");
      return (
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent ariaLabel="View menu">
              <MenubarSection title="Panels">
                <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
                  Show Toolbar
                </MenubarCheckboxItem>
              </MenubarSection>
              <MenubarSection title="Zoom">
                <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
                  <MenubarRadioItem value="100">100%</MenubarRadioItem>
                  <MenubarRadioItem value="150">150%</MenubarRadioItem>
                  <MenubarRadioItem value="200">200%</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSection>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    }
    return <Demo />;
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent ariaLabel="File menu">
          <MenubarItem>New</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>report.pdf</MenubarItem>
              <MenubarItem>notes.txt</MenubarItem>
              <MenubarItem>budget.xlsx</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
