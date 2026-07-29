/**
 * Code-derived extraction for the AI-rules generator.
 *
 * Everything the generated rules claim about the library — which components
 * exist, what props they take, which values a `variant`/`color`/`size` prop
 * accepts — is read out of the source here. `template.md` only carries prose
 * and hand-written usage examples; it must never be the source of truth for
 * an API fact, because it has no way of noticing when the code moves.
 *
 * Three inputs:
 *   packages/styles/src/components/<c>/<c>.styles.ts  → tailwind-variants enums
 *   packages/vue/src/components/<folder>/*.vue        → props / emits / models
 *   packages/vue/src/index.ts                         → the public export roster
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const VUE_ROOT = resolve(__dirname, '../..')
export const REPO_ROOT = resolve(__dirname, '../../../..')
const STYLES_ROOT = join(REPO_ROOT, 'packages/styles/src/components')
const COMPONENTS_ROOT = join(VUE_ROOT, 'src/components')

/* ── generic brace/bracket scanning ─────────────────────────────────────── */

const OPEN = { '{': '}', '(': ')', '[': ']' }
const CLOSE = { '}': '{', ')': '(', ']': '[' }

/**
 * Returns the body of the block that opens at `openIdx` (which must point at
 * one of `{([`), skipping over string literals, template literals and
 * comments so a brace inside `"a{b"` never throws the depth count off.
 */
function readBlock(src, openIdx) {
  const stack = [src[openIdx]]
  let i = openIdx + 1
  while (i < src.length && stack.length) {
    const ch = src[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipString(src, i)
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i)
      if (i === -1) break
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end === -1 ? src.length : end + 2
      continue
    }
    if (OPEN[ch]) stack.push(ch)
    else if (CLOSE[ch]) {
      if (stack[stack.length - 1] === CLOSE[ch]) stack.pop()
      else return null // unbalanced — bail rather than guess
    }
    i++
  }
  return { body: src.slice(openIdx + 1, i - 1), end: i }
}

function skipString(src, i) {
  const quote = src[i]
  let j = i + 1
  while (j < src.length) {
    if (src[j] === '\\') { j += 2; continue }
    if (src[j] === quote) return j + 1
    // template literals can nest expressions containing more strings
    if (quote === '`' && src[j] === '$' && src[j + 1] === '{') {
      const block = readBlock(src, j + 1)
      if (!block) return src.length
      j = block.end
      continue
    }
    j++
  }
  return j
}

/** Top-level `key: value` pairs of an object/type-literal body. */
function objectEntries(body) {
  const out = []
  let i = 0
  while (i < body.length) {
    const ch = body[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      // a quoted key, e.g. 'update:modelValue': [...]
      const end = skipString(body, i)
      const key = body.slice(i + 1, end - 1)
      const rest = readMember(body, end, key)
      if (rest) { out.push(rest.member); i = rest.next; continue }
      i = end
      continue
    }
    if (ch === '/' && body[i + 1] === '/') { i = nextLine(body, i); continue }
    if (ch === '/' && body[i + 1] === '*') {
      const end = body.indexOf('*/', i + 2)
      i = end === -1 ? body.length : end + 2
      continue
    }
    if (/[A-Za-z_$]/.test(ch)) {
      const m = /^[A-Za-z0-9_$]+/.exec(body.slice(i))
      const key = m[0]
      const rest = readMember(body, i + key.length, key)
      if (rest) { out.push(rest.member); i = rest.next; continue }
      i += key.length
      continue
    }
    if (OPEN[ch]) {
      const block = readBlock(body, i)
      i = block ? block.end : i + 1
      continue
    }
    i++
  }
  return out
}

/** After a key, consume `?`, `:` and the value expression up to the member end. */
function readMember(body, afterKey, key) {
  let i = afterKey
  let optional = false
  while (i < body.length && /\s/.test(body[i])) i++
  if (body[i] === '?') { optional = true; i++ }
  while (i < body.length && /\s/.test(body[i])) i++
  if (body[i] !== ':') return null
  i++
  const start = i
  // consume the value until a top-level `,` `;` or newline that leaves every
  // bracket closed — covers both `a: 'x'` and multi-line `a: Partial<{...}>`
  let angle = 0
  while (i < body.length) {
    const ch = body[i]
    if (ch === '"' || ch === "'" || ch === '`') { i = skipString(body, i); continue }
    if (ch === '/' && body[i + 1] === '/') { i = nextLine(body, i); continue }
    if (ch === '/' && body[i + 1] === '*') {
      const end = body.indexOf('*/', i + 2)
      i = end === -1 ? body.length : end + 2
      continue
    }
    if (OPEN[ch]) {
      const block = readBlock(body, i)
      if (!block) { i++; continue }
      i = block.end
      continue
    }
    if (ch === '<') { angle++; i++; continue }
    if (ch === '>' && angle > 0) { angle--; i++; continue }
    if (angle === 0 && (ch === ',' || ch === ';')) { i++; break }
    if (angle === 0 && ch === '\n') {
      // a union continued on the next line keeps the member open
      const ahead = body.slice(i + 1).match(/^\s*(\||&)/)
      const behind = body.slice(start, i).trimEnd()
      if (!ahead && !/[|&=(]$/.test(behind)) break
    }
    i++
  }
  return {
    member: { key, optional, value: body.slice(start, i).replace(/[,;]\s*$/, '').trim() },
    next: i,
  }
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function nextLine(s, i) {
  const n = s.indexOf('\n', i)
  return n === -1 ? s.length : n + 1
}

/* ── styles: tailwind-variants enums ────────────────────────────────────── */

/**
 * `{ Button: { variant: { values: [...], default: 'solid' }, ... } }`
 * keyed by the PascalCase name implied by `export const buttonVariants`.
 */
export function extractStyleVariants() {
  const out = {}
  for (const folder of readdirSync(STYLES_ROOT)) {
    const file = join(STYLES_ROOT, folder, `${folder}.styles.ts`)
    if (!existsSync(file)) continue
    const src = readFileSync(file, 'utf8')
    for (const m of src.matchAll(/export const (\w+)Variants\s*=\s*tv\s*\(/g)) {
      const name = m[1][0].toUpperCase() + m[1].slice(1)
      const open = src.indexOf('{', m.index + m[0].length - 1)
      const cfg = readBlock(src, open)
      if (!cfg) continue
      out[name] = readVariantConfig(cfg.body)
    }
  }
  return out
}

function readVariantConfig(body) {
  const keys = {}
  const defaults = {}
  const slots = []
  for (const entry of objectEntries(body)) {
    if (entry.key === 'defaultVariants') {
      const block = readBlock(entry.value, entry.value.indexOf('{'))
      if (block) {
        for (const d of objectEntries(block.body)) {
          defaults[d.key] = d.value.replace(/^["']|["'],?$/g, '')
        }
      }
    } else if (entry.key === 'slots') {
      const block = readBlock(entry.value, entry.value.indexOf('{'))
      if (block) slots.push(...objectEntries(block.body).map(s => s.key))
    } else if (entry.key === 'variants') {
      const block = readBlock(entry.value, entry.value.indexOf('{'))
      if (!block) continue
      for (const v of objectEntries(block.body)) {
        const inner = readBlock(v.value, v.value.indexOf('{'))
        if (!inner) continue
        keys[v.key] = { values: objectEntries(inner.body).map(x => x.key) }
      }
    }
  }
  for (const [k, v] of Object.entries(defaults)) {
    if (keys[k]) keys[k].default = v
  }
  return { keys, slots }
}

/* ── components: props, emits, v-models ─────────────────────────────────── */

function scriptOf(sfc, setupOnly = true) {
  // must match the real block tag, not the words "<script setup>" written
  // inside a doc comment (Popover/HoverCard both mention it in prose)
  const re = setupOnly ? /^<script\b[^>]*\bsetup\b[^>]*>/m : /^<script\b[^>]*>/m
  const tag = re.exec(sfc)
  if (!tag) return ''
  const open = tag.index + tag[0].length
  const end = sfc.indexOf('</script>', open)
  return sfc.slice(open, end === -1 ? sfc.length : end)
}

/**
 * A handful of components (Popover, Tooltip, Drawer, HoverCard) are written
 * with `defineComponent({ props: {...} })` render functions rather than
 * `<script setup>`, because Reka's controlled/uncontrolled detection needs a
 * prop key omitted entirely rather than passed as `undefined`. Their props are
 * runtime declarations, so they need their own reader.
 */
function optionsApiApi(sfc) {
  const script = scriptOf(sfc, false)
  const decl = /defineComponent\s*\(\s*\{/.exec(script)
  if (!decl) return null
  const block = readBlock(script, decl.index + decl[0].length - 1)
  if (!block) return null
  const props = []
  const emits = []
  for (const entry of objectEntries(block.body)) {
    if (entry.key === 'props') {
      const obj = readBlock(entry.value, entry.value.indexOf('{'))
      if (!obj) continue
      let cursor = 0
      for (const p of objectEntries(obj.body)) {
        const at = obj.body.indexOf(p.key, cursor)
        const meta = at === -1 ? {} : docBefore(obj.body, at)
        cursor = at === -1 ? cursor : at + p.key.length
        const type = /type:\s*([A-Za-z]+)/.exec(p.value)
        const def = /default:\s*([^,}\n]+)/.exec(p.value)
        props.push({
          name: p.key,
          type: (type ? type[1] : p.value.trim()).toLowerCase() === 'boolean'
            ? 'boolean'
            : type
              ? type[1].toLowerCase()
              : p.value.trim(),
          optional: true,
          doc: meta.doc,
          deprecated: meta.deprecated,
          default:
            def && def[1].trim() !== 'undefined'
              ? def[1].trim().replace(/^['"]|['"]$/g, '')
              : meta.default,
        })
      }
    } else if (entry.key === 'emits') {
      for (const m of entry.value.matchAll(/['"]([^'"]+)['"]/g)) emits.push({ name: m[1], payload: '' })
    }
  }
  return { props, emits }
}

/** JSDoc immediately preceding `idx`, as { doc, deprecated, default }. */
function docBefore(body, idx) {
  const before = body.slice(0, idx)
  // the *nearest* preceding block, and only if nothing but whitespace sits
  // between it and the member — a leftmost regex match would span from the
  // first `/**` in the whole body to the last `*/`
  const open = before.lastIndexOf('/**')
  if (open === -1) return {}
  const close = before.indexOf('*/', open + 3)
  if (close === -1 || before.slice(close + 2).trim() !== '') return {}
  const text = before
    .slice(open + 3, close)
    .split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim()
  const deprecated = /@deprecated\s*(.*)/.exec(text)
  const def = /@default\s+(.*)/.exec(text)
  const doc = text
    .replace(/@deprecated[\s\S]*/, '')
    .replace(/@default.*/g, '')
    .replace(/@example[\s\S]*/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    doc: doc || undefined,
    deprecated: deprecated ? deprecated[1].trim() || true : undefined,
    default: def ? def[1].trim().replace(/^['"]|['"]$/g, '') : undefined,
  }
}

/** Members of a type-literal body, with the JSDoc that precedes each. */
function membersWithDocs(body) {
  const members = []
  let cursor = 0
  for (const entry of objectEntries(body)) {
    // match the key as a whole word in declaration position, so looking up
    // `disabled` doesn't land inside an earlier `isDisabled`
    const re = new RegExp(`(?:^|[^\\w$])(${escapeRe(entry.key)})\\s*\\??\\s*:`, 'g')
    re.lastIndex = cursor
    const hit = re.exec(body)
    const at = hit ? hit.index + hit[0].indexOf(hit[1]) : -1
    const meta = at === -1 ? {} : docBefore(body, at)
    cursor = at === -1 ? cursor : at + entry.key.length
    members.push({ ...entry, ...meta })
  }
  return members
}

function propsBody(script) {
  // withDefaults(defineProps<{...}>(), {...})  |  defineProps<{...}>()
  // withDefaults(defineProps<Props>(), {...})  → resolve the local alias
  const call = /defineProps\s*<\s*/.exec(script)
  if (!call) return null
  const after = script.slice(call.index + call[0].length)
  if (after.startsWith('{')) {
    const block = readBlock(after, 0)
    return block ? block.body : null
  }
  const alias = /^([A-Za-z_$][\w$]*)/.exec(after)
  if (!alias) return null
  const decl = new RegExp(`(?:type\\s+${alias[1]}\\s*=|interface\\s+${alias[1]})\\s*\\{`).exec(script)
  if (!decl) return null
  const block = readBlock(script, decl.index + decl[0].length - 1)
  return block ? block.body : null
}

function defaultsBody(script) {
  const call = /withDefaults\s*\(/.exec(script)
  if (!call) return {}
  const args = readBlock(script, call.index + call[0].length - 1)
  if (!args) return {}
  const objAt = args.body.lastIndexOf('{')
  if (objAt === -1) return {}
  const obj = readBlock(args.body, objAt)
  if (!obj) return {}
  const out = {}
  for (const e of objectEntries(obj.body)) out[e.key] = e.value.trim()
  return out
}

function emitsOf(script) {
  const call = /defineEmits\s*<\s*\{/.exec(script)
  if (!call) return []
  const block = readBlock(script, call.index + call[0].length - 1)
  if (!block) return []
  return objectEntries(block.body).map(e => ({
    name: e.key,
    payload: e.value.replace(/^\[|\]$/g, '').trim(),
  }))
}

function modelsOf(script) {
  const out = []
  for (const m of script.matchAll(/defineModel\s*<([^>]*)>\s*\(\s*(['"]([^'"]+)['"])?/g)) {
    out.push({ name: m[3] || 'modelValue', type: m[1].trim() })
  }
  return out
}

function slotsOf(sfc) {
  const names = new Set()
  for (const m of sfc.matchAll(/<slot[^>]*\bname=["']([^"']+)["']/g)) names.add(m[1])
  if (/<slot(?![^>]*\bname=)/.test(sfc)) names.add('default')
  return [...names]
}

/** Parse one SFC into its public API surface. */
export function extractComponentFile(file) {
  const sfc = readFileSync(file, 'utf8')
  const script = scriptOf(sfc)
  const body = propsBody(script)
  const defaults = defaultsBody(script)
  if (!body && !script.trim()) {
    const opts = optionsApiApi(sfc)
    if (opts) {
      return {
        name: basename(file, '.vue'),
        file,
        props: opts.props,
        emits: opts.emits,
        models: [],
        slots: slotsOf(sfc),
        legacyVariants: [],
      }
    }
  }
  const props = body
    ? membersWithDocs(body).map(p => ({
        name: p.key,
        type: p.value.replace(/\s+/g, ' ').trim(),
        optional: p.optional,
        doc: p.doc,
        deprecated: p.deprecated,
        default:
          p.default ??
          (defaults[p.key] && defaults[p.key] !== 'undefined'
            ? defaults[p.key].replace(/^['"]|['"]$/g, '')
            : undefined),
      }))
    : []
  return {
    name: basename(file, '.vue'),
    file,
    props,
    emits: emitsOf(script),
    models: modelsOf(script),
    slots: slotsOf(sfc),
    legacyVariants: legacyVariantsOf(script),
  }
}

/**
 * Variant values a component still accepts but no longer wants used: the keys
 * of its `LEGACY_VARIANTS` back-compat map plus anything it hands to
 * `warnDeprecatedVariant()`. They live in the styles enum, so without this the
 * generated docs would advertise `variant="tertiary"` as a first-class choice.
 */
function legacyVariantsOf(script) {
  const out = new Set()
  const map = /LEGACY_VARIANTS[^=]*=\s*\{/.exec(script)
  if (map) {
    const block = readBlock(script, map.index + map[0].length - 1)
    if (block) for (const e of objectEntries(block.body)) out.add(e.key)
  }
  for (const m of script.matchAll(/warnDeprecatedVariant\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/g)) {
    out.add(m[1])
  }
  return [...out]
}

/* ── the public export roster ───────────────────────────────────────────── */

/**
 * Walks `src/index.ts`, resolving each exported name back to the `.vue` file
 * (or composable/util module) it comes from, and keeps the section comments
 * so generated output can follow the same order as the source.
 */
export function extractExports() {
  const indexPath = join(VUE_ROOT, 'src/index.ts')
  const src = readFileSync(indexPath, 'utf8')
  const values = []
  const types = []

  const re = /export\s+(type\s+)?\{([^}]*)\}\s*from\s*["']([^"']+)["']/g
  for (const m of src.matchAll(re)) {
    const isType = Boolean(m[1])
    const from = m[3]
    for (let spec of m[2].split(',')) {
      spec = spec.trim()
      if (!spec) continue
      const typeOnly = isType || /^type\s+/.test(spec)
      spec = spec.replace(/^type\s+/, '')
      const [local, exported] = spec.split(/\s+as\s+/).map(s => s.trim())
      const name = exported || local
      ;(typeOnly ? types : values).push({ name, local, from })
    }
  }

  // resolve component names → SFC path via each folder barrel
  const componentFiles = {}
  const reExports = {}
  for (const v of values) {
    if (!v.from.startsWith('./components/')) continue
    const barrel = join(VUE_ROOT, 'src', v.from.slice(2), 'index.ts')
    if (!existsSync(barrel)) continue
    const barrelSrc = readFileSync(barrel, 'utf8')
    // a barrel line can re-export more than the default, e.g.
    // `export { default as Modal, useModalProvide } from './Modal.vue'`
    for (const line of barrelSrc.matchAll(/export\s*\{([^}]*)\}\s*from\s*["']\.\/([^"']+\.vue)["']/g)) {
      const specs = line[1].split(',').map(s => s.trim())
      if (!specs.some(s => new RegExp(`^default\\s+as\\s+${escapeRe(v.local)}$`).test(s))) continue
      componentFiles[v.name] = join(dirname(barrel), line[2])
      break
    }
    if (componentFiles[v.name]) continue
    // some barrels just forward a third-party component (Icon → @iconify/vue)
    const ext = new RegExp(
      `export\\s*\\{[^}]*\\b${escapeRe(v.local)}\\b[^}]*\\}\\s*from\\s*["']([^."'][^"']*)["']`,
    ).exec(barrelSrc)
    if (ext) reExports[v.name] = ext[1]
  }

  // public composables, wherever they are re-exported from (`useToast` ships
  // out of `./components/toast`). The per-component `useXProvide`/`useXInject`
  // context helpers are excluded — they are plumbing, not the documented API.
  const composables = values
    .filter(v => /^use[A-Z]/.test(v.name) && !/(Provide|Inject)$/.test(v.name))
    .map(v => v.name)

  return { values, types, componentFiles, composables, reExports }
}

/* ── everything, joined ─────────────────────────────────────────────────── */

export function extractAll() {
  const styles = extractStyleVariants()
  const { values, types, componentFiles, composables, reExports } = extractExports()

  const components = {}
  for (const [name, file] of Object.entries(componentFiles)) {
    const parsed = extractComponentFile(file)
    parsed.exportedAs = name
    parsed.styleKey = styles[name] ? name : undefined
    components[name] = parsed
  }

  // resolve `XVariants['key']` prop types against the styles enums
  for (const c of Object.values(components)) {
    for (const p of c.props) {
      const ref = /^(\w+)Variants\[['"](\w+)['"]\]/.exec(p.type)
      if (!ref) continue
      const owner = ref[1][0].toUpperCase() + ref[1].slice(1)
      const key = styles[owner]?.keys[ref[2]]
      if (!key) continue
      p.enum = key.values
      p.extra = p.type
        .slice(ref[0].length)
        .split('|')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      if (p.default === undefined && key.default) p.default = key.default
    }
  }

  return { styles, components, composables, exports: values, types, componentFiles, reExports }
}

/** Every string-literal union or resolved enum for a prop, as plain values. */
export function propValues(prop) {
  if (prop.enum) return [...prop.enum, ...(prop.extra || [])]
  const t = prop.type
  if (!/^['"]/.test(t.trim())) return null
  const parts = t.split('|').map(s => s.trim())
  if (!parts.every(p => /^(['"]).*\1$/.test(p))) return null
  return parts.map(p => p.slice(1, -1))
}
