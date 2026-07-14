import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@auronui/react";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    isDisabled: { control: "boolean" },
    showSteps: { control: "boolean" },
    hideValue: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    isDisabled: false,
    showSteps: false,
    hideValue: false,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: (args) => <Slider {...args} defaultValue={50} style={{ maxWidth: 400 }} />,
};

export const Range: Story = {
  args: { min: 0, max: 100 },
  render: (args) => <Slider {...args} defaultValue={[20, 80]} label="Price range" style={{ maxWidth: 400 }} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
      <Slider {...args} defaultValue={30} size="sm" label="Small" min={0} max={100} />
      <Slider {...args} defaultValue={50} size="md" label="Medium" min={0} max={100} />
      <Slider {...args} defaultValue={70} size="lg" label="Large" min={0} max={100} />
    </div>
  ),
};

export const Colors: Story = {
  parameters: { controls: { exclude: ["color"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
      <Slider {...args} defaultValue={40} color="primary" label="Primary" min={0} max={100} />
      <Slider {...args} defaultValue={50} color="secondary" label="Secondary" min={0} max={100} />
      <Slider {...args} defaultValue={55} color="accent" label="Accent" min={0} max={100} />
      <Slider {...args} defaultValue={60} color="success" label="Success" min={0} max={100} />
      <Slider {...args} defaultValue={70} color="warning" label="Warning" min={0} max={100} />
      <Slider {...args} defaultValue={80} color="danger" label="Danger" min={0} max={100} />
    </div>
  ),
};

export const WithSteps: Story = {
  args: { min: 0, max: 100, step: 10, showSteps: true },
  render: (args) => <Slider {...args} defaultValue={40} label="Brightness" style={{ maxWidth: 400 }} />,
};

export const WithMarks: Story = {
  args: { min: 0, max: 100 },
  render: (args) => (
    <Slider
      {...args}
      defaultValue={50}
      label="Progress"
      marks={[
        { value: 25, label: "1/4" },
        { value: 50, label: "1/2" },
        { value: 75, label: "3/4" },
      ]}
      style={{ maxWidth: 400 }}
    />
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", min: 0, max: 100 },
  render: (args) => <Slider {...args} defaultValue={50} label="Level" style={{ height: 200 }} />,
};

export const DisabledState: Story = {
  args: { isDisabled: true, min: 0, max: 100 },
  render: (args) => <Slider {...args} defaultValue={40} label="Disabled slider" style={{ maxWidth: 400 }} />,
};

export const StartEndContent: Story = {
  args: { min: 0, max: 100 },
  render: (args) => (
    <Slider
      {...args}
      defaultValue={50}
      label="Volume"
      style={{ maxWidth: 440 }}
      startContent={<span style={{ fontSize: 18 }}>🔇</span>}
      endContent={<span style={{ fontSize: 18 }}>🔊</span>}
    />
  ),
};

export const Controlled: Story = {
  name: "Controlled (value/onValueChange)",
  render: (args) => {
    function ControlledSlider() {
      const [value, setValue] = useState(50);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <Slider {...args} value={value} onValueChange={(v) => setValue(v as number)} label="Volume" style={{ maxWidth: 400 }} />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value}</p>
        </div>
      );
    }
    return <ControlledSlider />;
  },
};
