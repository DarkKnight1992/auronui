import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from "../index";

function BasicTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return (
    <Tabs defaultValue="one" {...props}>
      <TabList>
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders the default tab as selected", () => {
    render(<BasicTabs />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel one")).toBeInTheDocument();
  });

  it("sets data-state=\"active\" only on the selected tab (tabs.css's selected-tab text/opacity styling is gated on this)", async () => {
    render(<BasicTabs />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Two" })).not.toHaveAttribute("data-state");

    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "One" })).not.toHaveAttribute("data-state");
  });

  it("switches tabs on click", async () => {
    render(<BasicTabs />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel two")).toBeInTheDocument();
  });

  it("fires onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<BasicTabs onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
  });

  it("supports keyboard navigation with arrow keys", async () => {
    render(<BasicTabs />);
    const first = screen.getByRole("tab", { name: "One" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });

  it("renders the shorthand items API", () => {
    render(
      <Tabs
        items={[
          { value: "a", label: "A", content: "A content" },
          { value: "b", label: "B", content: "B content" },
        ]}
      />,
    );
    expect(screen.getByRole("tab", { name: "A" })).toBeInTheDocument();
    expect(screen.getByText("A content")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<BasicTabs />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("renders TabIndicator (as a sibling of TabList) without crashing, portaled into the tablist", async () => {
    render(
      <Tabs defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabIndicator />
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    const tablist = screen.getByRole("tablist");
    // The indicator must be a genuine DOM descendant of the tablist (portaled
    // there) — tabs.css positions it with `position: absolute` relative to
    // .tabs__list itself, not some other ancestor.
    expect(tablist.querySelector(".tabs__indicator")).not.toBeNull();

    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  });
});
