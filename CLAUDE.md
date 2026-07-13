<!-- GSD:project-start source:PROJECT.md -->
## Project

**Auron**

Auron is a Vue 3 designed componented — a public, open-source component library that produces 85+ components for Vue developers. It uses [Reka UI](https://reka-ui.com) as the accessibility primitive layer and a forked `@auronui/styles` package for CSS and Tailwind variant definitions.

**Core Value:** **Full visual parity with HeroUI React across all components**

### Constraints

- **Tech stack**: Vue 3.5+, Reka UI 2.x, Tailwind CSS 4, tailwind-variants, `@vueuse/core`, Vite library mode, Storybook 10, Vitest, VitePress, pnpm + Turborepo — Vue 3.5+ is required for `useTemplateRef`, improved `defineModel`, and `useId`
- **Accessibility**: Every component must pass `vitest-axe` with zero violations — accessibility is non-negotiable for a component library
- **Testing**: Storybook story + axe audit + render/interaction test + full unit coverage for every component — no manual QA
- **Timeline**: No deadline — quality and completeness take priority over speed
- **License**: MIT
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework & Build
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vue** | 3.5+ (pinned to latest) | Progressive JavaScript framework | Vue 3.5+ required for `useTemplateRef()`, improved `defineModel`, `useId()`. These APIs are non-negotiable for a component library. |
| **Vite** | 5.0+ | Build tool and dev server | 5x faster full builds, ESM-first, native Vue 3 + TS support, first-party `@vitejs/plugin-vue`. Industry standard for Vue 3 libraries. |
| **@vitejs/plugin-vue** | 6.0.5 | Vue SFC compiler for Vite | Official Vite plugin for `.vue` SFC compilation, required for Vite library mode. Bundled with `@vitejs/create-vite`. |
| **vite-plugin-dts** | 4.5.4 | TypeScript declaration generation | Generates `.d.ts` files from `.ts(x)` and `.vue` source files in library mode. Standard for Vue 3 component library publishing. |
| **TypeScript** | 5.8+ | Static typing | Vue 3.5+ components require TS 5.8+. `@vue/tsconfig` recommends TS 5.8 minimum. Enables `<script setup lang="ts">` patterns. |
| **@vue/tsconfig** | 0.3.x (latest) | Vue 3 TypeScript baseline config | Official Vue config for TS projects. Requires TS 5.8+. Use as base, extend for library mode (lib: "es2020", module: "es2020"). |
### CSS & Styling
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Tailwind CSS** | 4.2.0+ | Utility-first CSS framework | Plan requires Tailwind 4 for forked `@auronui/styles`. v4.2.0 (Feb 2026) shipped Webpack plugin and new palettes. Use `@tailwindcss/vite` plugin. |
| **tailwind-variants** | 3.2.2 | Type-safe Tailwind variant builder | Standard for component libraries using Tailwind. Generates BEM class strings from variant definitions. Compatible with Tailwind 4.x. Returns string directly (no function call). |
| **tailwind-merge** | 3.5.0 | Merge Tailwind classes without conflicts | Used in `composeClassName` utility (Vue equivalent of React's `composeTwRenderProps`). Supports Tailwind 4.0–4.2. |
### Accessibility Primitives
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **reka-ui** | 2.9.5 (latest as of Apr 2026) | Vue 3 headless UI primitives | Reka UI IS Radix for Vue. 40+ components, compound component pattern matches React's Radix-style API. Covers ~70% of 85  components. 2.9M monthly downloads. WAI-ARIA compliant. |
### Composables & State Management
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **@vueuse/core** | 14.2.1 (latest as of Feb 2026) | Essential Vue composition utilities | Required for Table/Virtualizer/ScrollShadow: `useResizeObserver`, `useScroll`, `useMeasureElement`, `useCssVar`, `useMediaQuery`. Requires Vue 3.5+. 100% drop-in for React hook equivalents. |
### Advanced Data Components
| Technology | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@tanstack/vue-table** | Latest v8 | Headless table data logic | Phase 4: Table component requires data model, sorting, filtering, column resizing. Composable API works natively with Vue ref/computed. |
| **@tanstack/vue-virtual** | Latest v3–v4 | Virtualizer for large lists | Phase 4: Virtualizer component and virtualizing Table rows. Composable `useVirtualizer` returns Ref<Virtualizer>. |
| **vue-input-otp** | Latest | OTP input primitives | Phase 2: InputOTP component. Accessible and unstyled, Vue 3 native, pairs with `@auronui/styles` styling. |
### Monorepo & Build Orchestration
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **pnpm** | 10.33.0+ | Package manager | Node 22+ required. 100% faster than npm for monorepos. Workspace protocol (`workspace:*`), --filter flag sub-100ms resolution. Required: pnpm >=10.x. |
| **Turborepo** | 2.7+ | Monorepo build orchestrator | Compose config (Dec 2025 feature). Remote caching free with Vercel. 2M weekly downloads. Works with pnpm workspace perfectly. Rust-based, < 2 min CI pipelines. |
### Testing & Quality
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vitest** | 4.1+ | Unit testing framework | Native Vite integration, zero config for Vue 3. Browser mode for component tests. v4.1 native Vite 8 support. Replaces Jest for Vue. |
| **@vue/test-utils** | 2.4+ (or latest) | Vue component testing utilities | Official Vue testing library. Works natively with Vitest, Playwright, WebdriverIO. Handles SFC mounting and slot injection. |
| **@testing-library/vue** | 8.1.0 | Accessibility-first component testing | Recommended alongside @vue/test-utils for user-centric testing patterns. DOM queries mirror accessibility API. |
| **@chialab/vitest-axe** | 0.19.1 (actively maintained) | Accessibility audit in tests | Phase 0 requirement: Every component must pass `vitest-axe` with zero violations. `@chialab/vitest-axe` (not the 3-year-old `vitest-axe` package) actively maintained as of March 2026. |
### Documentation & Storybook
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Storybook** | 10.2.14 (latest) | Component development & documentation | Full Vue 3 support (no longer supports Vue 2). v10 has first-class Volar integration and visual testing. Standard for component library dev. |
| **VitePress** | Latest | Documentation site | Phase 6: Lightweight Markdown-based docs, native Vue 3 + Vite, perfect for component reference pages. |
### Linting & Code Style
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **eslint-plugin-vue** | 10.8.0 (latest as of Apr 2026) | Vue 3 ESLint rules | Official Vue ESLint plugin. 3,697 projects depend on it. Works with ESLint 9. Enforce `<script setup>` conventions. |
| **Prettier** | 3.7.4+ | Code formatter | uses Prettier 3.7.4. Consistent formatting. Vue 3 native. |
| **@vue/standard** (internal) | (workspace package) | Shared ESLint, Prettier, TS config | Per plan: `@auronui/standard` package. Package ESLint presets (vue plugin), Prettier config, TSConfig. Workspace dependency for all packages. |
## Installation
### Initialize Monorepo
# Core monorepo setup
# Root package.json (Node 22+, pnpm 10.x)
### Core Packages
# Runtime (save to @auronui/vue package.json)
# Peer dependencies (users install)
# Dev dependencies for @auronui/vue
### Supporting Packages (Conditional)
# For Table component (Phase 4)
# For Virtualizer component (Phase 4)
# For InputOTP component (Phase 2)
### Tools & Config Packages
# Storybook (separate installation in apps/docs)
# @auronui/standard (internal)
# Create packages/standard/package.json with:
# Turborepo & monorepo
## Alternatives Considered
| Category | Recommended | Alternative | When to Use Alternative |
|----------|-------------|-------------|-------------------------|
| **Accessibility primitives** | Reka UI 2.9.5 | Ark UI 1.6+ | Ark UI has similar coverage (~35 primitives vs 40+) but Reka's API is 1:1 with Radix. Ark's Zag machines are harder to adapt. Reka wins for API familiarity. |
| **Accessibility primitives** | Reka UI 2.9.5 | Headless UI | Headless UI covers only ~10 components (Dialog, Menu, Listbox, Popover, Tabs, Switch, Disclosure, RadioGroup, Combobox). Missing Calendar, DatePicker, ColorPicker, Toast, Slider, etc. Not viable for 85 components. |
| **Styling** | tailwind-variants 3.2.2 | clsx + manual Tailwind | tailwind-variants is framework-agnostic, built for component libraries, returns BEM strings. clsx doesn't generate variants. tailwind-variants is mandatory. |
| **Composables** | @vueuse/core 14.2.1 | Custom composables | @vueuse/core covers 200+ utility composables. Reimplementing `useResizeObserver`, `useScroll`, `useCssVar` is reinventing. Use the wheel. |
| **Table** | @tanstack/vue-table v8 | Reka UI (none) + custom | Reka UI has no Table. TanStack Table is SOTA headless table logic. This is a Phase 4 decision. |
| **Toast** | Reka UI Toast | vue-sonner | Reka UI Toast is integrated into Reka, unstyled (pairs with `@auronui/styles`). vue-sonner is opinionated, styled by default. Nuxt UI (which uses Reka) chose Reka Toast for consistency. |
| **OTP** | vue-input-otp | input-otp (port) | `vue-input-otp` is a direct Vue port of the Guilherme Rodriguez OTP library. Accessible, unstyled, Vue 3 native. Porting `input-otp` JS logic is overkill. |
| **Monorepo package manager** | pnpm 10.33.0 | npm / yarn | pnpm 10+ is 3x faster than npm 9, sub-second warm installs, workspace protocol. npm lacks workspace: protocol. pnpm is standard in 2026 for monorepos. |
| **Build orchestrator** | Turborepo 2.7 | Nx | Turborepo: 2M/week downloads, free remote cache, minimal config. Nx: more powerful but complex for small–mid-scale (5–50 packages). Turborepo = "get it done fast". Nx = "enterprise scale". Choose Turborepo. |
| **Testing** | Vitest 4.1 | Jest | Vitest integrates directly with Vite, zero config for Vue. Jest requires `vue-jest` preset and separate Babel config. Vitest is the Vue 3 standard. |
| **Accessibility testing** | @chialab/vitest-axe 0.19.1 | jest-axe | `jest-axe` is React-centric. `vitest-axe` (0.1.0, 3 years old) unmaintained. `@chialab/vitest-axe` is actively maintained (Mar 2026), fork of jest-axe adapted for Vitest. Use @chialab. |
## What NOT to Use
| Technology | Why Avoid | Use Instead |
|------------|-----------|-------------|
| **Ark UI** over Reka UI | Zag machine abstractions are less intuitive than Radix's composition model. API mapping from React Aria → Ark requires more custom glue. Reka is a direct port of Radix Vue. | Use Reka UI 2.9.5 |
| **Headless UI** | Covers only 10 components vs Reka's 40+. Missing Calendar, DatePicker, Color, Toast, Slider. Cannot build 85 components with Headless UI. | Use Reka UI 2.9.5 |
| **custom hooks for @vueuse functions** | Reinventing `useResizeObserver`, `useMediaQuery`, `useScroll` is time waste. @vueuse already solves these with 200+ composables tested in production. | Use @vueuse/core 14.2.1 |
| **Tailwind CSS 3.x** | Forked styles will use Tailwind 4 CSS features (cascade layers, @property, color-mix()). Can't downgrade. | Use Tailwind CSS 4.2.0+ |
| **tailwind-merge 2.6.0** | v2.6.0 is for Tailwind 3 only. Will fail on v4 syntax. | Use tailwind-merge 3.5.0 |
| **vite-plugin-dts@3.x** | v3.x is outdated. v4.5.4 (current) is stable, well-tested. | Use vite-plugin-dts 4.5.4 |
| **unplugin-dts** | An unplugin fork of vite-plugin-dts. Adds abstraction layer. vite-plugin-dts is simpler and sufficient. | Use vite-plugin-dts 4.5.4 |
| **Vue 2 support** | Vue 2 is EOL (Sept 2024). `useTemplateRef`, `useId`, improved `defineModel` require Vue 3.5+. No backward compat needed. | Use Vue 3.5+ only |
| **React Aria Components directly** | Vue has Reka UI (Radix for Vue). Reka has ~70% coverage. Use Reka where available; custom build the rest. | Use Reka UI + custom implementations for gaps |
| **old vitest-axe (0.1.0)** | Last published 3 years ago. Unmaintained. | Use @chialab/vitest-axe 0.19.1 |
| **jest** for Vue 3 testing | Jest requires `vue-jest` preset and Babel config overhead. Vitest integrates natively with Vite. Jest adds complexity. | Use Vitest 4.1+ |
| **Lerna** for monorepo | Lerna is in maintenance mode. pnpm workspaces + Turborepo is the 2026 standard. Faster, simpler, no extra CLI. | Use pnpm 10.33.0 + Turborepo 2.7 |
## Stack Patterns by Variant
### If building a Table component:
- Use **@tanstack/vue-table v8** for data logic (sorting, filtering, pagination, column resizing)
- Use **@tanstack/vue-virtual v3+** for virtualizing rows (10K+ rows)
- Use **Reka UI** for Popover (column menu), Checkbox (selection), Dialog (inline editing if needed)
- Use **@vueuse/core** for `useResizeObserver` (column resizing), `useScroll` (body overflow detection)
- Implement custom ARIA `role="grid"` for full keyboard nav
### If building a Color Picker component:
- Port **@react-stately/color** (Apache 2.0, framework-agnostic) into `packages/vue/src/utils/color.ts`
- Wrap ported color space logic (hsl-to-rgb conversion, etc.) in Vue composables
- Use **Reka UI Slider** (2–3 instances) for hue, saturation, lightness channels
- Use **Reka UI ColorPicker** primitive if available; otherwise build custom
- Validate color conversions with unit tests in Vitest
### If building a Toast component:
- Use **Reka UI Toast** (unstyled, accessible, context-based)
- Style with `@auronui/styles` forked CSS
- Alternatively: integrate **vue-sonner** if you prefer opinionated behavior (auto-dismiss, swipe)
- Both are valid; Reka Toast is more composable for design systems
### If using Storybook:
- Install **@storybook/vue3@^10.0.0**
- Configure `apps/storybook/` with `.storybook/main.ts` using Vite preset
- Write stories as Vue SFCs (`.stories.vue`)
- Test stories with Vitest Browser Mode (Playwright) for visual regression
- Deploy to Chromatic or Vercel for visual diff CI
## Version Compatibility Matrix
| Package | Version | Vue | TS | Vite | Node | Notes |
|---------|---------|-----|----|----- |----- |-------|
| vue | 3.5+ | — | 5.8+ | 5.0+ | 22+ | Requires TS 5.8+, Vite 5+ for full support |
| reka-ui | 2.9.5 | 3.4+ | 4.4+ | 4.0+ | 18+ | Latest stable. Requires @vueuse/core. |
| @vueuse/core | 14.2.1 | 3.5+ | 5.0+ | 4.0+ | 18+ | Requires Vue 3.5+ (v14.0+ changed this) |
| tailwind-variants | 3.2.2 | — | 4.0+ | 4.0+ | 18+ | Requires tailwind-merge 3.5.0, Tailwind 4.x |
| tailwind-merge | 3.5.0 | — | 5.0+ | 4.0+ | 18+ | For Tailwind 4.0–4.2. v2.6.0 for Tailwind 3.x |
| tailwindcss | 4.2.0+ | — | 5.0+ | 5.0+ | 22+ | v4.2.0 (Feb 2026) latest. Requires @tailwindcss/vite |
| @vitejs/plugin-vue | 6.0.5 | 3.0+ | 4.0+ | 5.0+ | 18+ | Latest stable. Works with Vite 5. |
| vite-plugin-dts | 4.5.4 | 3.0+ | 4.0+ | 4.0+ | 16+ | Library mode declaration generation. v3.x outdated. |
| vitest | 4.1+ | 3.0+ | 5.0+ | 5.0+ | 18+ | v4.1 = Vite 8 support. Browser mode for component tests. |
| Storybook | 10.2.14 | 3.0+ | 5.0+ | 5.0+ | 18+ | Latest. No Vue 2 support. |
| pnpm | 10.33.0+ | — | — | — | 22+ | Requires Node 22+. Sub-second warm installs. |
| Turborepo | 2.7+ | — | — | — | 18+ | Latest. Composable config (2.7 feature). |
| eslint-plugin-vue | 10.8.0 | 3.0+ | 5.0+ | — | 18+ | Latest (Apr 2026). ESLint 9 compatible. |
| @chialab/vitest-axe | 0.19.1 | 3.0+ | 5.0+ | — | 18+ | Actively maintained. Vitest-native accessibility. |
## Critical Decisions Locked In
### 1. Reka UI over Ark UI / Headless UI (CONFIRMED)
- **Decision**: Use Reka UI 2.9.5 as accessibility primitive layer
- **Rationale**: Direct port of Radix UI, 40+ primitives, compound component pattern 1:1, covers ~70% of 85 components
- **Locked**: Yes. Reka UI is the foundation.
### 2. Single `@auronui/vue` package (CONFIRMED)
- **Decision**: Monorepo with single package (not per-component packages)
- **Rationale**: ESM tree-shaking handles bundle. Simpler DX + publishing.
- **Locked**: Yes. Per-component packages deferred to v1.1+.
- **Locked**: Yes. Audit CSS selectors is a Phase 0 blocker.
### 4. Vue 3.5+ minimum (CONFIRMED)
- **Decision**: Vue 3.5.0+, no Vue 2 backport
- **Rationale**: Requires `useTemplateRef()`, improved `defineModel`, `useId()`. No client-side parity need.
- **Locked**: Yes. Vue 2 is EOL (Sept 2024).
### 5. Tailwind CSS 4.2.0+ (CONFIRMED)
- **Decision**: Tailwind 4.2.0+ (not v3). Use `@tailwindcss/vite` plugin.
- **Rationale**:  Forked styles use Tailwind 4 features (cascade layers, @property, color-mix()). v4.2.0 (Feb 2026) is latest.
- **Locked**: Yes. Cannot downgrade.
### 6. Vite library mode + vite-plugin-dts (CONFIRMED)
- **Decision**: Build with Vite library mode. Declare with vite-plugin-dts 4.5.4.
- **Rationale**: Vue standard. Native `.vue` SFC compilation. Simpler than React's raw Rollup.
- **Locked**: Yes. Vite is Vue standard.
### 7. pnpm 10.33.0+ + Turborepo 2.7+ (CONFIRMED)
- **Decision**: Package manager = pnpm 10.33.0+. Build orchestration = Turborepo 2.7+.
- **Rationale**: pnpm 10 = sub-second warm installs, workspace protocol, Node 22+ required. Turborepo 2.7 = Composable config, free remote cache, 2M/week downloads.
### 8. Storybook 10.2.14 (CONFIRMED)
- **Decision**: Storybook 10.2.14 (latest). Full Vue 3 support. No Vue 2 backward compat.
- **Rationale**: v10 = first-class Volar integration, visual testing, component dev standard.
- **Locked**: Yes. Latest stable.
### 9. Vitest 4.1+ + @chialab/vitest-axe (CONFIRMED)
- **Decision**: Unit testing = Vitest 4.1+. Accessibility audits = @chialab/vitest-axe 0.19.1.
- **Rationale**: Vitest natively integrated with Vite, zero config for Vue. @chialab/vitest-axe actively maintained (vs unmaintained jest-axe port).
- **Locked**: Yes. Accessibility testing is mandatory (Phase 0).
### 10. @vueuse/core 14.2.1 (CONFIRMED)
- **Decision**: Composables from @vueuse/core 14.2.1, not custom implementations
- **Rationale**: Covers 200+ utilities. `useResizeObserver`, `useScroll`, `useCssVar`, `useMediaQuery` are tested in production. Reimplementing is waste.
- **Locked**: Yes. Use the ecosystem.
## Plan Validation
### Existing Tech Choices (from `.claude/plan/00 Port to Vue3.md`)
| Choice | Plan Version | Current Research | Status |
|--------|--------------|------------------|--------|
| Vue 3.5+ | ✓ Listed | HIGH confidence: Required for `useTemplateRef`, `defineModel`, `useId` | **CONFIRMED** |
| Reka UI 2.x | ✓ Listed | 2.9.5 latest (Apr 2026), 40+ primitives, 2.9M downloads | **CONFIRMED & CURRENT** |
| Tailwind CSS 4 | ✓ Listed | 4.2.0 latest (Feb 2026) | **CONFIRMED & CURRENT** |
| tailwind-variants 3.2.x | ✓ Listed as "3.2.x" | 3.2.2 latest, compatible with Tailwind 4.x | **CONFIRMED & CURRENT** |
| @vueuse/core | ✓ Listed as "@vueuse/core" | 14.2.1 latest (Feb 2026), requires Vue 3.5+ | **CONFIRMED & UPDATED: now 14.x not 12.x** |
| Vite library mode | ✓ Listed | Vite 5.0+, @vitejs/plugin-vue 6.0.5, vite-plugin-dts 4.5.4 | **CONFIRMED & CURRENT** |
| Storybook 10 | ✓ Listed as "Storybook 10" | 10.2.14 latest, full Vue 3 support | **CONFIRMED & CURRENT** |
| Vitest | ✓ Listed | 4.1+ latest, Vite 8 support | **CONFIRMED & CURRENT** |
| pnpm + Turborepo | ✓ Listed | pnpm 10.33.0, Turborepo 2.7 (Composable Config) | **CONFIRMED & CURRENT** |
| VitePress | ✓ Listed as "VitePress" | Latest stable, Markdown-based docs, Phase 6 | **CONFIRMED** |
### NEW discoveries not in plan:
| Discovery | Research Finding | Impact | Recommendation |
|-----------|------------------|--------|-----------------|
| @vueuse/core version | Plan said "12.x", research found 14.2.1 (Feb 2026) | v14.0+ requires Vue 3.5+ (good — plan requires 3.5+) | **UPDATE plan: @vueuse/core to ^14.0** |
| @chialab/vitest-axe | Plan said "vitest-axe", research found unmaintained 0.1.0 (3yr old) | Active fork @chialab/vitest-axe 0.19.1 (Mar 2026) is maintained | **SUBSTITUTE: Use @chialab/vitest-axe 0.19.1 instead of vitest-axe** |
| tailwind-merge version | Plan didn't specify | 3.5.0 (latest, Mar 2026) required for Tailwind 4.x | **ADD: tailwind-merge ^3.5.0 to dependencies** |
| @vitejs/plugin-vue version | Plan didn't specify | 6.0.5 (latest, Mar 2026) | **ADD: @vitejs/plugin-vue ^6.0.0 to dev dependencies** |
| eslint-plugin-vue | Plan didn't list version | 10.8.0 (latest, Apr 2026), ESLint 9 compatible | **ADD: eslint-plugin-vue ^10.8.0 to @auronui/standard** |
| Tailwind CSS v4.2.0 (Feb 2026) | Plan listed "4" | v4.2.0 ships Webpack plugin, new palettes, 3.8x recompile speedup | **UPDATE plan: Use ^4.2.0 for latest performance** |
| Reka UI 2.9.5 | Plan listed "2.x" | 2.9.5 latest (5 days before research), no breaking changes in 2.x | **CONFIRMED as 2.9.5** |
| Toast decision | Plan said "Evaluate Reka UI Toast vs vue-sonner" | Research: Nuxt UI chose Reka Toast, more composable for design systems | **RECOMMEND: Use Reka UI Toast in Phase 3** |
| @tanstack/vue-table | Plan listed "@tanstack/vue-table" | v8 latest, composable API native to Vue | **CONFIRMED: v8** |
| @tanstack/vue-virtual | Plan listed "@tanstack/vue-virtual" | v3+ latest, useVirtualizer composable | **CONFIRMED: v3+** |
| vue-input-otp | Plan listed "Evaluate vue-input-otp or port" | vue-input-otp is maintained, Vue 3 native, direct port of input-otp | **RECOMMEND: Use vue-input-otp, do not port** |
## Phase 0 Stack Blockers
## Dependency Installation Order
- Phase 4: Add `@tanstack/vue-table`, `@tanstack/vue-virtual`
- Phase 2: Add `vue-input-otp`
- Phase 6: Add VitePress for docs
## Sources
- [Reka UI GitHub Releases](https://github.com/unovue/reka-ui/releases) — 2.9.5 latest, active maintenance
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) — Official v4 announcement, v4.2.0 latest
- [Vue 3.5 Official Docs](https://vuejs.org/guide/typescript/overview) — useTemplateRef, defineModel requirements
- [pnpm Official Docs](https://pnpm.io/workspaces) — pnpm 10.33.0, workspace protocol, Node 22 requirement
- [Turborepo Official](https://turbo.build/) — v2.7 Composable Config, Vercel remote cache
- [@vueuse/core npm](https://www.npmjs.com/package/@vueuse/core) — v14.2.1 latest, Vue 3.5+ requirement
- [Vitest Official](https://vitest.dev/) — v4.1, browser mode, Vue component testing
- [Storybook for Vue3](https://storybook.js.org/blog/storybook-vue3/) — v10.2.14, Vue 3 native support
- [tailwind-variants npm](https://www.npmjs.com/package/tailwind-variants) — v3.2.2, Tailwind 4.x compatible
- [tailwind-merge npm](https://www.npmjs.com/package/tailwind-merge) — v3.5.0, Tailwind 4.0–4.2 support
- [@chialab/vitest-axe npm](https://www.npmjs.com/package/@chialab/vitest-axe) — v0.19.1, actively maintained (Mar 2026)
- [vite-plugin-dts npm](https://www.npmjs.com/package/vite-plugin-dts) — v4.5.4, declaration generation
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

### Component Usage — NEVER use raw HTML elements

When writing any Vue code in this repo (components, stories, tests, examples), **always use AuronUI components** from `packages/vue/src/components/` instead of raw HTML elements. This applies inside the library itself and in any consuming code.

| Instead of | Use |
|------------|-----|
| `<button>` | `<Button>` |
| `<input>` | `<Input>` |
| `<textarea>` | `<Textarea>` |
| `<select>` | `<Select>` / `<ListBox>` |
| `<dialog>` / `<div role="dialog">` | `<Modal>` |
| `<a>` (navigation) | `<Link>` |
| `<label>` | `<Label>` |
| `<kbd>` | `<Kbd>` |
| `<hr>` | `<Separator>` |
| `<progress>` | `<ProgressBar>` / `<ProgressCircle>` |
| `<details>` / `<summary>` | `<Collapsible>` |

Import from the local package when inside the repo:
```ts
import Button from '../button/Button.vue'          // within packages/vue/src
import { Button } from '@auronui/vue'              // in packages/storybook or apps
```

Only reach for a raw HTML element when no AuronUI component covers the use case, and add a comment explaining why.
<!-- GSD:conventions-end -->

## Component Additions Log

Running log of notable component additions and capability changes, most recent first. This tracks what's actually shipped, separate from the stack-decision tables above — append a new dated entry here whenever a component is added or gains a capability worth remembering for future sessions (new props, a11y fixes, deliberate scope exclusions).

### 2026-07-13
- **Sidebar** (new) — vertical navigation (`packages/vue/src/components/sidebar/`): grouped link sections, optional sticky search, active-link auto-detection via a dependency-free `history.pushState`/`replaceState` patch (`useLocationPath` composable), collapsible nested children.
- **Tree** — fixed a keyboard-parity accessibility bug: Enter/Space only fired `select` (highlight), never `toggle` (expand/collapse), even though a mouse click fired both — reka-ui's own `TreeItem` keydown handler is asymmetric with its click handler. Fixed in `TreeItem.vue` by capturing reka-ui's exposed `handleToggle()` via a template ref and invoking it on Enter/Space for rows with children.
- **InputGroup** (new) — generic bordered box (`packages/vue/src/components/input-group/`) for merging arbitrary content (icons, buttons, a bare input) into one field-styled unit. Compound API: `InputGroup` + `InputGroupAddon` + `InputGroupInput`, sharing state via context. Full field contract: `variant` (flat/bordered/faded/underlined/raised), `color` (default/primary/secondary/success/warning/danger), `size`, `label`/`description`/`errorMessage` (auto-wires `aria-describedby` + field `id` onto the contained `InputGroupInput`, no manual ids needed), `isInvalid`, `isDisabled`, `fullWidth`.
- **SearchField** (new) — dedicated search/filter input (`packages/vue/src/components/search-field/`), mirrors `Input.vue`'s anatomy and a11y contract exactly (reuses `.input`/`.input__*` CSS wholesale, no new stylesheet). Built-in search icon, clear button on by default, Escape-to-clear.
- **TagGroup** — deliberately excluded from the HeroUI parity set. `Autocomplete` already covers the "selectable, removable tag collection" use case; `Tag` (aliased from `Chip`) remains for single-tag rendering only. Do not re-flag as missing in future HeroUI parity comparisons.
- **Statistic, Timeline, Image, Transfer, FileUpload, Cascader, CommandPalette** (all new) — a 7-component batch closing the general-purpose (non-HeroUI) library gaps identified by a 4-agent cross-library research pass (PrimeVue, Vuetify, Element Plus, Naive UI, Ant Design, Arco Design, MUI, Mantine, Chakra UI). Carousel and Tags Input were also identified but explicitly out of scope. Design rationale lives in `docs/superpowers/specs/2026-07-13-component-gap-batch-design.md` (gitignored, local only). None needed a new npm dependency — all compose existing Reka UI primitives/Auron components. Notable implementation decisions and bugs caught by live-browser verification (not just unit tests):
  - **Image** composes reka-ui's `AvatarRoot`/`AvatarImage`/`AvatarFallback` (generic load-state trackers despite the "Avatar" naming) + `@vueuse/core`'s `useIntersectionObserver` for lazy-load + the existing `Modal` for zoom. Had two root nodes (image box + lightbox Modal) — fallthrough `style`/attrs silently no-op on multi-root SFCs; fixed with `inheritAttrs: false` + manual `v-bind="attrs"` on the real box.
  - **Transfer** composes two `ListBox` instances (`selection-mode="multiple"`, not the `multiple` boolean prop — `multiple` only aliases the internal Reka binding, not ListBox's own emit-coercion logic, which silently unwraps arrays back to a single string without it).
  - **Cascader** reuses `Tree`'s `items`/`getKey`/`getChildren` recursive shape and mirrors its Left/Right keyboard semantics for cascading-columns navigation; built on `Popover` + plain buttons (not `ListBox`, which doesn't fit a per-column single-select model as cleanly).
  - **CommandPalette** composes `Modal` + `ListBox` (deliberately not `ComboBox`, which is anchor/Popper-positioned — wrong model for a centered overlay). `ModalContent`'s root is a non-rendering `DialogPortal`, so arbitrary attrs like `data-slot` silently drop — real DOM hooks need an inner wrapper div instead. reka-ui's `DialogContent` requires a `DialogTitle`/description (wrapped in `VisuallyHidden`). Reka's dialog auto-focuses the first focusable element (a list item, not the search input) — redirected via `@open-auto-focus`. Most importantly: keyboard Up/Down/Enter had to be hand-bridged from the search input to a *virtual* active item — never fed through `ListBox`'s real `:model-value`, because reka-ui's `ListboxRoot` watches `modelValue` and steals DOM focus back from the search input as a side effect, silently eating every keystroke typed after the first re-filter. The active-row highlight is a plain class comparison instead, with the row's `:key` folded in (`` `${item.value}-${item.value === activeValue}` ``) since an in-place prop update alone didn't reliably refresh a Reka Collection-tracked item's class.
- **Transfer** — added native HTML5 drag-and-drop as an *additional* way to move a single item (drag a row, drop it on the other panel), on top of the existing checkbox+button controls, which remain the primary, always-present, keyboard-operable path (same reasoning as `FileUpload`'s dropzone — a drag-only interaction with no equivalent path is an accessibility gap, not a missing nice-to-have). Required switching each panel from `ListBox`'s shorthand `items` prop to its compound `ListBoxItem` API to attach `draggable`/`@dragstart`/`@dragend` per row. Dragging always moves exactly the one row grabbed, regardless of checkbox state (moving a whole multi-checked selection via drag is an out-of-scope future enhancement, not an oversight). Verified live: Playwright's raw `page.mouse` API does *not* reliably trigger real HTML5 DnD in Chromium — only `locator.drag_to()` (or direct `DragEvent` dispatch) does; useful to remember for testing this pattern again.
- **Cascader** — was shipped in the original batch without `variant`/`color` support even though its trigger is a field-styled box just like `Input`/`InputGroup` (an oversight, same class as the earlier InputGroup gap). Added `variant` (flat/bordered/faded/underlined/raised) and `color` (default/primary/secondary/accent/success/warning/danger) to `cascaderVariants`/`Cascader.vue`, mirroring `.input--*`/`.input-group--*` CSS one-for-one but keyed off `:focus-visible`/`[data-state="open"]` instead of `:focus-within`, since the trigger is a single `<button>`, not a wrapper around a native input.

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->
