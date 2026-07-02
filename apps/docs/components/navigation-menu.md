---
title: NavigationMenu
---

<script setup>
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport, NavigationMenuIndicator,
} from '@auronui/vue';
</script>

# NavigationMenu

`NavigationMenu` is a horizontal top-level site navigation bar with hoverable/clickable flyout
panels, wrapping Reka UI's `NavigationMenu` primitive family. Unlike Auron's other menu-family
components (`Dropdown`, `ContextMenu`, `Menubar`), its flyout content is not positioned via
floating-ui — instead, an optional shared `NavigationMenuViewport` displays whichever panel is
currently active, sized and positioned from measurements Reka computes and exposes as CSS custom
properties. `NavigationMenuLink` reuses the same styling as the standalone `Link` component.

## Default

<div class="docs-example">
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
</div>

```vue-html
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
```

## With an active-trigger indicator

<div class="docs-example">
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
          <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="company">
        <NavigationMenuTrigger>Company</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
          <NavigationMenuLink href="/careers">Careers</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuIndicator />
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
</div>

```vue-html
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="products">
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
        <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem value="company">
      <NavigationMenuTrigger>Company</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/about">About</NavigationMenuLink>
        <NavigationMenuLink href="/careers">Careers</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuIndicator />
  </NavigationMenuList>
  <NavigationMenuViewport />
</NavigationMenu>
```

## Marking the active page

<div class="docs-example">
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem value="home">
        <NavigationMenuLink href="/" :active="true">Home</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem value="docs">
        <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
</div>

```vue-html
<NavigationMenuList>
  <NavigationMenuItem value="home">
    <NavigationMenuLink href="/" :active="true">Home</NavigationMenuLink>
  </NavigationMenuItem>
  <NavigationMenuItem value="docs">
    <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
  </NavigationMenuItem>
</NavigationMenuList>
```

## Props

<PropsTable name="NavigationMenu" />

## Slots

<SlotsTable name="NavigationMenu" />

## Events

<EventsTable name="NavigationMenu" />

## Accessibility

`NavigationMenu` is built on Reka UI's `NavigationMenu` primitive family.

- **Role.** The root renders a real `<nav>` element. Triggers are real `<button>` elements with
  `aria-expanded` and `aria-controls` pointing at their flyout's content id. Plain items and
  flyout-panel links (`NavigationMenuLink`) render real `<a>` elements.
- **Keyboard.** `ArrowRight`/`ArrowLeft` (or `ArrowDown`/`ArrowUp` for vertical orientation) move
  focus between top-level triggers. `Enter`/`Space` on a focused trigger opens or closes its
  flyout. Within an open flyout, `Escape` closes it and returns focus to its trigger; `Tab` moves
  focus out of the flyout entirely (matching native site-navigation expectations, not menu-style
  focus trapping).
- **Pointer.** Triggers open on click (the primary, always-enabled interaction) and can also open
  on hover, gated by a short delay (`delayDuration`, default 200ms) to avoid accidentally opening
  flyouts while moving the pointer across the bar; set `disableHoverTrigger` to opt out of
  hover-opening entirely.
- **Active page.** Pass `active` to `NavigationMenuLink` to mark it as the current page —
  reflected as `aria-current="page"` and a `data-active` attribute for styling.
