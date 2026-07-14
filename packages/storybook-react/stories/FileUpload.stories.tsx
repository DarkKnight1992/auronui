import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "@auronui/react";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    maxFiles: { control: "number" },
  },
  args: {
    multiple: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    label: "Upload a file",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
};

export const Multiple: Story = {
  args: {
    label: "Upload files",
    multiple: true,
    maxFiles: 5,
    description: "Up to 5 files.",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
};

export const AcceptImages: Story = {
  name: "accept + maxSize",
  args: {
    label: "Upload an image",
    accept: "image/*",
    maxSizeBytes: 2 * 1024 * 1024,
    description: "Images only, up to 2MB.",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    label: "Upload a file",
    isInvalid: true,
    errorMessage: "This file type is not supported.",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Upload a file",
    isDisabled: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FileUpload {...args} />
    </div>
  ),
};
