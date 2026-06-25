# Design: Unify "outline/outlined/border/bordered" → `bordered`

**Date:** 2026-06-25
**Status:** Approved

## Problem

Three different strings were used across components to mean the same thing — a transparent-background, visible-border style:

| Value | Components | Notes |
|---|---|---|
| `outline` | Button, AlertDialogAction, AlertDialogCancel | Button's current API |
| `outlined` | Chip | Chip's current API |
| `bordered` | Input family (×13), Card, Dropdown | Already canonical for 15 components |
| `border` | *(none)* | Was mentioned in docs; removed entirely |

## Decision

**Canonical value: `bordered`** — matches HeroUI React's naming and is already the majority form.

The full rename is two-layer: variant *key* in tailwind-variants AND the internal CSS class both change to `bordered`. Old values are kept as deprecated aliases at the component layer only (not in styles).

---

## Architecture

### 1. CSS rename (`packages/styles/`)

Rename the internal CSS selectors — these are not part of the public API:

- `components/button.css`: `.button--outline` → `.button--bordered`
- `components/button-group.css`: all `.button--outline` references → `.button--bordered` (2 occurrences)
- `components/chip.css`: `.chip--outlined` → `.chip--bordered`

### 2. tailwind-variants key rename (`packages/styles/src/`)

Update the variant key so the styles layer speaks only in `bordered`:

- `button.styles.ts`: `outline: { base: "button--outline" }` → `bordered: { base: "button--bordered" }`
- `chip.styles.ts`: `outlined: { base: "chip--outlined" }` → `bordered: { base: "chip--bordered" }`

No other variant keys or CSS classes change.

### 3. Shared deprecation util (`packages/vue/src/utils/`)

New file: `warnDeprecated.ts`

```ts
const warned = new Set<string>()

export function warnDeprecatedVariant(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!import.meta.env.DEV) return
  const key = `${component}:${deprecated}`
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] ${component}: variant="${deprecated}" is deprecated, use variant="${canonical}" instead.`,
  )
}
```

- DEV-gated (`import.meta.env.DEV` is `false` in production builds → tree-shaken)
- Module-level `Set` deduplicates across renders — warns once per unique component+value pair per session

Export from `packages/vue/src/utils/index.ts`.

### 4. Component normalization (`packages/vue/src/components/`)

**Button.vue**

Widen the prop type to accept `'outline'` (marked `@deprecated`). Extend the existing `LEGACY_VARIANTS` map to include `outline → bordered`. Emit the deprecation warning before resolving.

```ts
/** @deprecated Use 'bordered' instead. Will be removed in a future version. */
variant?: ButtonVariants['variant'] | 'outline'

const LEGACY_VARIANTS = {
  // existing color-aliases …
  outline: 'bordered',   // ← added
}

const resolvedVariant = computed(() => {
  const v = finalVariant.value
  if (v === 'outline') {
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    return 'bordered' as ButtonVariants['variant']
  }
  return (LEGACY_VARIANTS[v]?.variant ?? v) as ButtonVariants['variant']
})
```

**Chip.vue**

Same pattern — widen prop type with `'outlined'` (`@deprecated`), normalize before passing to `chipVariants`.

```ts
/** @deprecated Use 'bordered' instead. */
variant?: ChipVariants['variant'] | 'outlined'

const resolvedVariant = computed(() => {
  if (props.variant === 'outlined') {
    warnDeprecatedVariant('Chip', 'outlined', 'bordered')
    return 'bordered' as ChipVariants['variant']
  }
  return props.variant
})
```

**AlertDialogAction.vue / AlertDialogCancel.vue**

These components expose explicit variant unions that include `'outline'`. Replace `'outline'` with `'bordered'` in the union and add `@deprecated 'outline'`. Their normalization delegates to Button.vue (they forward the variant prop to a Button), so no separate normalization logic needed.

### 5. Internal migration

Sweep all in-repo usages and update to the canonical value:

- Storybook stories: `variant="outline"` / `variant="outlined"` → `variant="bordered"`
- Vitest tests: same
- Any example code, documentation snippets

---

## Testing

For **Button** and **Chip**, the test suite must cover:

1. `variant="bordered"` renders the correct CSS class (`button--bordered` / `chip--bordered`)
2. Deprecated value (`variant="outline"` / `variant="outlined"`) renders the **same** class as `bordered` — no visual regression
3. Deprecated value triggers `console.warn` with the expected message
4. The warning fires **once** per unique value, not on every render (spy reset between assertions)
5. `import.meta.env.DEV = false` suppresses the warning entirely

Existing axe audits require no changes (accessibility is unaffected by CSS class renaming).

---

## Out of scope

- `border` alias: never existed in code, not added
- The 15 components already using `bordered` (Input family, Card, Dropdown): no changes needed
- CSS *property* names inside `.button--bordered {}` rule bodies: untouched
- `@auronui/styles` CSS class names exposed to end-users for direct overrides: these were always internal (`button--outline` is not documented as a public API)
- Per-component package publishing strategy: unchanged
