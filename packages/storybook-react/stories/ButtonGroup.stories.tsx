import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, ButtonGroup } from "@auronui/react";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "default", "bordered", "ghost", "soft"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
  },
  args: {
    variant: "bordered",
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const HorizontalDefault: Story = {
  render: (args) => (
    <ButtonGroup {...args} orientation="horizontal">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
};

export const VerticalGroup: Story = {
  render: (args) => (
    <ButtonGroup {...args} orientation="vertical">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
};

export const VariantPropagation: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ButtonGroup variant="solid" color="success">
        <Button>A</Button>
        <Button>B</Button>
        <Button color="danger">Override</Button>
      </ButtonGroup>
      <ButtonGroup variant="solid" color="warning">
        <Button>X</Button>
        <Button>Y</Button>
      </ButtonGroup>
    </div>
  ),
};

export const GroupDisabled: Story = {
  render: () => {
    function Demo() {
      const [disabled, setDisabled] = useState(false);
      return (
        <div>
          <Button variant="ghost" style={{ marginBottom: 16 }} onClick={() => setDisabled((d) => !d)}>
            Toggle Group Disabled (currently: {String(disabled)})
          </Button>
          <ButtonGroup isDisabled={disabled}>
            <Button>Save</Button>
            <Button>Discard</Button>
            <Button>Cancel</Button>
          </ButtonGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

export const SelectableVertical: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | number | null>("middle");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ButtonGroup
            {...args}
            orientation="vertical"
            value={selected}
            onValueChange={(v) => setSelected(v as string | number | null)}
          >
            <Button value="top">Top</Button>
            <Button value="middle">Middle</Button>
            <Button value="bottom">Bottom</Button>
          </ButtonGroup>
          <div>Selected: {selected}</div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultiSelect: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<Array<string | number>>(["bold", "italic"]);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ButtonGroup
            variant="bordered"
            selectionMode="multiple"
            value={selected}
            onValueChange={(v) => setSelected(v as Array<string | number>)}
          >
            <Button value="bold">Bold</Button>
            <Button value="italic">Italic</Button>
            <Button value="underline">Underline</Button>
            <Button value="strike">Strike</Button>
          </ButtonGroup>
          <div>Selected: {selected.join(", ") || "none"}</div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const ArrayAPI: Story = {
  name: "Array API (buttons prop)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ButtonGroup
        buttons={[
          { label: "Cut", value: "cut" },
          { label: "Copy", value: "copy" },
          { label: "Paste", value: "paste" },
        ]}
      />
      <ButtonGroup
        variant="bordered"
        buttons={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "Year", value: "year", disabled: true },
        ]}
      />
    </div>
  ),
};
