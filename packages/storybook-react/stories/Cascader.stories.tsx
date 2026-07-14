import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cascader } from "@auronui/react";

interface LocationNode {
  value: string;
  label: string;
  children?: LocationNode[];
}

const locations: LocationNode[] = [
  {
    value: "ca",
    label: "California",
    children: [
      { value: "sf", label: "San Francisco" },
      { value: "la", label: "Los Angeles" },
      { value: "sd", label: "San Diego" },
    ],
  },
  {
    value: "ny",
    label: "New York",
    children: [
      { value: "nyc", label: "New York City" },
      { value: "buf", label: "Buffalo" },
    ],
  },
  {
    value: "tx",
    label: "Texas",
    children: [
      { value: "aus", label: "Austin" },
      { value: "hou", label: "Houston" },
    ],
  },
];

const meta: Meta<typeof Cascader<LocationNode>> = {
  title: "Form/Cascader",
  component: Cascader,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    separator: { control: "text" },
    variant: { control: "select", options: ["flat", "bordered", "faded", "underlined", "raised"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    placeholder: "Select a location",
    variant: "flat",
    color: "default",
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof Cascader<LocationNode>>;

export const Default: Story = {
  args: { label: "Location" },
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string[]>([]);
      return (
        <div style={{ width: 280 }}>
          <Cascader
            {...args}
            items={locations}
            getKey={(i) => i.value}
            getChildren={(i) => i.children}
            value={selected}
            onValueChange={setSelected}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Preselected: Story = {
  name: "With an initial value",
  args: { label: "Location" },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Cascader
        {...args}
        items={locations}
        getKey={(i) => i.value}
        getChildren={(i) => i.children}
        defaultValue={["ca", "sf"]}
      />
    </div>
  ),
};

export const Invalid: Story = {
  args: { label: "Location", isInvalid: true, errorMessage: "Please choose a location", isRequired: true },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Cascader {...args} items={locations} getKey={(i) => i.value} getChildren={(i) => i.children} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 280 }}>
      {(["primary", "secondary", "accent", "success", "warning", "danger"] as const).map((c) => (
        <Cascader
          key={c}
          color={c}
          variant="bordered"
          label={`${c[0].toUpperCase()}${c.slice(1)} (open me)`}
          items={locations}
          getKey={(i) => i.value}
          getChildren={(i) => i.children}
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: "Location", isDisabled: true },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Cascader
        {...args}
        items={locations}
        getKey={(i) => i.value}
        getChildren={(i) => i.children}
        defaultValue={["ca"]}
      />
    </div>
  ),
};
