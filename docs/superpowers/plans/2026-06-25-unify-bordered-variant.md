# Unify Bordered Variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename `outline`/`outlined` variant keys and internal CSS classes to `bordered` across Button and Chip, keeping the old values as backward-compatible deprecated aliases at the component layer.

**Architecture:** CSS classes in `@auronui/styles` are renamed first (foundation layer), then the tailwind-variants keys follow, then components add normalization + dev warning for deprecated values, then tests and stories are migrated to use canonical names.

**Tech Stack:** Vue 3.5+, tailwind-variants 3.x, Vitest 4.x, `@vue/test-utils` 2.x, `import.meta.env.DEV` for dev-only guards.

## Global Constraints

- Never modify CSS property values inside rule bodies — only selector names change.
- Deprecated aliases (`outline`, `outlined`) must continue to render identically to `bordered` — zero visual regression.
- `warnDeprecatedVariant` must be completely tree-shaken from production builds (`import.meta.env.DEV` guard).
- Do not add `border` as an alias — it was never shipped.
- Run tests from `packages/vue/` with `pnpm test` (maps to `vitest run`).

---

### Task 1: Rename CSS classes and tailwind-variants keys in `@auronui/styles`

This is the foundation. Everything else depends on the styles layer using `button--bordered` and `chip--bordered`.

**Files:**
- Modify: `packages/styles/components/button.css:138`
- Modify: `packages/styles/components/button-group.css:50,54`
- Modify: `packages/styles/components/chip.css:111`
- Modify: `packages/styles/src/components/button/button.styles.ts:54`
- Modify: `packages/styles/src/components/chip/chip.styles.ts:55`

**Interfaces:**
- Produces: `ButtonVariants['variant']` now accepts `'bordered'` (was `'outline'`); `ChipVariants['variant']` now accepts `'bordered'` (was `'outlined'`). TypeScript will error on any remaining callsite that passes the old key — those errors guide later tasks.

- [ ] **Step 1: Rename `.button--outline` → `.button--bordered` in button.css**

In `packages/styles/components/button.css` line 138, change the selector:

```css
/* Before */
.button--outline {

/* After */
.button--bordered {
```

Leave the rule body completely unchanged.

- [ ] **Step 2: Rename the two `.button--outline` references in button-group.css**

In `packages/styles/components/button-group.css`:

```css
/* Before (line 50) */
.button-group:has(.button--outline) {

/* After */
.button-group:has(.button--bordered) {

/* Before (line 54) */
.button-group .button--outline {

/* After */
.button-group .button--bordered {
```

- [ ] **Step 3: Rename `.chip--outlined` → `.chip--bordered` in chip.css**

In `packages/styles/components/chip.css` line 111:

```css
/* Before */
.chip--outlined {

/* After */
.chip--bordered {
```

- [ ] **Step 4: Update tailwind-variants key in button.styles.ts**

In `packages/styles/src/components/button/button.styles.ts`, inside the `variants.variant` object, rename the key and update the class string:

```ts
// Before
outline: { base: "button--outline" },

// After
bordered: { base: "button--bordered" },
```

The surrounding code stays the same — only this one key changes.

- [ ] **Step 5: Update tailwind-variants key in chip.styles.ts**

In `packages/styles/src/components/chip/chip.styles.ts`, inside `variants.variant`:

```ts
// Before
outlined: {
  base: "chip--outlined",
},

// After
bordered: {
  base: "chip--bordered",
},
```

- [ ] **Step 6: Commit**

```bash
git add packages/styles/components/button.css packages/styles/components/button-group.css packages/styles/components/chip.css packages/styles/src/components/button/button.styles.ts packages/styles/src/components/chip/chip.styles.ts
git commit -m "refactor(styles): rename outline/outlined CSS classes and variant keys to bordered"
```

---

### Task 2: Add `warnDeprecated` util to `packages/vue`

A shared, DEV-only, once-per-key console warning used by Button and Chip.

**Files:**
- Create: `packages/vue/src/utils/warnDeprecated.ts`
- Modify: `packages/vue/src/utils/index.ts`
- Create: `packages/vue/src/utils/__tests__/warnDeprecated.test.ts`

**Interfaces:**
- Produces: `warnDeprecatedVariant(component: string, deprecated: string, canonical: string): void` — imported by Button.vue and Chip.vue in later tasks.

- [ ] **Step 1: Write the failing test**

Create `packages/vue/src/utils/__tests__/warnDeprecated.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('warnDeprecatedVariant', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', true)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    // Reset the module so the warned Set is cleared between tests
    vi.resetModules()
  })

  it('emits a console.warn with component, deprecated, and canonical names', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledWith(
      '[AuronUI] Button: variant="outline" is deprecated, use variant="bordered" instead.'
    )
  })

  it('only warns once per unique component+value combination', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('warns separately for different components with the same deprecated value', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Chip', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledTimes(2)
  })

  it('suppresses warning when DEV is false', async () => {
    vi.stubEnv('DEV', false)
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/utils/__tests__/warnDeprecated.test.ts
```

Expected: FAIL — `Cannot find module '../warnDeprecated'`

- [ ] **Step 3: Create `warnDeprecated.ts`**

Create `packages/vue/src/utils/warnDeprecated.ts`:

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

- [ ] **Step 4: Export from utils index**

In `packages/vue/src/utils/index.ts`, add:

```ts
export { warnDeprecatedVariant } from "./warnDeprecated";
```

(Add this line alongside the existing exports.)

- [ ] **Step 5: Run the test to confirm it passes**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/utils/__tests__/warnDeprecated.test.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/vue/src/utils/warnDeprecated.ts packages/vue/src/utils/index.ts packages/vue/src/utils/__tests__/warnDeprecated.test.ts
git commit -m "feat(vue/utils): add warnDeprecatedVariant util for dev-only deprecation warnings"
```

---

### Task 3: Update Button.vue — add `bordered` canonical, deprecate `outline`

**Files:**
- Modify: `packages/vue/src/components/button/Button.vue`
- Modify: `packages/vue/src/components/button/__tests__/Button.test.ts`
- Modify: `packages/vue/src/components/button/__tests__/Button.axe.test.ts`
- Modify: `packages/vue/src/components/button/__tests__/ButtonGroup.test.ts`

**Interfaces:**
- Consumes: `warnDeprecatedVariant` from `../../utils/warnDeprecated` (Task 2); `ButtonVariants` from `@auronui/styles` (now has `bordered` key from Task 1).
- Produces: `Button` component prop `variant` accepts `'bordered'` canonically; `'outline'` is accepted but deprecated and normalized to `'bordered'` at runtime.

- [ ] **Step 1: Write the failing tests for bordered + deprecation behavior**

Add these tests to `packages/vue/src/components/button/__tests__/Button.test.ts` inside the existing `describe('Button', ...)` block:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
// (vi is already imported if not, add it to the existing import line)

// Add these tests inside the existing describe block:

it("applies 'button--bordered' with variant='bordered'", () => {
  const wrapper = mount(Button, { props: { variant: 'bordered' }, slots: { default: 'OK' } })
  expect(wrapper.classes()).toContain('button--bordered')
})

it("applies 'button--bordered' with deprecated variant='outline' (backward compat)", () => {
  const wrapper = mount(Button, { props: { variant: 'outline' as any }, slots: { default: 'OK' } })
  expect(wrapper.classes()).toContain('button--bordered')
  expect(wrapper.classes()).not.toContain('button--outline')
})

it("emits a deprecation warning when variant='outline' is used", () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  mount(Button, { props: { variant: 'outline' as any }, slots: { default: 'OK' } })
  expect(warn).toHaveBeenCalledWith(
    '[AuronUI] Button: variant="outline" is deprecated, use variant="bordered" instead.'
  )
  warn.mockRestore()
})
```

- [ ] **Step 2: Run the new tests to confirm they fail**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/components/button/__tests__/Button.test.ts
```

Expected: the 3 new tests FAIL — `button--bordered` class not found, no warning emitted.

- [ ] **Step 3: Update Button.vue**

In `packages/vue/src/components/button/Button.vue`:

**Add the import** (line 2, after existing imports):
```ts
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
```

**Update the variant prop type** (in the `defineProps` block):
```ts
/**
 * Visual style of the button.
 * @deprecated 'outline' — use 'bordered' instead.
 */
variant?: ButtonVariants['variant'] | 'outline'
```

**Update `LEGACY_VARIANTS`** — add `outline` entry:
```ts
const LEGACY_VARIANTS: Record<string, { variant: string; color: string }> = {
  primary:       { variant: 'solid',   color: 'primary' },
  secondary:     { variant: 'default', color: 'default' },
  tertiary:      { variant: 'default', color: 'default' },
  danger:        { variant: 'solid',   color: 'danger' },
  'danger-soft': { variant: 'soft',    color: 'danger' },
  success:       { variant: 'solid',   color: 'success' },
  'success-soft':{ variant: 'soft',    color: 'success' },
  warning:       { variant: 'solid',   color: 'warning' },
  'warning-soft':{ variant: 'soft',    color: 'warning' },
}
```

**Update `resolvedVariant` computed** — add a deprecation check before the legacy map lookup:
```ts
const resolvedVariant = computed(() => {
  const v = finalVariant.value
  if (!v) return v
  if (v === 'outline') {
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    return 'bordered' as ButtonVariants['variant']
  }
  return (LEGACY_VARIANTS[v]?.variant ?? v) as ButtonVariants['variant']
})
```

- [ ] **Step 4: Run the new tests to confirm they pass**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/components/button/__tests__/Button.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Update Button.axe.test.ts — replace `outline` with `bordered`**

In `packages/vue/src/components/button/__tests__/Button.axe.test.ts` line 6, update the variants array:

```ts
const variants = ['primary', 'secondary', 'tertiary', 'bordered', 'ghost', 'danger', 'danger-soft', 'success', 'success-soft', 'warning', 'warning-soft'] as const
```

(`'outline'` → `'bordered'`)

- [ ] **Step 6: Update ButtonGroup.test.ts — replace `outline` with `bordered`**

In `packages/vue/src/components/button/__tests__/ButtonGroup.test.ts` lines 47 and 51, update to use canonical value:

```ts
// Line 47 — template string
template: '<ButtonGroup variant="soft"><Button variant="bordered">A</Button></ButtonGroup>',

// Line 51 — class assertion
expect(btn.classes()).toContain('button--bordered')
expect(btn.classes()).not.toContain('button--soft')
```

- [ ] **Step 7: Run full button test suite**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/components/button/__tests__/
```

Expected: all tests PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/vue/src/components/button/Button.vue packages/vue/src/components/button/__tests__/Button.test.ts packages/vue/src/components/button/__tests__/Button.axe.test.ts packages/vue/src/components/button/__tests__/ButtonGroup.test.ts
git commit -m "feat(button): rename outline variant to bordered, keep outline as deprecated alias"
```

---

### Task 4: Update Chip.vue — add `bordered` canonical, deprecate `outlined`

**Files:**
- Modify: `packages/vue/src/components/chip/Chip.vue`
- Modify: `packages/vue/src/components/chip/__tests__/Chip.test.ts`

**Interfaces:**
- Consumes: `warnDeprecatedVariant` from `../../utils/warnDeprecated` (Task 2); `ChipVariants` from `@auronui/styles` (now has `bordered` key from Task 1).
- Produces: `Chip` component prop `variant` accepts `'bordered'` canonically; `'outlined'` is accepted but deprecated and normalized to `'bordered'` at runtime.

- [ ] **Step 1: Write the failing tests**

In `packages/vue/src/components/chip/__tests__/Chip.test.ts`, add these tests inside the existing describe block (and add `vi` to the vitest import if not already present):

```ts
it("applies 'chip--bordered' with variant='bordered'", () => {
  const wrapper = mount(Chip, { props: { variant: 'bordered' } })
  expect(wrapper.classes()).toContain('chip--bordered')
})

it("applies 'chip--bordered' with deprecated variant='outlined' (backward compat)", () => {
  const wrapper = mount(Chip, { props: { variant: 'outlined' as any } })
  expect(wrapper.classes()).toContain('chip--bordered')
  expect(wrapper.classes()).not.toContain('chip--outlined')
})

it("emits a deprecation warning when variant='outlined' is used", () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  mount(Chip, { props: { variant: 'outlined' as any } })
  expect(warn).toHaveBeenCalledWith(
    '[AuronUI] Chip: variant="outlined" is deprecated, use variant="bordered" instead.'
  )
  warn.mockRestore()
})
```

- [ ] **Step 2: Run the new tests to confirm they fail**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/components/chip/__tests__/Chip.test.ts
```

Expected: the 3 new tests FAIL.

- [ ] **Step 3: Update Chip.vue**

In `packages/vue/src/components/chip/Chip.vue`:

**Add the import** (after existing imports):
```ts
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
```

**Update the variant prop type** in `defineProps`:
```ts
/**
 * Visual style of the chip.
 * @deprecated 'outlined' — use 'bordered' instead.
 */
variant?: ChipVariants['variant'] | 'outlined'
```

**Add a `resolvedVariant` computed** (before `slotFns`):
```ts
const resolvedVariant = computed(() => {
  if (props.variant === 'outlined') {
    warnDeprecatedVariant('Chip', 'outlined', 'bordered')
    return 'bordered' as ChipVariants['variant']
  }
  return props.variant
})
```

**Update `slotFns`** to use `resolvedVariant` instead of `props.variant`:
```ts
const slotFns = computed(() =>
  chipVariants({
    color: props.color,
    size: props.size,
    variant: resolvedVariant.value,
  })
)
```

- [ ] **Step 4: Update the existing `chip--outlined` test to use `chip--bordered`**

In `packages/vue/src/components/chip/__tests__/Chip.test.ts`, update the existing test at line 68:

```ts
// Before
it("applies 'chip--outlined' with variant='outlined'", () => {
  const wrapper = mount(Chip, { props: { variant: "outlined" } });
  expect(wrapper.classes()).toContain("chip--outlined");
});

// After — this test now verifies backward compat (deprecated value still renders correct class)
it("applies 'chip--bordered' with deprecated variant='outlined' (backward compat)", () => {
  const wrapper = mount(Chip, { props: { variant: 'outlined' as any } })
  expect(wrapper.classes()).toContain('chip--bordered')
  expect(wrapper.classes()).not.toContain('chip--outlined')
})
```

> Note: This replaces the test you added in Step 1 for the `outlined` backward-compat case — they're the same assertion. Remove the duplicate if you added both. Keep just one.

- [ ] **Step 5: Run the full Chip test suite**

```bash
cd packages/vue && pnpm test -- --reporter=verbose src/components/chip/__tests__/Chip.test.ts
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/vue/src/components/chip/Chip.vue packages/vue/src/components/chip/__tests__/Chip.test.ts
git commit -m "feat(chip): rename outlined variant to bordered, keep outlined as deprecated alias"
```

---

### Task 5: Update AlertDialogAction and AlertDialogCancel variant unions

These components hard-code a string union for `variant` instead of using `ButtonVariants['variant']`. Update the union: replace `'outline'` with `'bordered'` and add `'outline'` back as a `@deprecated` entry.

**Files:**
- Modify: `packages/vue/src/components/alert-dialog/AlertDialogAction.vue`
- Modify: `packages/vue/src/components/alert-dialog/AlertDialogCancel.vue`

**Interfaces:**
- Consumes: No new imports needed — these components forward `variant` to Button.vue, which handles normalization (Task 3).
- Produces: `AlertDialogAction` and `AlertDialogCancel` now accept `'bordered'` in their variant union; `'outline'` remains accepted but is `@deprecated`.

- [ ] **Step 1: Update AlertDialogAction.vue**

In `packages/vue/src/components/alert-dialog/AlertDialogAction.vue`, replace the variant prop type (line 16):

```ts
// Before
variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'

// After
variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'bordered'
  /** @deprecated Use 'bordered' instead. */
  | 'outline'
  | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
```

> TypeScript doesn't support inline `@deprecated` on union members. Use a comment on the line before the deprecated member, or flatten to a single line:

```ts
/** variant — use 'bordered' for the outline style; 'outline' is @deprecated */
variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'bordered' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
```

- [ ] **Step 2: Update AlertDialogCancel.vue**

Same change in `packages/vue/src/components/alert-dialog/AlertDialogCancel.vue` line 11 — the identical union. Apply the same replacement.

- [ ] **Step 3: Verify TypeScript is happy**

```bash
cd packages/vue && pnpm typecheck
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add packages/vue/src/components/alert-dialog/AlertDialogAction.vue packages/vue/src/components/alert-dialog/AlertDialogCancel.vue
git commit -m "refactor(alert-dialog): add bordered to variant union, deprecate outline"
```

---

### Task 6: Migrate stories to canonical `bordered`

Update all Storybook stories that pass the old deprecated values so the repo itself models best practice.

**Files:**
- Modify: `packages/storybook/stories/Button.stories.ts`
- Modify: `packages/storybook/stories/ButtonGroup.stories.ts`
- Modify: `packages/storybook/stories/Chip.stories.ts`

- [ ] **Step 1: Update Button.stories.ts**

In `packages/storybook/stories/Button.stories.ts`:

Line 11 — update the controls options array:
```ts
// Before
options: ["solid", "default", "outline", "ghost", "soft"],

// After
options: ["solid", "default", "bordered", "ghost", "soft"],
```

Line 158 — update the story template:
```ts
// Before
<Button v-bind="args" variant="outline">Outline</Button>

// After
<Button v-bind="args" variant="bordered">Bordered</Button>
```

Line 230:
```ts
// Before
<Button v-bind="args" :disabled="true" variant="outline">Disabled Outline</Button>

// After
<Button v-bind="args" :disabled="true" variant="bordered">Disabled Bordered</Button>
```

Line 307 — find the `variant="outline"` attribute and update:
```ts
variant="bordered"
```

- [ ] **Step 2: Update ButtonGroup.stories.ts**

In `packages/storybook/stories/ButtonGroup.stories.ts`, replace **all** occurrences of `variant="outline"` with `variant="bordered"`. There are approximately 15 occurrences across lines 30–281. Use your editor's find-and-replace for `variant="outline"` → `variant="bordered"` scoped to this file.

After replacing, verify the count is zero:
```bash
grep -c 'variant="outline"' packages/storybook/stories/ButtonGroup.stories.ts
```
Expected: `0`

- [ ] **Step 3: Update Chip.stories.ts**

In `packages/storybook/stories/Chip.stories.ts`:

Line 16 — update the controls options:
```ts
// Before
options: ["solid", "soft", "outlined", "text"],

// After
options: ["solid", "soft", "bordered", "text"],
```

Lines 85, 191–195, 217 — replace all `variant="outlined"` with `variant="bordered"` and `variant: "outlined"` with `variant: "bordered"`:

```bash
grep -c 'outlined' packages/storybook/stories/Chip.stories.ts
```
Expected: `0` after replacements.

- [ ] **Step 4: Verify no old values remain in stories**

```bash
grep -rn '"outline"\|"outlined"' packages/storybook/stories/Button.stories.ts packages/storybook/stories/ButtonGroup.stories.ts packages/storybook/stories/Chip.stories.ts
```

Expected: no output.

- [ ] **Step 5: Run the full test suite to confirm nothing broke**

```bash
cd packages/vue && pnpm test
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/storybook/stories/Button.stories.ts packages/storybook/stories/ButtonGroup.stories.ts packages/storybook/stories/Chip.stories.ts
git commit -m "chore(storybook): migrate outline/outlined stories to canonical bordered variant"
```

---

## Self-Review

**Spec coverage check:**
- ✅ CSS rename (button.css, button-group.css, chip.css) — Task 1
- ✅ tailwind-variants key rename (button.styles.ts, chip.styles.ts) — Task 1
- ✅ `warnDeprecatedVariant` util, DEV-gated, once-per-key — Task 2
- ✅ Button.vue normalization + deprecated prop type + warning — Task 3
- ✅ Chip.vue normalization + deprecated prop type + warning — Task 4
- ✅ AlertDialogAction/Cancel union updated — Task 5
- ✅ Stories migrated — Task 6
- ✅ Tests: `bordered` renders correct class — Tasks 3, 4
- ✅ Tests: deprecated value renders same class — Tasks 3, 4
- ✅ Tests: deprecated value triggers warning — Tasks 3, 4
- ✅ Tests: warning fires once, not per-render — Task 2
- ✅ Tests: DEV=false suppresses warning — Task 2
- ✅ `border` alias — not added (out of scope per spec)
- ✅ The 15 components already using `bordered` — not touched (out of scope per spec)

**Type consistency check:**
- `warnDeprecatedVariant(component, deprecated, canonical)` — defined in Task 2, used identically in Tasks 3 and 4.
- `ButtonVariants['variant']` — after Task 1, this type includes `'bordered'` (not `'outline'`). Tasks 3+ cast correctly.
- `ChipVariants['variant']` — same, includes `'bordered'` after Task 1.
- CSS class names: `button--bordered`, `chip--bordered` — defined in Task 1 CSS, referenced consistently in test assertions Tasks 3–4.

**Placeholder scan:** None found.
