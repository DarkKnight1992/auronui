import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "@auronui/react";

const meta: Meta<typeof SplitterGroup> = {
  title: "Components/Splitter",
  component: SplitterGroup,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["horizontal", "vertical"] },
    keyboardResizeBy: { control: "number" },
  },
  args: {
    direction: "horizontal",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, height: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SplitterGroup>;

const panelStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  padding: 16,
  fontFamily: "sans-serif",
  fontSize: 13,
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const Horizontal: Story = {
  args: { direction: "horizontal" },
  render: (args) => (
    <SplitterGroup {...args} style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <SplitterPanel defaultSize={50} minSize={20}>
        <div style={panelStyle}>Left panel</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={50} minSize={20}>
        <div style={panelStyle}>Right panel</div>
      </SplitterPanel>
    </SplitterGroup>
  ),
};

export const Vertical: Story = {
  args: { direction: "vertical" },
  render: (args) => (
    <SplitterGroup {...args} style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <SplitterPanel defaultSize={50} minSize={20}>
        <div style={panelStyle}>Top panel</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={50} minSize={20}>
        <div style={panelStyle}>Bottom panel</div>
      </SplitterPanel>
    </SplitterGroup>
  ),
};

export const ThreePanels: Story = {
  args: { direction: "horizontal" },
  render: (args) => (
    <SplitterGroup {...args} style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <SplitterPanel defaultSize={25} minSize={15}>
        <div style={panelStyle}>Sidebar</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={50} minSize={20}>
        <div style={panelStyle}>Main content</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={25} minSize={15}>
        <div style={panelStyle}>Inspector</div>
      </SplitterPanel>
    </SplitterGroup>
  ),
};

export const Collapsible: Story = {
  args: { direction: "horizontal" },
  render: (args) => (
    <SplitterGroup {...args} style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <SplitterPanel defaultSize={25} minSize={15} collapsible collapsedSize={0}>
        <div style={panelStyle}>Collapsible sidebar (drag to collapse)</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={75} minSize={40}>
        <div style={panelStyle}>Main content</div>
      </SplitterPanel>
    </SplitterGroup>
  ),
};

export const Nested: Story = {
  args: { direction: "horizontal" },
  render: () => (
    <SplitterGroup direction="horizontal" style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <SplitterPanel defaultSize={30} minSize={20}>
        <div style={panelStyle}>File tree</div>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel defaultSize={70} minSize={40}>
        <SplitterGroup direction="vertical" style={{ height: "100%" }}>
          <SplitterPanel defaultSize={70} minSize={20}>
            <div style={panelStyle}>Editor</div>
          </SplitterPanel>
          <SplitterResizeHandle />
          <SplitterPanel defaultSize={30} minSize={15}>
            <div style={panelStyle}>Terminal</div>
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  ),
};
