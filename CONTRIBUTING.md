# Contributing to Auron UI

Thanks for your interest in Auron UI! This guide explains how to set up the repo, add or update a component, and submit a pull request.

## Prerequisites

- Node 22+
- pnpm 10.33+
- Git

## Setup

```bash
git clone https://github.com/DarkKnight1992/auron.git
cd auron
pnpm install
pnpm turbo run build
```

## Monorepo Layout

```
auron/
  packages/
    vue/          # @auronui/vue — Vue 3 component library
    styles/       # @auronui/styles — CSS variants
    standard/     # shared ESLint/Prettier/TSConfig
    vitest/       # shared Vitest config
    storybook/    # Storybook 10 dev environment
  apps/
    docs/             # VitePress documentation
    ssr-test/         # Nuxt 3 SSR smoke test
    tree-shaking-test/ # Vite consumer tree-shaking verification
```

## Dev Commands

```bash
# Start everything in watch/dev mode in parallel
pnpm turbo run dev

# Run specific packages
pnpm --filter @auronui/storybook dev   # Storybook only
pnpm --filter @auronui/docs dev        # VitePress docs only

# Build all packages
pnpm turbo run build

# Run unit + axe tests
pnpm turbo run test

# ESLint across the repo
pnpm turbo run lint

# TypeScript strict mode check
pnpm turbo run typecheck

# Format with Prettier
pnpm run format
```

## Adding a Component

Follow this checklist when adding a new component or an entire component family:

1. **Create the component** at `packages/vue/src/components/<family>/<Name>.vue` using `<script setup lang="ts">`.

2. **Use a Reka UI primitive** for any interactive behavior. Do NOT reimplement ARIA state machines by hand — Reka UI provides battle-tested WAI-ARIA implementations for ~40 component primitives.

3. **Pull variant classes from `@auronui/styles`** via `tailwind-variants`. Do not inline Tailwind utility classes for stateful styling (`:hover`, `:focus`, `:disabled`, `data-*` states).

4. **Export from the family index** (`packages/vue/src/components/<family>/index.ts`) and from the main entry point (`packages/vue/src/index.ts`).

5. **Add JSDoc comments on every `defineProps` field** — the docs site auto-generates props tables from these comments via `vue-docgen-api`. Example:

   ```ts
   const props = defineProps<{
     /** Controls the visual style of the button. */
     variant?: 'solid' | 'outline' | 'ghost' | 'light'
     /** Controls the color scheme. */
     color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
   }>()
   ```

6. **Write a Storybook story** at `packages/storybook/stories/<Name>.stories.ts` covering every variant and interactive state.

7. **Write unit + axe tests** at `packages/vue/src/components/<family>/<Name>.test.ts`. Every component must pass `@chialab/vitest-axe@0.19.1` with zero violations.

8. **Regenerate docs metadata**:
   ```bash
   pnpm --filter @auronui/docs docgen
   pnpm --filter @auronui/docs docgen:pages
   ```

9. **Hand-polish the generated page** at `apps/docs/components/<name>.md` — add usage examples, accessibility notes, and keyboard interaction tables.

### Component Conventions

- Use `<script setup lang="ts">` — no Options API.
- Use `useTemplateRef()` for template refs (Vue 3.5+).
- Use `defineModel()` for v-model bindings (Vue 3.5+).
- Use `useId()` for generated IDs (Vue 3.5+).
- Pair every CSS interactive-state rule with both a pseudo-class and the corresponding Reka UI `data-*` attribute. Example: `:hover, [data-highlighted]` — not just `:hover`.
- Export named types (variants, contexts) alongside component exports.

## Testing Requirements

Every PR must pass all of the following:

- **Unit tests** via Vitest (`pnpm turbo run test`)
- **Accessibility audit** via `@chialab/vitest-axe@0.19.1` — zero violations required
- **Type check** via `vue-tsc --noEmit` (`pnpm turbo run typecheck`)
- **Lint** via `eslint-plugin-vue` (`pnpm turbo run lint`)
- **SSR smoke test** via `apps/ssr-test` — no hydration mismatches
- **Tree-shaking check** via `apps/tree-shaking-test` — bundle must not grow unexpectedly

CI runs all of these automatically on every PR.

### Writing Axe Tests

```ts
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { axe } from '@chialab/vitest-axe'
import MyComponent from './MyComponent.vue'

it('has no accessibility violations', async () => {
  const wrapper = mount(MyComponent, { attachTo: document.body })
  const results = await axe(wrapper.element)
  expect(results).toHaveNoViolations()
  wrapper.unmount()
})
```

Key points:
- Always use `attachTo: document.body` so axe has a real DOM context.
- Always call `wrapper.unmount()` after to clean up.
- Import axe from `@chialab/vitest-axe` (not the unmaintained `vitest-axe` 0.1.0).

## Pull Request Process

1. Fork the repo and create a feature branch from `main`.
2. Make your changes with tests.
3. Run `pnpm turbo run build test lint typecheck` locally before pushing.
4. Commit using conventional commits:
   - `feat:` — new component or feature
   - `fix:` — bug fix
   - `docs:` — documentation only
   - `test:` — test-only changes
   - `refactor:` — no behavior change
   - `chore:` — config, tooling, dependencies
5. Open a PR with a clear description and link to any related issues.
6. A maintainer will review. All CI checks must be green before merge.
7. Squash-merge is used — keep your branch history clean but PR description will be preserved.

## Reporting Issues

Open an issue on GitHub with:

- Vue version and Auron UI version
- A minimal reproduction (StackBlitz link or inline code snippet)
- Expected behavior vs actual behavior
- Browser/environment details if relevant

## Branching Model

- `main` — stable, always passing CI, latest release
- Feature branches — `feat/<name>`, `fix/<name>`, `docs/<name>`
- No long-lived branches; rebase onto `main` before opening a PR

## Code of Conduct

All contributors must follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
