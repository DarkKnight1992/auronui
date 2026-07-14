import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Sidebar } from "../index";
import type { SidebarSectionData } from "../Sidebar.types";

const sections: SidebarSectionData[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/intro" },
      { label: "Installation", href: "/install" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      {
        label: "Forms",
        items: [{ label: "Select", href: "/components/select" }],
      },
    ],
  },
];

describe("Sidebar — core", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it('renders <nav aria-label="Sidebar"> by default', () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByRole("navigation", { name: "Sidebar" })).toBeInTheDocument();
  });

  it("renders a custom ariaLabel", () => {
    render(<Sidebar sections={sections} ariaLabel="Docs navigation" />);
    expect(screen.getByRole("navigation", { name: "Docs navigation" })).toBeInTheDocument();
  });

  it("renders all sections with their headings", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("renders all top-level and nested links", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByRole("link", { name: "Introduction" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Select" })).toBeInTheDocument();
  });

  it('controlled activeHref sets aria-current="page" on the matching link only', () => {
    render(<Sidebar sections={sections} activeHref="/components/button" />);
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Introduction" })).not.toHaveAttribute("aria-current");
  });

  it("does not render a search box by default", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("renders a search box when search is true", () => {
    render(<Sidebar sections={sections} search />);
    expect(screen.getByRole("searchbox", { name: "Search sidebar links" })).toBeInTheDocument();
  });

  it("filters sections by search query, keeping the whole matching branch visible", async () => {
    render(<Sidebar sections={sections} search />);
    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "select");
    expect(screen.getByRole("link", { name: "Select" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Introduction" })).not.toBeInTheDocument();
  });

  it('shows "No results found" when the search query matches nothing', async () => {
    render(<Sidebar sections={sections} search />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzzz");
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders children content when sections is not provided", () => {
    render(
      <Sidebar>
        <div className="custom-content">custom</div>
      </Sidebar>,
    );
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("a toggle button with children collapses/expands the nested list", async () => {
    render(<Sidebar sections={sections} />);
    const toggle = screen.getByRole("button", { name: "Forms" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Select" })).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Select" })).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Sidebar sections={sections} search />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
