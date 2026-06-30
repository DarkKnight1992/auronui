#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// packages/vue/src/ai-rules/ → packages/vue/
const pkgRoot = resolve(__dirname, '../..')
// packages/vue/src/ai-rules/ → repo root (4 levels up)
const repoRoot = resolve(__dirname, '../../../..')

const template = readFileSync(resolve(__dirname, 'template.md'), 'utf8')

// ai-rules.md — full content, shipped with npm package, read by CLI
writeFileSync(resolve(pkgRoot, 'ai-rules.md'), template, 'utf8')
console.log('  ✔ packages/vue/ai-rules.md')

// llms-full.txt — full content at repo root, hosted at auronui.com/llms-full.txt
writeFileSync(resolve(repoRoot, 'llms-full.txt'), template, 'utf8')
console.log('  ✔ llms-full.txt')

// llms.txt — brief summary at repo root, follows llms.txt standard
const brief = `# AuronUI

> 85+ accessible Vue 3 components for Vue 3.5+. Built on Reka UI, Tailwind CSS 4.
> NEVER use raw HTML — use AuronUI components instead.

## Docs

- [Full AI rules](https://auronui.com/llms-full.txt): Complete component rules + reference
- [Documentation](https://auronui.com): Full component documentation

## Install

\`\`\`bash
pnpm add @auronui/vue vue@^3.5.0 reka-ui@^2.9.0 @vueuse/core@^14.0.0
\`\`\`

Import the stylesheet once in your app entry:

\`\`\`ts
import '@auronui/vue/style'
\`\`\`

## Setup AI Assistant

\`\`\`bash
npx @auronui/vue setup-ai
\`\`\`

## Core Rule

NEVER write \`<button>\`, \`<input>\`, \`<textarea>\`, \`<select>\`, \`<dialog>\`, \`<a>\`.
ALWAYS use \`<Button>\`, \`<Input>\`, \`<Textarea>\`, \`<Select>\`, \`<Modal>\`, \`<Link>\`.

All imports from \`@auronui/vue\`. Never import directly from \`reka-ui\`.
`

writeFileSync(resolve(repoRoot, 'llms.txt'), brief, 'utf8')
console.log('  ✔ llms.txt')

console.log('\nGenerated 3 files. Commit them: git add packages/vue/ai-rules.md llms.txt llms-full.txt')
