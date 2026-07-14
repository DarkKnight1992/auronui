import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup } from "@auronui/react";

const meta: Meta<typeof ToggleButton> = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [pressed, setPressed] = useState(false);
      return (
        <div>
          <ToggleButton pressed={pressed} onPressedChange={setPressed} aria-label="Toggle bold">
            Bold
          </ToggleButton>
          <p style={{ marginTop: 8, fontSize: 12 }}>pressed: {String(pressed)}</p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Pressed: Story = {
  render: () => {
    function Demo() {
      const [pressed, setPressed] = useState(true);
      return (
        <div>
          <ToggleButton pressed={pressed} onPressedChange={setPressed} aria-label="Toggle bold">
            Bold (starts pressed)
          </ToggleButton>
          <p style={{ marginTop: 8, fontSize: 12 }}>pressed: {String(pressed)}</p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <ToggleButton isDisabled aria-label="Disabled unpressed">
        Disabled
      </ToggleButton>
      <ToggleButton isDisabled pressed aria-label="Disabled pressed">
        Disabled + Pressed
      </ToggleButton>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => {
    function Demo() {
      const [b, setB] = useState(false);
      const [i, setI] = useState(false);
      const [u, setU] = useState(false);
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <ToggleButton pressed={b} onPressedChange={setB} isIconOnly aria-label="Bold">
            B
          </ToggleButton>
          <ToggleButton pressed={i} onPressedChange={setI} isIconOnly aria-label="Italic">
            I
          </ToggleButton>
          <ToggleButton pressed={u} onPressedChange={setU} isIconOnly aria-label="Underline">
            U
          </ToggleButton>
        </div>
      );
    }
    return <Demo />;
  },
};

export const GroupSingleSelection: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState("left");
      return (
        <div>
          <ToggleButtonGroup
            selectionMode="single"
            value={selected}
            onValueChange={(v) => setSelected(v as string)}
            orientation="horizontal"
          >
            <ToggleButton value="left" aria-label="Left align">
              Left
            </ToggleButton>
            <ToggleButton value="center" aria-label="Center align">
              Center
            </ToggleButton>
            <ToggleButton value="right" aria-label="Right align">
              Right
            </ToggleButton>
          </ToggleButtonGroup>
          <p style={{ marginTop: 8, fontSize: 12 }}>selected: {selected}</p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const GroupMultipleSelection: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string[]>(["bold"]);
      return (
        <div>
          <ToggleButtonGroup
            selectionMode="multiple"
            value={selected}
            onValueChange={(v) => setSelected(v as string[])}
            orientation="horizontal"
          >
            <ToggleButton value="bold" aria-label="Bold">
              B
            </ToggleButton>
            <ToggleButton value="italic" aria-label="Italic">
              I
            </ToggleButton>
            <ToggleButton value="underline" aria-label="Underline">
              U
            </ToggleButton>
            <ToggleButton value="strikethrough" aria-label="Strikethrough">
              S
            </ToggleButton>
          </ToggleButtonGroup>
          <p style={{ marginTop: 8, fontSize: 12 }}>selected: {selected.join(", ")}</p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const GroupDisabled: Story = {
  render: () => {
    function Demo() {
      const [disabled, setDisabled] = useState(false);
      const [selected, setSelected] = useState("a");
      return (
        <div>
          <Button variant="ghost" style={{ marginBottom: 16 }} onClick={() => setDisabled((d) => !d)}>
            Toggle Group Disabled (currently: {String(disabled)})
          </Button>
          <ToggleButtonGroup
            selectionMode="single"
            value={selected}
            onValueChange={(v) => setSelected(v as string)}
            isDisabled={disabled}
          >
            <ToggleButton value="a" aria-label="Option A">
              Option A
            </ToggleButton>
            <ToggleButton value="b" aria-label="Option B">
              Option B
            </ToggleButton>
            <ToggleButton value="c" aria-label="Option C" isDisabled={false}>
              Child not disabled
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      );
    }
    return <Demo />;
  },
};

export const GroupArrayAPI: Story = {
  name: "Group: Array API (buttons prop)",
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<string[]>(["bold"]);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ToggleButtonGroup
            value={selected}
            onValueChange={(v) => setSelected(v as string[])}
            selectionMode="multiple"
            buttons={[
              { value: "bold", label: "Bold" },
              { value: "italic", label: "Italic" },
              { value: "underline", label: "Underline" },
              { value: "strike", label: "Strike", disabled: true },
            ]}
          />
        </div>
      );
    }
    return <Demo />;
  },
};
