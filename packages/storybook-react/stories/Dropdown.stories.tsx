import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
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
} from "@auronui/react";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Default menu">
        <DropdownItem>New File</DropdownItem>
        <DropdownItem>Open File</DropdownItem>
        <DropdownItem>Save</DropdownItem>
        <DropdownItem>Close</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">User Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu">
        <DropdownSection title="Account" showDivider>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
        </DropdownSection>
        <DropdownSection title="Danger Zone">
          <DropdownItem variant="danger">Log Out</DropdownItem>
          <DropdownItem variant="danger">Delete Account</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    function Demo() {
      const [autoSave, setAutoSave] = useState(true);
      const [spellCheck, setSpellCheck] = useState(false);
      const [wordWrap, setWordWrap] = useState(true);
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Editor Settings</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Editor settings">
            <DropdownSection title="Features">
              <DropdownCheckboxItem isSelected={autoSave} onSelectedChange={setAutoSave}>
                Auto Save
              </DropdownCheckboxItem>
              <DropdownCheckboxItem isSelected={spellCheck} onSelectedChange={setSpellCheck}>
                Spell Check
              </DropdownCheckboxItem>
              <DropdownCheckboxItem isSelected={wordWrap} onSelectedChange={setWordWrap}>
                Word Wrap
              </DropdownCheckboxItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      );
    }
    return <Demo />;
  },
};

export const WithRadioGroup: Story = {
  render: () => {
    function Demo() {
      const [density, setDensity] = useState("comfortable");
      return (
        <div>
          <p style={{ marginBottom: 8, fontSize: 14, color: "#666" }}>Selected: {density}</p>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">View Density</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="View density">
              <DropdownSection title="Density">
                <DropdownRadioGroup value={density} onChange={setDensity}>
                  <DropdownRadioItem value="compact">Compact</DropdownRadioItem>
                  <DropdownRadioItem value="comfortable">Comfortable</DropdownRadioItem>
                  <DropdownRadioItem value="spacious">Spacious</DropdownRadioItem>
                </DropdownRadioGroup>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">More Options</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Options with submenu">
        <DropdownItem>New Tab</DropdownItem>
        <DropdownItem>New Window</DropdownItem>
        <DropdownSub>
          <DropdownSubTrigger>Open Recent</DropdownSubTrigger>
          <DropdownSubContent>
            <DropdownItem>project-alpha.tsx</DropdownItem>
            <DropdownItem>component.tsx</DropdownItem>
            <DropdownSub>
              <DropdownSubTrigger>Older Files</DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>legacy-v1.tsx</DropdownItem>
                <DropdownItem>archive.zip</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
          </DropdownSubContent>
        </DropdownSub>
        <DropdownItem shortcut="⌘W">Close Tab</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
