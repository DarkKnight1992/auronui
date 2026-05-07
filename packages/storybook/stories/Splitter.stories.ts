import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '@auronui/vue'

const meta: Meta<typeof SplitterGroup> = {
  title: 'Extended/Splitter',
  component: SplitterGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: {
    direction: 'horizontal',
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

export const Nested: Story = {
  args: { direction: 'horizontal' },
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
