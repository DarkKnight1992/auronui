import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";

describe("ButtonGroup", () => {
  it("renders its children buttons", () => {
    render(
      <ButtonGroup>
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });

  it("renders buttons from the shorthand `buttons` array", () => {
    render(<ButtonGroup buttons={[{ label: "One", value: 1 }, { label: "Two", value: 2 }]} />);
    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
  });

  it("single-selection mode: clicking a button selects it and clicking again deselects it", async () => {
    render(
      <ButtonGroup selectionMode="single">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>,
    );
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });

    expect(a.getAttribute("data-selected")).not.toBe("true");
    await userEvent.click(a);
    expect(a.getAttribute("data-selected")).toBe("true");
    expect(b.getAttribute("data-selected")).not.toBe("true");

    await userEvent.click(a);
    expect(a.getAttribute("data-selected")).not.toBe("true");
  });

  it("single-selection mode: selecting a new button deselects the previous one", async () => {
    render(
      <ButtonGroup selectionMode="single">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>,
    );
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });

    await userEvent.click(a);
    await userEvent.click(b);
    expect(a.getAttribute("data-selected")).not.toBe("true");
    expect(b.getAttribute("data-selected")).toBe("true");
  });

  it("multiple-selection mode: allows several buttons selected simultaneously", async () => {
    render(
      <ButtonGroup selectionMode="multiple">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>,
    );
    const a = screen.getByRole("button", { name: "A" });
    const b = screen.getByRole("button", { name: "B" });

    await userEvent.click(a);
    await userEvent.click(b);
    expect(a.getAttribute("data-selected")).toBe("true");
    expect(b.getAttribute("data-selected")).toBe("true");
  });

  it("supports controlled value via onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <ButtonGroup selectionMode="single" value={null} onValueChange={onValueChange}>
        <Button value="a">A</Button>
      </ButtonGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onValueChange).toHaveBeenCalledWith("a");
    // controlled: value prop unchanged (still null), so DOM should not reflect selection
    expect(screen.getByRole("button", { name: "A" }).getAttribute("data-selected")).not.toBe("true");
  });

  it("group disabled propagates to child buttons", () => {
    render(
      <ButtonGroup isDisabled>
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "A" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ButtonGroup>
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
