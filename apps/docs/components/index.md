---
title: Components
---

# Components

Auron ships 85 components total, built on top of Reka UI primitives.
The list below covers every component shipped today (Phase 1 presentational set + Phase 2
Reka UI–backed set). Pages for the remaining components will appear here as their phases
complete.

## All components

- [Badge](./badge) — Inline status pip for counts, labels, and notifications.
- [Button](./button) — Primary action element with eleven variants, three sizes, loading and disabled states.
- [ButtonGroup](./button-group) — Segments related buttons and broadcasts shared variant, size, and disabled state.
- [Card](./card) — Surface with optional `CardHeader`, `CardBody`, and `CardFooter` regions for grouped content.
- [Cascader](./cascader) — Multi-column cascading selector for hierarchical data, built on `Popover`.
- [Chip](./chip) — Compact dismissible token used for tags, filters, and selections.
- [CloseButton](./close-button) — Icon-only dismissal button with built-in `aria-label` and group integration.
- [CommandPalette](./command-palette) — Searchable, keyboard-driven command menu (`Modal` + `ListBox`).
- [Description](./description) — Long-form helper text paired with form fields and headings.
- [EmptyState](./empty-state) — Compose `EmptyState` + `EmptyStateContent` to fill empty list and search views.
- [FileUpload](./file-upload) — Click-to-browse file input with a drag-and-drop dropzone.
- [FormFieldArray](./form-field-array) — Repeatable field groups inside a `Form` — add, remove, insert, and reorder rows.
- [Header](./header) — Section heading typography that stays visually consistent across surfaces.
- [Image](./image) — Lazy-loaded image with load-state fallback and optional zoom lightbox.
- [InputGroup](./input-group) — Bordered field box for merging icons, buttons, and an input into one unit.
- [Kbd](./kbd) — Renders keyboard shortcuts and key combinations.
- [Label](./label) — Accessible form label that pairs with inputs via `for`/`id`.
- [Link](./link) — Anchor element styled to Auron's typography ramp, supports external link semantics.
- [SearchField](./search-field) — Dedicated search/filter input with a built-in clear button.
- [Separator](./separator) — Horizontal or vertical divider with proper ARIA semantics.
- [Sidebar](./sidebar) — Vertical navigation with grouped sections, search, and active-link detection.
- [Skeleton](./skeleton) — Pulse placeholder used while content is loading.
- [Spinner](./spinner) — Indeterminate progress indicator in three sizes.
- [Statistic](./statistic) — Label/value display for KPIs and dashboards, with optional trend indicator.
- [Surface](./surface) — Background-aware container that provides theming context to descendants.
- [Text](./text) — Polymorphic typography primitive for body copy, captions, and inline labels.
- [Timeline](./timeline) — Compound `Timeline` + `TimelineItem` list for chronological events.
- [Transfer](./transfer) — Dual-listbox control for moving items between two panels.
