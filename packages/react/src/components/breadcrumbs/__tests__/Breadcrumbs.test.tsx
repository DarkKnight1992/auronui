import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Breadcrumbs, BreadcrumbItem } from "../index";

describe("Breadcrumbs", () => {
  it('renders <nav aria-label="Breadcrumb">', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders <ol class=breadcrumbs>", () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(container.querySelector("ol.breadcrumbs")).toBeInTheDocument();
  });

  it('last item has aria-current="page"', () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
        <BreadcrumbItem>C</BreadcrumbItem>
      </Breadcrumbs>,
    );
    const items = container.querySelectorAll("li.breadcrumbs__item");
    expect(items[items.length - 1].getAttribute("aria-current")).toBe("page");
    expect(items[0].getAttribute("aria-current")).toBeNull();
  });

  it("separator span has aria-hidden=true", () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem>B</BreadcrumbItem>
      </Breadcrumbs>,
    );
    const seps = container.querySelectorAll("span.breadcrumbs__separator");
    expect(seps.length).toBeGreaterThan(0);
    seps.forEach((s) => expect(s.getAttribute("aria-hidden")).toBe("true"));
  });

  it("maxItems truncates: shows first + ellipsis + last(max-2) via shorthand items", () => {
    const { container } = render(
      <Breadcrumbs
        maxItems={3}
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
          { label: "5" },
        ]}
      />,
    );
    const items = container.querySelectorAll("li.breadcrumbs__item");
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain("1");
    expect(items[1].textContent).toContain("…");
    expect(items[2].textContent).toContain("5");
  });

  it("shorthand items API renders all items when maxItems is not set", () => {
    const { container } = render(
      <Breadcrumbs
        items={[{ label: "1", href: "/1" }, { label: "2", href: "/2" }, { label: "3" }]}
      />,
    );
    expect(container.querySelectorAll("li.breadcrumbs__item").length).toBe(3);
  });

  it("custom separator prop overrides the default chevron", () => {
    render(
      <Breadcrumbs separator=">">
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem>B</BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getAllByText(">").length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/a">Home</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">Library</BreadcrumbItem>
        <BreadcrumbItem>Data</BreadcrumbItem>
      </Breadcrumbs>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
