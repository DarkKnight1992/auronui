import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Editable } from "../Editable";
import { EditableArea } from "../EditableArea";
import { EditablePreview } from "../EditablePreview";
import { EditableInput } from "../EditableInput";
import { EditableEditTrigger } from "../EditableEditTrigger";
import { EditableSubmitTrigger } from "../EditableSubmitTrigger";
import { EditableCancelTrigger } from "../EditableCancelTrigger";

function BasicEditable(props: ComponentProps<typeof Editable>) {
  return (
    <Editable defaultValue="Hello" {...props}>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableEditTrigger />
      <EditableSubmitTrigger />
      <EditableCancelTrigger />
    </Editable>
  );
}

describe("Editable", () => {
  it("renders the preview by default and switches to the input via the edit trigger", async () => {
    render(<BasicEditable />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
  });

  it("commits the value on submit", async () => {
    const onSubmit = vi.fn();
    render(<BasicEditable onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByDisplayValue("Hello");
    await userEvent.clear(input);
    await userEvent.type(input, "World");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith("World");
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("reverts the value on cancel", async () => {
    render(<BasicEditable />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByDisplayValue("Hello");
    await userEvent.clear(input);
    await userEvent.type(input, "World");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<BasicEditable />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
