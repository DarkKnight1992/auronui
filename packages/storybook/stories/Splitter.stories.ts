import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { nextTick, ref, watch } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle, Switch } from '@auronui/vue'

const meta: Meta<typeof SplitterGroup> = {
  title: 'Extended/Splitter',
  component: SplitterGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
    preservePanelOrder: {
      control: 'boolean',
      description:
        'Repair panel order when a conditionally rendered panel is mounted back in. '
        + 'reka-ui keeps panels in registration order — it sorts by `order` and otherwise falls back to '
        + 'mount order, never DOM order — while resize handles take their pivot from the DOM, so a restored '
        + 'panel leaves the two disagreeing and dragging resizes the wrong panels. '
        + '**Disclaimer:** the repair works by remounting the panels that follow the restored one, so any '
        + 'state inside them (scroll position, focus, uncontrolled inputs, component state) is lost, and the '
        + 'group recomputes its layout from each panel\'s `defaultSize`. Prefer an explicit `order` on '
        + 'conditional panels, which costs nothing; use this when their order is not known ahead of time.',
      table: { category: 'SplitterGroup', defaultValue: { summary: 'false' } },
    },
    keyboardResizeBy: {
      control: 'number',
      description: 'Keyboard resize increment in pixels.',
      table: { category: 'SplitterGroup', defaultValue: { summary: 'undefined' } },
    },
    as: {
      control: 'text',
      description: 'Render SplitterGroup as a different HTML element.',
      table: { category: 'SplitterGroup', defaultValue: { summary: 'undefined' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge SplitterGroup props onto the child element.',
      table: { category: 'SplitterGroup', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    direction: 'horizontal',
    asChild: false,
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; height: 400px;"><story /></div>`,
    }),
  ],
}

export default meta
type Story = StoryObj<typeof SplitterGroup>

const panelStyle = 'width:100%;height:100%;padding:16px;font-family:sans-serif;font-size:13px;color:#64748b;display:flex;align-items:center;justify-content:center;'

export const Horizontal: Story = {
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup direction="horizontal" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    <SplitterPanel :default-size="50" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Left panel</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="50" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Right panel</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup v-bind="args" style="height:100%;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <SplitterPanel :default-size="50" :min-size="20">
          <div :style="panelStyle">Left panel</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="50" :min-size="20">
          <div :style="panelStyle">Right panel</div>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
}

export const Vertical: Story = {
  args: { direction: 'vertical' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup direction="vertical" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    <SplitterPanel :default-size="50" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Top panel</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="50" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Bottom panel</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup v-bind="args" style="height:100%;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <SplitterPanel :default-size="50" :min-size="20">
          <div :style="panelStyle">Top panel</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="50" :min-size="20">
          <div :style="panelStyle">Bottom panel</div>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
}

export const ThreePanels: Story = {
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup direction="horizontal" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    <SplitterPanel :default-size="25" :min-size="15">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Sidebar</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="50" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Main content</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="25" :min-size="15">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Inspector</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup v-bind="args" style="height:100%;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <SplitterPanel :default-size="25" :min-size="15">
          <div :style="panelStyle">Sidebar</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="50" :min-size="20">
          <div :style="panelStyle">Main content</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="25" :min-size="15">
          <div :style="panelStyle">Inspector</div>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
}

export const Collapsible: Story = {
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup direction="horizontal" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    <SplitterPanel :default-size="25" :min-size="15" :collapsible="true" :collapsed-size="0">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Collapsible sidebar (drag to collapse)</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="75" :min-size="40">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Main content</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup v-bind="args" style="height:100%;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <SplitterPanel :default-size="25" :min-size="15" :collapsible="true" :collapsed-size="0">
          <div :style="panelStyle">Collapsible sidebar (drag to collapse)</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="75" :min-size="40">
          <div :style="panelStyle">Main content</div>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
}

export const TogglePanel: Story = {
  name: 'Toggle panel (remove one half)',
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      description: {
        story:
          'Removing a half means unmounting the `SplitterPanel` (and the `SplitterResizeHandle` next to it) — '
          + 'the remaining panel then fills the group. **Always give a conditionally rendered panel an explicit '
          + '`order`** (plus a stable `id`): reka-ui orders panels by `order` and otherwise falls back to the '
          + 'order they mounted in — it never reads DOM order — while resize handles take their pivot indices '
          + 'from the DOM. A panel that unmounts and comes back re-registers last while rendering in its original '
          + 'position, and the two orderings diverge. Sizes still look correct, so nothing appears wrong until you '
          + 'drag, at which point a handle resizes panels other than the two it sits between. AuronUI logs a '
          + 'dev-only warning when it detects this — or set `preservePanelOrder` on the group to have it repaired '
          + 'automatically, at the cost of remounting the panels that follow the restored one (they lose their '
          + 'internal state). Finally, record `@layout` and replay it through the restored '
          + 'panel\'s exposed `resize()` to bring back the sizes the user dragged to — `:default-size` alone '
          + 'normalizes against the half that never unmounted.',
      },
      source: {
        code: `<script setup>
import { nextTick, ref, watch } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle, Switch } from '@auronui/vue'

const sidebarPanel = ref(null)
const editorPanel = ref(null)
const showSidebar = ref(true)
const showEditor = ref(true)

// Remember the last two-panel layout so restoring a removed half brings back
// the size the user dragged to, rather than snapping back to defaultSize.
const sizes = ref([30, 70])
function onLayout(next) {
  if (showSidebar.value && showEditor.value && next.length === 2) sizes.value = next
}

// defaultSize alone is not enough to restore the layout: the half that stayed
// mounted keeps the size it registered with, so the group sees a total that is
// not 100% and normalizes both panels to something in between. Resizing the
// restored panel once it is back settles the group on the exact saved split.
async function restore(panel, size) {
  await nextTick()
  panel.value?.resize(size)
}
watch(showSidebar, (on) => on && restore(sidebarPanel, sizes.value[0]))
watch(showEditor, (on) => on && restore(editorPanel, sizes.value[1]))
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center;">
    <!-- at least one half must stay mounted: a group with no panels has nothing to lay out -->
    <Switch v-model="showSidebar" :is-disabled="!showEditor">Sidebar</Switch>
    <Switch v-model="showEditor" :is-disabled="!showSidebar">Editor</Switch>
  </div>

  <!-- \`order\` is required on conditional panels: reka-ui registers panels in mount
       order, not DOM order, so a restored panel would otherwise pair the handles with
       the wrong neighbours and drag would resize the wrong halves. -->
  <SplitterGroup direction="horizontal" style="height: 360px;" @layout="onLayout">
    <SplitterPanel v-if="showSidebar" ref="sidebarPanel" id="sidebar" :order="1" :default-size="sizes[0]" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px;">Sidebar</div>
    </SplitterPanel>
    <SplitterResizeHandle v-if="showSidebar && showEditor" />
    <SplitterPanel v-if="showEditor" ref="editorPanel" id="editor" :order="2" :default-size="sizes[1]" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px;">Editor</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle, Switch },
    setup() {
      const sidebarPanel = ref<{ resize: (size: number) => void } | null>(null)
      const editorPanel = ref<{ resize: (size: number) => void } | null>(null)
      const showSidebar = ref(true)
      const showEditor = ref(true)
      const sizes = ref([30, 70])
      function onLayout(next: number[]) {
        if (showSidebar.value && showEditor.value && next.length === 2) sizes.value = next
      }
      async function restore(panel: typeof sidebarPanel, size: number) {
        await nextTick()
        panel.value?.resize(size)
      }
      watch(showSidebar, (on) => { if (on) restore(sidebarPanel, sizes.value[0]) })
      watch(showEditor, (on) => { if (on) restore(editorPanel, sizes.value[1]) })
      return { args, panelStyle, sidebarPanel, editorPanel, showSidebar, showEditor, sizes, onLayout }
    },
    template: `
      <div style="height:100%;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;gap:24px;align-items:center;font-family:sans-serif;font-size:13px;">
          <Switch v-model="showSidebar" :is-disabled="!showEditor">Sidebar</Switch>
          <Switch v-model="showEditor" :is-disabled="!showSidebar">Editor</Switch>
          <span style="color:#94a3b8;">Drag the handle, toggle a half off and back on — the layout is restored.</span>
        </div>
        <SplitterGroup
          v-bind="args"
          style="flex:1;min-height:0;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;"
          @layout="onLayout"
        >
          <SplitterPanel v-if="showSidebar" ref="sidebarPanel" id="sidebar" :order="1" :default-size="sizes[0]" :min-size="20">
            <div :style="panelStyle">Sidebar</div>
          </SplitterPanel>
          <SplitterResizeHandle v-if="showSidebar && showEditor" />
          <SplitterPanel v-if="showEditor" ref="editorPanel" id="editor" :order="2" :default-size="sizes[1]" :min-size="20">
            <div :style="panelStyle">Editor</div>
          </SplitterPanel>
        </SplitterGroup>
      </div>
    `,
  }),
}

export const Nested: Story = {
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup direction="horizontal" style="height: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    <SplitterPanel :default-size="30" :min-size="20">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">File tree</div>
    </SplitterPanel>
    <SplitterResizeHandle />
    <SplitterPanel :default-size="70" :min-size="40">
      <SplitterGroup direction="vertical" style="height: 100%;">
        <SplitterPanel :default-size="70" :min-size="20">
          <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Editor</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="30" :min-size="15">
          <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Terminal</div>
        </SplitterPanel>
      </SplitterGroup>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup direction="horizontal" style="height:100%;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <SplitterPanel :default-size="30" :min-size="20">
          <div :style="panelStyle">File tree</div>
        </SplitterPanel>
        <SplitterResizeHandle />
        <SplitterPanel :default-size="70" :min-size="40">
          <SplitterGroup direction="vertical" style="height:100%;">
            <SplitterPanel :default-size="70" :min-size="20">
              <div :style="panelStyle">Editor</div>
            </SplitterPanel>
            <SplitterResizeHandle />
            <SplitterPanel :default-size="30" :min-size="15">
              <div :style="panelStyle">Terminal</div>
            </SplitterPanel>
          </SplitterGroup>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
}

export const CustomStyles: Story = {
  args: { direction: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'
</script>

<template>
  <SplitterGroup
    direction="horizontal"
    :class-names="{ group: 'border-2 border-blue-500 rounded-lg' }"
    style="height: 400px; overflow: hidden;"
  >
    <SplitterPanel :default-size="50" :min-size="20" :class-names="{ panel: 'bg-blue-50' }">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Left panel</div>
    </SplitterPanel>
    <SplitterResizeHandle :class-names="{ handle: 'bg-blue-600', handleBar: 'bg-blue-400' }" />
    <SplitterPanel :default-size="50" :min-size="20" :class-names="{ panel: 'bg-slate-50' }">
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; align-items: center; justify-content: center;">Right panel</div>
    </SplitterPanel>
  </SplitterGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SplitterGroup, SplitterPanel, SplitterResizeHandle },
    setup: () => ({ args, panelStyle }),
    template: `
      <SplitterGroup
        v-bind="args"
        :class-names="{ group: 'border-2 border-blue-500 rounded-lg' }"
        style="height:100%;overflow:hidden;"
      >
        <SplitterPanel :default-size="50" :min-size="20" :class-names="{ panel: 'bg-blue-50' }">
          <div :style="panelStyle">Left panel</div>
        </SplitterPanel>
        <SplitterResizeHandle :class-names="{ handle: 'bg-blue-600', handleBar: 'bg-blue-400' }" />
        <SplitterPanel :default-size="50" :min-size="20" :class-names="{ panel: 'bg-slate-50' }">
          <div :style="panelStyle">Right panel</div>
        </SplitterPanel>
      </SplitterGroup>
    `,
  }),
  name: 'Custom styles via classNames',
}
