import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableEditTrigger,
  EditableSubmitTrigger,
  EditableCancelTrigger,
} from "@auronui/react";

const meta: Meta = {
  title: "Components/Editable",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Editable defaultValue="Click to edit">
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
    </Editable>
  ),
};

export const WithTriggers: Story = {
  render: () => (
    <Editable defaultValue="Hover then click the pencil" activationMode="none">
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableEditTrigger />
      <EditableSubmitTrigger />
      <EditableCancelTrigger />
    </Editable>
  ),
};

export const DoubleClickToEdit: Story = {
  render: () => (
    <Editable defaultValue="Double-click to edit" activationMode="dblclick">
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
    </Editable>
  ),
};

export const SubmitOnEnter: Story = {
  render: () => (
    <Editable defaultValue="Press Enter to submit" submitMode="enter">
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
    </Editable>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Editable defaultValue="Cannot edit this" isDisabled>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableEditTrigger />
    </Editable>
  ),
};
