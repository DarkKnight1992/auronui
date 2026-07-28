import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  it("ArrowRight re-confirming an already-selected option does not truncate a deeper selection", async () => {
    const onValueChange = vi.fn();
    render(
      <Cascader
        items={regions}
        getKey={(i) => i.id}
        getChildren={(i) => i.children}
        label="Region"
        value={["ca", "sf"]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    const caButton = screen.getByText("California").closest("button") as HTMLElement;
    caButton.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });

  it("ArrowRight on a genuinely different option (that also has children) still truncates deeper selections", async () => {
    const twoParentRegions: RegionNode[] = [
      {
        id: "ca",
        label: "California",
        children: [
          { id: "sf", label: "San Francisco" },
          { id: "la", label: "Los Angeles" },
        ],
      },
      {
        id: "ny",
        label: "New York",
        children: [
          { id: "nyc", label: "New York City" },
          { id: "buf", label: "Buffalo" },
        ],
      },
    ];
    const onValueChange = vi.fn();
    render(
      <Cascader
        items={twoParentRegions}
        getKey={(i) => i.id}
        getChildren={(i) => i.children}
        label="Region"
        value={["ca", "sf"]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    const nyButton = screen.getByText("New York").closest("button") as HTMLElement;
    nyButton.focus();
    await userEvent.keyboard("{ArrowRight}");
    // New York is a different option than the currently-selected California,
    // so ArrowRight commits it — correctly truncating the previously
    // selected deeper "sf" value.
    expect(onValueChange).toHaveBeenCalledWith(["ny"]);
  });

  it("selecting a leaf option restores focus to the trigger button when the panel closes", async () => {
    renderCascader();
    const trigger = screen.getByRole("button", { name: "Region" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("New York"));
    // "New York" still appears once as the trigger's own display value —
    // assert the panel's option specifically is gone, not all instances of
    // the text.
    expect(screen.queryByRole("option", { name: "New York" })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("pressing Escape closes the panel and restores focus to the trigger button", async () => {
    renderCascader();
    const trigger = screen.getByRole("button", { name: "Region" });
    await userEvent.click(trigger);
    const caButton = screen.getByText("California").closest("button") as HTMLElement;
    caButton.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByText("California")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("each cascader column has role listbox and each item has role option with aria-selected wired to the active item", async () => {
    renderCascader();
    await userEvent.click(screen.getByRole("button", { name: "Region" }));
    const listboxes = screen.getAllByRole("listbox");
    expect(listboxes.length).toBeGreaterThan(0);
    const caOption = screen.getByRole("option", { name: "California" });
    expect(caOption).toHaveAttribute("aria-selected", "false");
    expect(caOption).not.toHaveAttribute("data-active");

    await userEvent.click(caOption);
    const caOptionAfter = screen.getByRole("option", { name: "California" });
    expect(caOptionAfter).toHaveAttribute("aria-selected", "true");
    expect(caOptionAfter).toHaveAttribute("data-active", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Cascader items={regions} getKey={(i) => i.id} getChildren={(i) => i.children} label="Region" />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
