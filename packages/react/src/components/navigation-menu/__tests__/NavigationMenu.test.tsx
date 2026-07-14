import { describe, expect, it, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuSub,
} from "../index";

beforeAll(() => {
  // jsdom doesn't implement scrollIntoView / PointerEvent capture APIs Radix touches.
  window.HTMLElement.prototype.scrollIntoView = () => {};
  if (!window.HTMLElement.prototype.hasPointerCapture) {
    window.HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = () => {};
  }
  // Radix's NavigationMenuViewport/Indicator measure via ResizeObserver,
  // which jsdom doesn't implement. There's no shared polyfill in the
  // package's vitest.setup.ts (out of scope to edit here), so stub an
  // implementation local to this suite that fires its callback once on
  // `observe()` (mirroring a real ResizeObserver's initial-observation
  // callback) so Radix's own `useResizeObserver` still runs its
  // measurement pass — needed for `NavigationMenuIndicator` to compute a
  // (possibly zero-sized, since jsdom has no real layout) position and
  // mount at all.
  if (typeof window.ResizeObserver === "undefined") {
    class ResizeObserverStub {
      #callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.#callback = callback;
      }
      observe(target: Element) {
        queueMicrotask(() => this.#callback([{ target } as ResizeObserverEntry], this));
      }
      unobserve() {}
      disconnect() {}
    }
    window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
  }
});

function BasicNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
            <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="docs">
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

describe("NavigationMenu — render", () => {
  it("renders a nav element with one trigger and one plain link", () => {
    render(<BasicNavigationMenu />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("flyout content is hidden until its trigger is clicked", () => {
    render(<BasicNavigationMenu />);
    expect(screen.queryByText("Product One")).not.toBeInTheDocument();
  });

  it("clicking a trigger opens its flyout content", async () => {
    const user = userEvent.setup();
    render(<BasicNavigationMenu />);
    await user.click(screen.getByRole("button", { name: /products/i }));
    expect(await screen.findByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
  });

  it("trigger has aria-expanded reflecting open state", async () => {
    const user = userEvent.setup();
    render(<BasicNavigationMenu />);
    const trigger = screen.getByRole("button", { name: /products/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking an open trigger again closes its flyout content", async () => {
    const user = userEvent.setup();
    render(<BasicNavigationMenu />);
    const trigger = screen.getByRole("button", { name: /products/i });
    await user.click(trigger);
    expect(await screen.findByText("Product One")).toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("NavigationMenu — links", () => {
  it("NavigationMenuLink renders a real anchor with the given href", () => {
    render(<BasicNavigationMenu />);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("NavigationMenuLink with active prop sets data-active", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="docs">
            <NavigationMenuLink href="/docs" active>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("data-active");
  });
});

describe("NavigationMenu — indicator and submenu", () => {
  it("NavigationMenuIndicator renders inside the list once a trigger is open", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuIndicator />
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>,
    );
    await user.click(screen.getByRole("button", { name: /products/i }));
    await screen.findByText("Product One");
    // The indicator's position is computed asynchronously (activeTrigger
    // effect -> ResizeObserver -> rAF), one more hop than Content's own
    // open-state update, so poll rather than checking immediately.
    await waitFor(() => {
      const indicatorEl = document.querySelector('[data-state="visible"][aria-hidden="true"]');
      expect(indicatorEl).not.toBeNull();
    });
  });

  it("NavigationMenuSub renders a nested navigation menu", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuSub>
                <NavigationMenuList>
                  <NavigationMenuItem value="sub-one">
                    <NavigationMenuLink href="/products/one">Sub Product One</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuSub>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>,
    );
    await user.click(screen.getByRole("button", { name: /products/i }));
    expect(await screen.findByRole("link", { name: "Sub Product One" })).toHaveAttribute(
      "href",
      "/products/one",
    );
  });
});

describe("NavigationMenu — keyboard", () => {
  it("ArrowRight moves focus between top-level triggers/links", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>,
    );
    const trigger = screen.getByRole("button", { name: /products/i });
    trigger.focus();
    expect(trigger).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveFocus();
  });

  it("Enter opens a focused trigger's flyout", async () => {
    const user = userEvent.setup();
    render(<BasicNavigationMenu />);
    const trigger = screen.getByRole("button", { name: /products/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Product One")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("NavigationMenu — accessibility", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(<BasicNavigationMenu />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with a flyout open", async () => {
    const user = userEvent.setup();
    render(<BasicNavigationMenu />);
    await user.click(screen.getByRole("button", { name: /products/i }));
    await screen.findByText("Product One");
    // Radix teleports open Content into the Viewport (and duplicates it,
    // presence-animated, at the trigger site during transitions) — audit the
    // whole document rather than a single container ref.
    const results = await axe.run(document.body);
    expect(results).toHaveNoViolations();
  });
});
