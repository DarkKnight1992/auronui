# @auronui/styles

Core styles for Auron UI — CSS layers, theme variables, component styles, and Tailwind CSS variants for all 85+ components.

This package is framework-agnostic. It provides the visual foundation consumed by `@auronui/vue` (and future `@auronui/react` / `@auronui/angular` packages).

## Installation

```bash
pnpm add @auronui/styles
```

## Usage

Import the full stylesheet in your app entry:

```css
@import "@auronui/styles";
```

Or import individual component styles:

```css
@import "@auronui/styles/components/button.css" layer(components);
@import "@auronui/styles/components/chip.css" layer(components);
@import "@auronui/styles/themes.css" layer(base);
```

## Structure

```
@auronui/styles/
  index.css              # Full bundle (base + themes + components + variants)
  base/base.css          # CSS reset and base layer
  themes/default/        # Default theme variables
  components/            # Per-component CSS (button.css, card.css, …)
  variants/              # Tailwind CSS custom variant definitions
  src/                   # TypeScript tailwind-variants slot definitions
```

## Theming

Override CSS custom properties to customise the design tokens:

```css
:root {
  --auron-primary: oklch(55% 0.2 262);
  --auron-radius-medium: 0.5rem;
}
```

## License

MIT
