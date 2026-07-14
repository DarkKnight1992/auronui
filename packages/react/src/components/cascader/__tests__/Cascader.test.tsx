import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Cascader } from "../Cascader";

interface RegionNode {
  id: string;
  label: string;
  children?: RegionNode[];
}

const regions: RegionNode[] = [
  {
    id: "ca",
    label: "California",
    children: [
      { id: "sf", label: "San Francisco" },
      { id: "la", label: "Los Angeles" },
    ],
  },
  { id: "ny", label: "New York" },
];

function renderCascader(onValueChange = vi.fn()) {
  render(
    <Cascader
      items={regions}
      getKey={(i) => i.id}
      getChildren={(i) => i.children}
      label="Region"
      onValueChange={onValueChange}
    />,
  );
  return onValueChange;
}

describe("Cascader", () => {
  it("opens the panel and shows root column items on trigger click", async () => {
    renderCascader();
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    expect(screen.getByText("California")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("selecting a parent with children opens a second column, selecting a leaf closes the panel and commits value", async () => {
    const onValueChange = renderCascader();
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    await userEvent.click(screen.getByText("California"));
    expect(screen.getByText("San Francisco")).toBeInTheDocument();

    await userEvent.click(screen.getByText("San Francisco"));
    expect(onValueChange).toHaveBeenCalledWith(["ca", "sf"]);
    expect(screen.queryByText("New York")).not.toBeInTheDocument();
  });

  it("ArrowRight on an item with children selects and drills into it", async () => {
    const onValueChange = renderCascader();
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    const caButton = screen.getByText("California").closest("button") as HTMLElement;
    caButton.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(["ca"]);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Cascader items={regions} getKey={(i) => i.id} getChildren={(i) => i.children} label="Region" />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
