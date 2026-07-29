#!/usr/bin/env node
/**
 * Builds the AI-assistant rule artifacts from source.
 *
 *   packages/vue/ai-rules.md   shipped in the npm package, copied into a
 *                              consumer's project by `npx @auronui/vue setup-ai`
 *   llms-full.txt              ai-rules.md + the full generated API reference
 *   llms.txt                   the short llms.txt-standard summary
 *
 * `template.md` supplies prose and hand-written usage examples only. Every
 * API fact — the component roster, prop names, `variant`/`color`/`size` values,
 * defaults — is read from the code by extract.mjs and injected here, and the
 * hand-written examples are checked against the same data. Drift fails the
 * build instead of quietly shipping wrong rules to consumers.
 *
 * Run with --check to validate without writing (used by `pnpm build`).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractAll, propValues, VUE_ROOT, REPO_ROOT } from './extract.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const checkOnly = process.argv.includes('--check')

const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const data = extractAll()
const problems = []

/* ── roster helpers ─────────────────────────────────────────────────────── */

const allNames = [...Object.keys(data.components), ...Object.keys(data.reExports)].sort()

/**
 * Components are grouped by their source folder rather than by name prefix:
 * `Tab`/`TabList`/`TabPanel` belong to Tabs and `SplitterPanel` to
 * SplitterGroup, neither of which a prefix rule would catch. The family head
 * is whichever member `src/index.ts` exports first, which is always the root
 * of a compound component.
 */
const exportOrder = new Map(data.exports.map((v, i) => [v.name, i]))
const families = {}
const familyHead = {}
for (const name of allNames) {
  const file = data.componentFiles[name]
  const folder = file ? file.split('/').slice(-2)[0] : name
  ;(families[folder] ??= []).push(name)
}
for (const [folder, members] of Object.entries(families)) {
  members.sort((a, b) => (exportOrder.get(a) ?? 0) - (exportOrder.get(b) ?? 0))
  // the member named after its own folder is the root when one exists
  // (`toast/` exports ToastProvider first, but Toast is the component)
  familyHead[folder] = members.find(m => kebab(m) === folder) ?? members[0]
}

const topLevel = Object.values(familyHead).sort()
const membersOf = head => families[Object.keys(familyHead).find(f => familyHead[f] === head)]

/* ── rendering ──────────────────────────────────────────────────────────── */

/** Props worth naming in the compact index: the ones with a fixed value set. */
function enumProps(component) {
  if (!component?.props) return []
  const legacy = new Set(component.legacyVariants || [])
  return component.props
    .filter(p => !p.deprecated)
    .map(p => ({ name: p.name, values: propValues(p), default: p.default }))
    .filter(p => p.values && p.values.length > 1)
    // legacy names are variant values only — `danger` is a legacy *variant*
    // but a perfectly current *color*
    .map(p => (p.name === 'variant' ? { ...p, values: p.values.filter(v => !legacy.has(v)) } : p))
    .filter(p => p.values.length > 1)
}

function renderEnum(p) {
  const values = p.values.join(' | ')
  return p.default ? `${p.name}: ${values} — defaults to ${p.default}` : `${p.name}: ${values}`
}

/** `classNames` is always a per-slot override map; name the slots, not the type. */
function renderClassNames(prop) {
  const slots = [...prop.type.matchAll(/(\w+)\s*:\s*ClassValue/g)].map(m => m[1])
  return slots.length
    ? `\`classNames?\` — per-slot class overrides: ${slots.join(', ')}`
    : `\`classNames?\` — per-slot class overrides`
}

/** One line per component family: the names it exports and its enum props. */
function renderComponentIndex() {
  const lines = [
    '',
    'Every name below is exported from `@auronui/vue`. Sub-components are listed',
    'with their parent — a compound component must be used with them, never alone.',
    'Values shown are the complete accepted set; anything else is invalid.',
    '',
  ]
  for (const head of topLevel) {
    const members = membersOf(head)
    const c = data.components[head]
    const parts = [`**${head}**`]
    if (members.length > 1) parts.push(`— ${members.filter(m => m !== head).join(', ')}`)
    lines.push(parts.join(' '))
    if (data.reExports[head]) {
      lines.push(`  - re-exported from \`${data.reExports[head]}\``)
    }
    for (const p of enumProps(c)) lines.push(`  - ${renderEnum(p)}`)
    const models = c?.models ?? []
    if (models.length) {
      lines.push(
        `  - v-model: ${models
          .map(m => (m.name === 'modelValue' ? `\`v-model\` (${m.type})` : `\`v-model:${kebab(m.name)}\` (${m.type})`))
          .join(', ')}`,
      )
    }
    const legacy = c?.legacyVariants ?? []
    if (legacy.length) {
      lines.push(`  - deprecated variants, do not generate: ${legacy.join(', ')}`)
    }
    lines.push('')
  }
  lines.push('')
  return lines.join('\n')
}

/** The exhaustive per-component prop list — llms-full.txt only. */
function renderApiReference() {
  const out = ['## Full API Reference', '', '> Generated from source. Every prop of every exported component.', '']
  for (const head of topLevel) {
    out.push(`### ${head}`, '')
    for (const name of membersOf(head)) {
      const c = data.components[name]
      if (!c) {
        out.push(`**${name}** — re-exported from \`${data.reExports[name]}\``, '')
        continue
      }
      out.push(`**${name}**`)
      const legacy = new Set(c.legacyVariants || [])
      for (const p of c.props) {
        if (p.name === 'classNames') {
          out.push(`- ${renderClassNames(p)}`)
          continue
        }
        const values = propValues(p)
        const live = p.name === 'variant' ? values?.filter(v => !legacy.has(v)) : values
        const type = live ? live.map(v => `'${v}'`).join(' | ') : p.type
        const bits = [`\`${p.name}${p.optional ? '?' : ''}: ${type}\``]
        if (p.default !== undefined) bits.push(`default \`${p.default}\``)
        if (p.doc) bits.push(p.doc)
        if (p.deprecated) bits.push(`**deprecated** — ${p.deprecated === true ? 'do not use' : p.deprecated}`)
        if (values && live.length !== values.length) {
          bits.push(`also accepts, but do not generate: ${values.filter(v => legacy.has(v)).join(', ')}`)
        }
        out.push(`- ${bits.join(' — ')}`)
      }
      for (const m of c.models) {
        out.push(`- \`${m.name === 'modelValue' ? 'v-model' : `v-model:${kebab(m.name)}`}: ${m.type}\``)
      }
      if (c.emits.length) {
        out.push(`- emits: ${c.emits.map(e => `\`@${e.name}\``).join(', ')}`)
      }
      if (c.slots.length) {
        out.push(`- slots: ${c.slots.map(s => `\`#${s}\``).join(', ')}`)
      }
      out.push('')
    }
  }
  return out.join('\n')
}

function renderImports() {
  // every value export of the package, not just the components — composables,
  // context helpers and class utilities are public API too
  const names = [...new Set(data.exports.map(v => v.name))].sort()
  const lines = ['```ts', 'import {']
  let row = ' '
  for (const n of names) {
    if (row.length + n.length + 2 > 78) {
      lines.push(`${row}`)
      row = ' '
    }
    row += ` ${n},`
  }
  if (row.trim()) lines.push(row)
  lines.push("} from '@auronui/vue'", '```')
  return lines.join('\n')
}

/**
 * The full composable roster. The sections above document the common ones by
 * hand; this makes sure none is invisible just because nobody wrote an example.
 */
function renderComposables(md) {
  const documented = new Set([...md.matchAll(/^### (use[A-Za-z]+)/gm)].map(m => m[1]))
  const rest = data.composables.filter(n => !documented.has(n)).sort()
  if (!rest.length) return ''
  return [
    '',
    'Also exported, same import path, no separate example above:',
    '',
    ...rest.map(n => `- \`${n}()\``),
    '',
  ].join('\n')
}

/* ── template checks + rewrites ─────────────────────────────────────────── */

/**
 * The template's usage examples carry `<!-- variant: a | b -->` annotation
 * lines. Rewrite each from the code so an example can never advertise a value
 * that no longer exists (or miss one that was added).
 */
function syncEnumComments(md) {
  const lines = md.split('\n')
  let current = null
  let rewritten = 0
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^\*\*([A-Za-z][A-Za-z0-9 /]*)\*\*/)
    if (heading) current = heading[1].split('/').map(s => s.trim())
    const comment = lines[i].match(/^(\s*)<!--\s*([A-Za-z][A-Za-z0-9]*):\s*([^>]*?)\s*-->$/)
    if (!comment || !current) continue
    const [, indent, key, body] = comment
    if (body.includes('—') || body.includes(':')) continue // prose annotation, not an enum
    const owner = current
      .map(n => data.components[n])
      .find(c => c && enumProps(c).some(p => p.name === key))
    if (!owner) continue
    const prop = enumProps(owner).find(p => p.name === key)
    const next = `${indent}<!-- ${renderEnum(prop)} -->`
    if (lines[i] !== next) {
      rewritten++
      lines[i] = next
    }
  }
  return { md: lines.join('\n'), rewritten }
}

/** Component names used in template examples must actually exist. */
const KNOWN_NON_COMPONENTS = new Set([
  // deliberately shown in anti-pattern examples as names that do NOT exist
  'TabsList', 'TabsTrigger', 'TabsContent',
  // types / values referenced in prose, not components
  'Ref', 'DateValue', 'Time', 'File', 'Color', 'Partial', 'Record', 'Set', 'Array',
])

function checkGhostComponents(md) {
  const known = new Set([...allNames, ...data.composables])
  const used = new Set([...md.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map(m => m[1]))
  for (const name of used) {
    if (known.has(name) || KNOWN_NON_COMPONENTS.has(name)) continue
    problems.push(`template.md uses <${name}>, which @auronui/vue does not export`)
  }
}

/**
 * Static attribute values in the hand-written examples must be real members of
 * the prop's enum — this is what caught `<Badge variant="solid">` and
 * `<Button variant="light">` long after both values had been renamed away.
 * Anti-pattern examples are skipped: they show wrong code on purpose.
 */
function checkExampleValues(md) {
  for (const tag of md.matchAll(/<([A-Z][A-Za-z0-9]*)\b([^>]*)>/g)) {
    const component = data.components[tag[1]]
    if (!component) continue
    const line = md.slice(0, tag.index).split('\n').length
    if (isInAntiPattern(md, tag.index)) continue
    for (const attr of tag[2].matchAll(/(?:^|\s):?([a-z][a-z0-9-]*)="([^"{]*)"/g)) {
      const name = attr[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      const prop = component.props.find(p => p.name === name)
      if (!prop) continue
      if (prop.deprecated) {
        problems.push(
          `template.md:${line} <${tag[1]} ${attr[1]}> is deprecated — ` +
            `${prop.deprecated === true ? 'do not document it' : prop.deprecated}`,
        )
        continue
      }
      const values = propValues(prop)
      if (!values || values.includes(attr[2])) continue
      problems.push(
        `template.md:${line} <${tag[1]} ${attr[1]}="${attr[2]}"> — ` +
          `${tag[1]}.${name} accepts ${values.join(' | ')}`,
      )
    }
  }
}

/** Annotation lines like `<!-- disabled: boolean -->` must not name a
 *  deprecated prop either — those are read as recommendations. */
function checkDeprecatedAnnotations(md) {
  const lines = md.split('\n')
  let current = null
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^\*\*([A-Za-z][A-Za-z0-9 /]*)\*\*/)
    if (heading) current = heading[1].split('/').map(s => s.trim())
    const comment = lines[i].match(/^\s*<!--\s*([A-Za-z][A-Za-z0-9]*):/)
    if (!comment || !current) continue
    for (const name of current) {
      const prop = data.components[name]?.props.find(p => p.name === comment[1] && p.deprecated)
      if (prop) {
        problems.push(
          `template.md:${i + 1} documents ${name}.${prop.name}, which is deprecated — ` +
            `${prop.deprecated === true ? 'drop it' : prop.deprecated}`,
        )
      }
    }
  }
}

/** Anti-pattern blocks deliberately contain invalid code. */
function isInAntiPattern(md, index) {
  const before = md.slice(0, index)
  const fenceStart = before.lastIndexOf('```')
  if (fenceStart === -1) return false
  const block = md.slice(fenceStart, index)
  const lastNever = block.lastIndexOf('❌')
  const lastAlways = block.lastIndexOf('✅')
  return lastNever > lastAlways
}

/** Every top-level component needs a prose section of its own. */
function checkCoverage(md) {
  const section = md.slice(md.indexOf('## Components'), md.indexOf('## Common Patterns'))
  const documented = new Set(
    [...section.matchAll(/^\*\*([^*]+)\*\*/gm)].flatMap(m => m[1].split('/').map(s => s.trim())),
  )
  const missing = topLevel.filter(n => !documented.has(n))
  if (missing.length) {
    problems.push(
      `template.md has no section for ${missing.length} exported component(s): ${missing.join(', ')}`,
    )
  }
}

/** Composables named in the template must still be exported. */
function checkComposables(md) {
  const exported = new Set(data.composables)
  for (const m of md.matchAll(/^### (use[A-Za-z]+)/gm)) {
    if (!exported.has(m[1])) problems.push(`template.md documents ${m[1]}(), which is not exported`)
  }
}

function fillPlaceholder(md, key, value) {
  const token = `<!-- @generated:${key} -->`
  if (!md.includes(token)) {
    problems.push(`template.md is missing the ${token} placeholder`)
    return md
  }
  return md.replace(token, value)
}

/* ── build ──────────────────────────────────────────────────────────────── */

const template = readFileSync(resolve(__dirname, 'template.md'), 'utf8')

checkGhostComponents(template)
checkExampleValues(template)
checkDeprecatedAnnotations(template)
checkCoverage(template)
checkComposables(template)

const synced = syncEnumComments(template)
if (checkOnly && synced.rewritten) {
  problems.push(
    `${synced.rewritten} enum annotation(s) in template.md no longer match the code — run \`pnpm build:ai\``,
  )
}
let rules = synced.md
rules = fillPlaceholder(rules, 'component-count', String(topLevel.length))
rules = fillPlaceholder(rules, 'component-index', renderComponentIndex())
rules = fillPlaceholder(rules, 'composables', renderComposables(template))
rules = fillPlaceholder(rules, 'imports', renderImports())

if (problems.length) {
  console.error('\n✘ AI rules are out of sync with the code:\n')
  for (const p of problems) console.error(`  • ${p}`)
  console.error('\nFix packages/vue/src/ai-rules/template.md (or the code) and re-run.\n')
  process.exit(1)
}

if (synced.rewritten) {
  // write the corrections back so the fix lands in the reviewed source, not
  // only in the generated output
  writeFileSync(resolve(__dirname, 'template.md'), synced.md, 'utf8')
  console.log(`  ↻ ${synced.rewritten} enum annotation(s) re-synced into template.md`)
}

const full = `${rules}\n\n---\n\n${renderApiReference()}`

const brief = `# AuronUI

> ${topLevel.length} accessible Vue 3 components for Vue 3.5+. Built on Reka UI, Tailwind CSS 4.
> NEVER use raw HTML — use AuronUI components instead.

## Docs

- [Full AI rules](https://auronui.com/llms-full.txt): Complete component rules + API reference
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

if (checkOnly) {
  console.log(`✔ AI rules in sync (${topLevel.length} components, ${allNames.length} exports)`)
  process.exit(0)
}

const outputs = [
  [resolve(VUE_ROOT, 'ai-rules.md'), rules, 'packages/vue/ai-rules.md'],
  [resolve(REPO_ROOT, 'llms-full.txt'), full, 'llms-full.txt'],
  [resolve(REPO_ROOT, 'llms.txt'), brief, 'llms.txt'],
]
for (const [path, content, label] of outputs) {
  writeFileSync(path, content, 'utf8')
  console.log(`  ✔ ${label} (${(content.length / 1024).toFixed(1)} kB)`)
}

console.log(
  `\nGenerated from ${topLevel.length} components / ${allNames.length} exports. ` +
    'Commit them: git add packages/vue/ai-rules.md llms.txt llms-full.txt',
)
