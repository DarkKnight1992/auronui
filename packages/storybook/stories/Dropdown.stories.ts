import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
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
} from "@auronui/vue";

const allComponents = {
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
};

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: "Components/Dropdown",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// ---------------------------------------------------------------------------
// Default — trigger + 4 items
// ---------------------------------------------------------------------------
export const Default: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">Open Menu</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Default menu">
          <DropdownItem>New File</DropdownItem>
          <DropdownItem>Open File</DropdownItem>
          <DropdownItem>Save</DropdownItem>
          <DropdownItem>Close</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithIcons — startContent per item
// ---------------------------------------------------------------------------
export const WithIcons: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">Actions</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions menu">
          <DropdownItem>
            <template #startContent>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </template>
            Edit
          </DropdownItem>
          <DropdownItem>
            <template #startContent>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </template>
            Expand
          </DropdownItem>
          <DropdownItem variant="danger">
            <template #startContent>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </template>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithShortcuts
// ---------------------------------------------------------------------------
export const WithShortcuts: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">File</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File menu">
          <DropdownItem shortcut="⌘N">New File</DropdownItem>
          <DropdownItem shortcut="⌘O">Open File</DropdownItem>
          <DropdownItem shortcut="⌘S">Save</DropdownItem>
          <DropdownItem shortcut="⌘⇧S">Save As</DropdownItem>
          <DropdownItem shortcut="⌘W">Close</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithSections — 2 sections + separator
// ---------------------------------------------------------------------------
export const WithSections: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">User Menu</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu">
          <DropdownSection title="Account" :show-divider="true">
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger Zone">
            <DropdownItem variant="danger">Log Out</DropdownItem>
            <DropdownItem variant="danger">Delete Account</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithDisabledItems
// ---------------------------------------------------------------------------
export const WithDisabledItems: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">Options</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Options menu">
          <DropdownItem>Copy</DropdownItem>
          <DropdownItem>Paste</DropdownItem>
          <DropdownItem :is-disabled="true">Cut (disabled)</DropdownItem>
          <DropdownItem :is-disabled="true">Redo (disabled)</DropdownItem>
          <DropdownItem>Undo</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithCheckboxItems — settings menu
// ---------------------------------------------------------------------------
export const WithCheckboxItems: Story = {
  render: (args) => ({
    components: allComponents,
    setup() {
      const autoSave = ref(true);
      const spellCheck = ref(false);
      const wordWrap = ref(true);
      const lineNumbers = ref(false);
      return { args, autoSave, spellCheck, wordWrap, lineNumbers };
    },
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">Editor Settings</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Editor settings">
          <DropdownSection title="Features">
            <DropdownCheckboxItem v-model:is-selected="autoSave">Auto Save</DropdownCheckboxItem>
            <DropdownCheckboxItem v-model:is-selected="spellCheck">Spell Check</DropdownCheckboxItem>
            <DropdownCheckboxItem v-model:is-selected="wordWrap">Word Wrap</DropdownCheckboxItem>
            <DropdownCheckboxItem v-model:is-selected="lineNumbers">Line Numbers</DropdownCheckboxItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithRadioGroup — view density
// ---------------------------------------------------------------------------
export const WithRadioGroup: Story = {
  render: (args) => ({
    components: allComponents,
    setup() {
      const density = ref("comfortable");
      return { args, density };
    },
    template: `
      <div>
        <p style="margin-bottom: 8px; font-size: 14px; color: #666;">Selected: {{ density }}</p>
        <Dropdown v-bind="args">
          <DropdownTrigger>
            <Button variant="flat">View Density</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="View density">
            <DropdownSection title="Density">
              <DropdownRadioGroup v-model="density">
                <DropdownRadioItem value="compact">Compact</DropdownRadioItem>
                <DropdownRadioItem value="comfortable">Comfortable</DropdownRadioItem>
                <DropdownRadioItem value="spacious">Spacious</DropdownRadioItem>
              </DropdownRadioGroup>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithSubmenu — nested 2 levels
// ---------------------------------------------------------------------------
export const WithSubmenu: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">More Options</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Options with submenu">
          <DropdownItem>New Tab</DropdownItem>
          <DropdownItem>New Window</DropdownItem>
          <DropdownSub>
            <DropdownSubTrigger>Open Recent</DropdownSubTrigger>
            <DropdownSubContent>
              <DropdownItem>project-alpha.vue</DropdownItem>
              <DropdownItem>component.ts</DropdownItem>
              <DropdownSub>
                <DropdownSubTrigger>Older Files</DropdownSubTrigger>
                <DropdownSubContent>
                  <DropdownItem>legacy-v1.vue</DropdownItem>
                  <DropdownItem>archive.zip</DropdownItem>
                </DropdownSubContent>
              </DropdownSub>
            </DropdownSubContent>
          </DropdownSub>
          <DropdownItem shortcut="⌘W">Close Tab</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};

// ---------------------------------------------------------------------------
// WithSubmenuClickTrigger — submenu opens on click instead of hover
// ---------------------------------------------------------------------------
export const WithSubmenuClickTrigger: Story = {
  render: (args) => ({
    components: allComponents,
    setup: () => ({ args }),
    template: `
      <Dropdown v-bind="args">
        <DropdownTrigger>
          <Button variant="flat">More Options</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Options with click submenu">
          <DropdownItem>New Tab</DropdownItem>
          <DropdownItem>New Window</DropdownItem>
          <DropdownSub :open-on-hover="false">
            <DropdownSubTrigger>Open Recent (click me)</DropdownSubTrigger>
            <DropdownSubContent>
              <DropdownItem>project-alpha.vue</DropdownItem>
              <DropdownItem>component.ts</DropdownItem>
              <DropdownSub :open-on-hover="false">
                <DropdownSubTrigger>Older Files (click me)</DropdownSubTrigger>
                <DropdownSubContent>
                  <DropdownItem>legacy-v1.vue</DropdownItem>
                  <DropdownItem>archive.zip</DropdownItem>
                </DropdownSubContent>
              </DropdownSub>
            </DropdownSubContent>
          </DropdownSub>
          <DropdownItem shortcut="⌘W">Close Tab</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    `,
  }),
};
