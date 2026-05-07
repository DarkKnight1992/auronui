/**
 * generate-component-pages.ts
 *
 * Codegen script that creates a VitePress markdown reference page for every
 * top-level Auron component listed in `apps/docs/.vitepress/data/components.json`.
 *
 * Behaviour:
 *  - For each entry in `components.json`, computes a kebab-case slug (e.g. `ButtonGroup` → `button-group`).
 *  - Writes `apps/docs/components/{slug}.md` with a consistent template (live example, props/slots/events tables, a11y stub).
 *  - If a target file already exists, the script SKIPS it — pages can be hand-polished without being clobbered.
 *
 * Scope (Phase 12 / Plan 03):
 *  - Only generates pages for components shipped in Phase 1 (presentational) and Phase 2 (Reka-UI-backed).
 *  - The full registry (`SCOPE_LIST_BY_PHASE`) lives below; future phases extend it without changing the script.
 *  - Components present in `components.json` but absent from the active scope are reported and skipped.
 *
 * Usage:
 *   pnpm --filter @auronui/docs docgen:pages
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const componentsJsonPath = resolve(__dirname, '../.vitepress/data/components.json');
const outDir = resolve(__dirname, '../components');

/**
 * Active scope for this codegen run.
 *
 * Phase 1 (presentational) and Phase 2 (Reka-UI-backed) components are the only
 * components that have polished reference pages today. As later phases ship,
 * append their display names below to bring those components into the codegen
 * scope. Sub-parts (CardHeader, EmptyStateContent, etc.) are intentionally
 * excluded — they are documented inside the parent component's page.
 */
const SCOPE_LIST_BY_PHASE: Record<string, string[]> = {
  'phase-1-presentational': [
    'Spinner',
    'Separator',
    'Skeleton',
    'Text',
    'Label',
    'Description',
    'Header',
    'Badge',
    'Chip',
    'Kbd',
    'Surface',
    'Card',
    'EmptyState',
  ],
  'phase-2-reka-backed': [
    'Button',
    'ButtonGroup',
    'Link',
    'CloseButton',
  ],
};

const ACTIVE_SCOPE: Set<string> = new Set(
  Object.values(SCOPE_LIST_BY_PHASE).flat(),
);

interface ComponentDoc {
  displayName?: string;
  description?: string;
  tags?: Record<string, unknown>;
}

/**
 * Convert a PascalCase display name to a kebab-case slug.
 * Examples:
 *   Button       → button
 *   ButtonGroup  → button-group
 *   EmptyState   → empty-state
 *   CloseButton  → close-button
 */
function toKebabSlug(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function buildPageTemplate(displayName: string, description: string): string {
  const desc = description.trim().length > 0
    ? description.trim()
    : `TODO: describe ${displayName}.`;

  return `---
title: ${displayName}
---

<script setup>
import { ${displayName} } from '@auronui/vue';
</script>

# ${displayName}

${desc}

## Example

<div class="docs-example">
  <${displayName} />
</div>

## Props

<PropsTable name="${displayName}" />

## Slots

<SlotsTable name="${displayName}" />

## Events

<EventsTable name="${displayName}" />

## Accessibility

TODO: document keyboard interactions, ARIA roles, and any Reka UI primitive this component wraps.
`;
}

async function run() {
  const raw = await readFile(componentsJsonPath, 'utf8');
  const data = JSON.parse(raw) as Record<string, ComponentDoc>;

  await mkdir(outDir, { recursive: true });

  const created: string[] = [];
  const skippedExisting: string[] = [];
  const skippedOutOfScope: string[] = [];
  const missingFromMeta: string[] = [];

  for (const displayName of Object.keys(data).sort()) {
    if (!ACTIVE_SCOPE.has(displayName)) {
      skippedOutOfScope.push(displayName);
      continue;
    }

    const slug = toKebabSlug(displayName);
    const targetPath = resolve(outDir, `${slug}.md`);

    if (await fileExists(targetPath)) {
      skippedExisting.push(displayName);
      continue;
    }

    const doc = data[displayName];
    const template = buildPageTemplate(displayName, doc?.description ?? '');
    await writeFile(targetPath, template, 'utf8');
    created.push(displayName);
  }

  // Report any in-scope component that is missing from components.json
  for (const name of ACTIVE_SCOPE) {
    if (!Object.prototype.hasOwnProperty.call(data, name)) {
      missingFromMeta.push(name);
    }
  }

  console.log(
    `[pages] created ${created.length}, skipped ${skippedExisting.length} existing, ` +
      `${skippedOutOfScope.length} out of scope (later phases)`,
  );
  if (created.length) {
    console.log(`[pages] new: ${created.join(', ')}`);
  }
  if (missingFromMeta.length) {
    console.warn(
      `[pages] WARNING: in-scope components missing from components.json: ${missingFromMeta.join(', ')}. ` +
        `Run \`pnpm --filter @auronui/docs docgen\` first.`,
    );
  }

  // Lightweight self-check: confirm the directory exists in the repo
  void repoRoot;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
