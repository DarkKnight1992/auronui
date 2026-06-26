/**
 * Audits every Auron wrapper .vue file against its underlying Reka UI primitive.
 * Outputs scripts/audit-report.json with per-file gaps (missing props / emits).
 *
 * Usage: node scripts/audit-reka-props.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Use compiler-sfc from pnpm store
const sfcPath = join(root, 'node_modules/.pnpm/@vue+compiler-sfc@3.5.32/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js')
const { parse } = await import(sfcPath)

const rekaPath = join(root, 'node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/index.js')
const require = createRequire(import.meta.url)
const reka = require(rekaPath)

// Story file mapping — component directory -> story file
const STORY_MAP = {
  'drawer':             'Drawer.stories.ts',
  'modal':              'Modal.stories.ts',
  'alert-dialog':       'AlertDialog.stories.ts',
  'tooltip':            'Tooltip.stories.ts',
  'popover':            'Popover.stories.ts',
  'dropdown':           'Dropdown.stories.ts',
  'select':             'Select.stories.ts',
  'combo-box':          'ComboBox.stories.ts',
  'autocomplete':       'Autocomplete.stories.ts',
  'list-box':           'ListBox.stories.ts',
  'accordion':          'Accordion.stories.ts',
  'collapsible':        'Collapsible.stories.ts',
  'tabs':               'Tabs.stories.ts',
  'checkbox':           'Checkbox.stories.ts',
  'radio':              'Radio.stories.ts',
  'switch':             'Switch.stories.ts',
  'slider':             'Slider.stories.ts',
  'number-field':       'NumberField.stories.ts',
  'input-otp':          'InputOTP.stories.ts',
  'calendar':           'Calendar.stories.ts',
  'date-picker':        'DatePicker.stories.ts',
  'date-range-picker':  'DateRangePicker.stories.ts',
  'date-range-field':   'DateRangeField.stories.ts',
  'date-time-picker':   'DateTimePicker.stories.ts',
  'time-field':         'TimeField.stories.ts',
  'range-calendar':     'RangeCalendar.stories.ts',
  'scroll-area':        'ScrollArea.stories.ts',
  'separator':          'Separator.stories.ts',
  'splitter':           'Splitter.stories.ts',
  'toast':              'Toast.stories.ts',
  'toolbar':            'Toolbar.stories.ts',
  'tree':               'Tree.stories.ts',
  'pagination':         'Pagination.stories.ts',
  'avatar':             'Avatar.stories.ts',
  'aspect-ratio':       'AspectRatio.stories.ts',
  'progress-bar':       'ProgressBar.stories.ts',
  'progress-circle':    'ProgressCircle.stories.ts',
  'stepper':            'Stepper.stories.ts',
  'color-area':         'ColorArea.stories.ts',
  'color-field':        'ColorField.stories.ts',
  'color-slider':       'ColorSlider.stories.ts',
  'color-swatch':       'ColorSwatch.stories.ts',
  'color-swatch-picker':'ColorSwatchPicker.stories.ts',
  'color-picker':       'ColorPicker.stories.ts',
}

// Files using Options API (defineComponent) or named Props types that are already correct
const SKIP_FILES = new Set([
  'packages/vue/src/components/alert-dialog/AlertDialog.vue',
  'packages/vue/src/components/modal/Modal.vue',
  'packages/vue/src/components/drawer/Drawer.vue',
  'packages/vue/src/components/tooltip/Tooltip.vue',
  'packages/vue/src/components/popover/Popover.vue',
  // Named Props type — agent added Reka pass-through section, audit can't parse it
  'packages/vue/src/components/autocomplete/Autocomplete.vue',
  'packages/vue/src/components/select/Select.vue',
  // Uses defineModel + function-overload defineEmits — audit can't detect these patterns
  'packages/vue/src/components/slider/Slider.vue',
  'packages/vue/src/components/progress-bar/ProgressBar.vue',
  'packages/vue/src/components/progress-circle/ProgressCircle.vue',
  'packages/vue/src/components/number-field/NumberField.vue',
  // Complex date field components using named Props interfaces — already agent-patched
  'packages/vue/src/components/date-input/DateInput.vue',
  'packages/vue/src/components/date-range-field/DateRangeField.vue',
  'packages/vue/src/components/time-field/TimeField.vue',
])

// Props that are hardcoded or intentionally not forwarded
const INTENTIONAL_OMISSIONS = new Map([
  ['TooltipContent',             new Set(['forceMount'])],
  ['PopoverContent',             new Set(['forceMount'])],
  ['AccordionContent',           new Set(['forceMount'])],
  ['CollapsibleContent',         new Set(['forceMount'])],
  // DropdownMenuItemIndicator is rendered internally — its forceMount is not a public prop
  ['DropdownMenuItemIndicator',  new Set(['forceMount'])],
  // Calendar cell/trigger sub-components are internal rendering details
  ['CalendarCell',               new Set(['date'])],
  ['CalendarCellTrigger',        new Set(['day', 'month'])],
  ['RangeCalendarCell',          new Set(['date'])],
  ['RangeCalendarCellTrigger',   new Set(['day', 'month'])],
  // MonthPicker/YearPicker sub-calendars are internal navigation UI in RangeCalendar
  ['MonthPickerCell',            new Set(['date'])],
  ['MonthPickerCellTrigger',     new Set(['month'])],
  ['YearPickerCell',             new Set(['date'])],
  ['YearPickerCellTrigger',      new Set(['year'])],
  ['MonthPickerRoot',            new Set(['isMonthDisabled', 'isMonthUnavailable', 'multiple'])],
  ['YearPickerRoot',             new Set(['isYearDisabled', 'isYearUnavailable', 'multiple', 'yearsPerPage'])],
  // ColorSwatchPickerItem/Swatch are internal — each swatch gets value/label set programmatically
  ['ColorSwatchPickerItem',      new Set(['value'])],
  ['ColorSwatchPickerItemSwatch',new Set(['label'])],
  // PinInputInput is internal — each input slot gets its sequential index automatically
  ['PinInputInput',              new Set(['index'])],
  // DatePicker sub-components — asChild/as are internal rendering concerns
  ['DatePickerTrigger',          new Set(['asChild', 'as'])],
  ['DatePickerContent',          new Set(['asChild', 'as'])],
  ['DateRangePickerTrigger',     new Set(['asChild', 'as'])],
  ['DateRangePickerContent',     new Set(['asChild', 'as'])],
])

// Props renamed intentionally in Auron vs Reka (e.g. isDisabled vs disabled)
// The wrapper uses a different name — not a gap
const RENAMED_PROPS = new Map([
  ['ComboboxRoot',        { disabled: 'isDisabled', required: 'isRequired' }],
  ['ListboxRoot',         { disabled: 'isDisabled' }],
  // ComboboxAnchor.reference -> anchorReference (more descriptive)
  ['ComboboxAnchor',      { reference: 'anchorReference' }],
  // Portal disabled -> portalDisabled (disambiguates from item-level disabled)
  ['DropdownMenuPortal',  { disabled: 'portalDisabled' }],
  ['SelectPortal',        { disabled: 'portalDisabled' }],
  ['ComboboxPortal',      { disabled: 'portalDisabled' }],
  // ComboboxViewport.nonce -> viewportNonce
  ['ComboboxViewport',    { nonce: 'viewportNonce' }],
  // Indicator forceMount -> indicatorForceMount (scoped to the indicator sub-component)
  ['CheckboxIndicator',   { forceMount: 'indicatorForceMount' }],
  ['RadioGroupIndicator', { forceMount: 'indicatorForceMount' }],
  // ScrollArea renames to scope nonce and forceMount to their sub-components
  ['ScrollAreaViewport',  { nonce: 'viewportNonce' }],
  ['ScrollAreaScrollbar', { forceMount: 'scrollbarForceMount' }],
  // PaginationRoot.total -> totalItems (clearer semantics)
  ['PaginationRoot',      { total: 'totalItems' }],
  // ProgressRoot: modelValue -> value, max -> maxValue (HeroUI-parity naming)
  ['ProgressRoot',        { modelValue: 'value', max: 'maxValue' }],
  // Date component renames: disabled/readonly -> isDisabled/isReadOnly (HeroUI-parity)
  ['DatePickerRoot',      { disabled: 'isDisabled', readonly: 'isReadOnly' }],
  ['DateRangePickerRoot', { disabled: 'isDisabled', readonly: 'isReadOnly' }],
  ['DateTimePickerRoot',  { disabled: 'isDisabled', readonly: 'isReadOnly' }],
  // AutocompleteAnchor.reference -> anchorReference
  ['AutocompleteAnchor',  { reference: 'anchorReference' }],
])

// Emit names that are intentionally not forwarded (from internal sub-components)
const INTENTIONAL_EMIT_OMISSIONS = new Map([
  // ColorSwatchPickerItem emits 'select' internally — not a public event of ColorSwatchPicker
  ['ColorSwatchPickerItem', new Set(['select'])],
])

// Files using defineModel for v-model props — audit can't detect these
const DEFINE_MODEL_FILES = new Set([
  'packages/vue/src/components/calendar/Calendar.vue',
  'packages/vue/src/components/calendar-year-picker/CalendarYearPicker.vue',
  'packages/vue/src/components/range-calendar/RangeCalendar.vue',
  'packages/vue/src/components/date-picker/DatePicker.vue',
  'packages/vue/src/components/date-picker/DatePickerOnly.vue',
  'packages/vue/src/components/date-range-picker/DateRangePicker.vue',
  'packages/vue/src/components/date-range-field/DateRangeField.vue',
  'packages/vue/src/components/date-time-picker/DateTimePicker.vue',
  'packages/vue/src/components/date-input/DateInput.vue',
  'packages/vue/src/components/time-field/TimeField.vue',
  'packages/vue/src/components/dropdown/DropdownRadioGroup.vue',
])

// Walk a directory recursively, yielding .vue file paths
function* walkVue(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) yield* walkVue(full)
    else if (entry.endsWith('.vue')) yield full
  }
}

// Extract prop names from a defineProps<{...}> block using brace counting
// (simple regex fails on nested types like classNames?: Partial<{...}>)
function extractProps(scriptContent) {
  const names = new Set()
  const start = scriptContent.search(/defineProps\s*<\s*\{/)
  if (start === -1) return names
  // Find the opening { of the top-level defineProps type
  let i = scriptContent.indexOf('{', start)
  if (i === -1) return names
  let depth = 0
  let bodyStart = i + 1
  let bodyEnd = -1
  for (; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') depth++
    else if (scriptContent[i] === '}') {
      depth--
      if (depth === 0) { bodyEnd = i; break }
    }
  }
  if (bodyEnd === -1) return names
  // Only look at the TOP LEVEL of the outer object — skip nested { } blocks
  const body = scriptContent.slice(bodyStart, bodyEnd)
  let nested = 0
  const lines = body.split('\n')
  for (const line of lines) {
    for (const ch of line) {
      if (ch === '{' || ch === '<') nested++
      else if (ch === '}' || ch === '>') nested--
    }
    if (nested <= 0) {
      const m = line.match(/^\s*(\w+)\s*\??:/)
      if (m) names.add(m[1])
    }
  }
  return names
}

// Extract emit names from a defineEmits<{ ... }>() block
// Handles object style { 'emit-name': [...] } and function-overload style (e: 'emit-name', ...): void
function extractEmits(scriptContent) {
  const names = new Set()
  const match = scriptContent.match(/defineEmits\s*<\s*\{([\s\S]*?)\}\s*>/)
  if (match) {
    const body = match[1]
    // Quoted: 'emit-name': or "emit-name":
    for (const m of body.matchAll(/['"]([\w:-]+)['"]\s*:/g)) names.add(m[1])
    // Unquoted camelCase: emitName:
    for (const m of body.matchAll(/^\s*([a-zA-Z]\w*)\s*:/gm)) names.add(m[1])
  }
  // Function-overload style: (e: 'emit-name', ...) or (e: "emit-name", ...)
  for (const m of scriptContent.matchAll(/\(\s*e\s*:\s*['"]([^'"]+)['"]/g)) names.add(m[1])
  return names
}

// Extract Reka component names imported from 'reka-ui'
function extractRekaImports(scriptContent) {
  const names = new Set()
  for (const m of scriptContent.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]reka-ui['"]/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim()
      if (name) names.add(name)
    }
  }
  return names
}

// Get Reka runtime component props and emits
function getRekaShape(componentName) {
  const comp = reka[componentName]
  if (!comp) return null
  const props = comp.props ? Object.keys(comp.props) : []
  const emits = comp.emits
    ? (Array.isArray(comp.emits) ? comp.emits : Object.keys(comp.emits))
    : []
  return { props, emits }
}

// Normalise Reka camelCase emit name to our kebab-case convention
// e.g. escapeKeyDown -> escape-key-down
function rekaEmitToKebab(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

const componentsDir = join(root, 'packages/vue/src/components')
const storiesDir = join(root, 'packages/storybook/stories')

const report = []

for (const vuePath of walkVue(componentsDir)) {
  const relFile = vuePath.replace(root + '/', '')
  if (SKIP_FILES.has(relFile)) continue

  const src = readFileSync(vuePath, 'utf8')
  const { descriptor } = parse(src, { filename: vuePath })
  const script = descriptor.scriptSetup || descriptor.script
  if (!script) continue

  const scriptContent = script.content

  const rekaImports = extractRekaImports(scriptContent)
  if (rekaImports.size === 0) continue

  const ourProps = extractProps(scriptContent)
  // Also extract props from Options API defineComponent({ props: { ... } })
  for (const m of scriptContent.matchAll(/^\s+(\w+)\s*:\s*\{[^}]*type[^}]*\}/gm)) {
    ourProps.add(m[1])
  }
  const ourEmits = extractEmits(scriptContent)
  // Also detect Options API array-style emits: emits: ['update:open']
  for (const m of scriptContent.matchAll(/['"]([\w:]+)['"]/g)) {
    if (scriptContent.slice(Math.max(0, scriptContent.lastIndexOf('\n', scriptContent.indexOf(m[0], m.index - 1))), m.index).includes('emits')) {
      ourEmits.add(m[1])
    }
  }
  // Simpler: scan for any string literals that look like emit names near 'emits'
  const emitsArrayMatch = scriptContent.match(/emits\s*:\s*\[([^\]]+)\]/)
  if (emitsArrayMatch) {
    for (const em of emitsArrayMatch[1].matchAll(/['"]([^'"]+)['"]/g)) ourEmits.add(em[1])
  }

  // Also check template for v-bind="$attrs" — those files pass through unknown attrs
  const hasAttrsPassthrough = src.includes('v-bind="$attrs"')

  // defineModel creates both the prop and update:X emit automatically
  const isDefineModelFile = DEFINE_MODEL_FILES.has(vuePath.replace(root + '/', ''))
  if (isDefineModelFile) {
    // modelValue and placeholder are managed via defineModel — not in defineProps
    ourProps.add('modelValue')
    ourProps.add('placeholder')
    ourProps.add('open')
    ourEmits.add('update:model-value')
    ourEmits.add('update:placeholder')
    ourEmits.add('update:modelValue')
    ourEmits.add('update:open')
  }

  const missingProps = []
  const missingEmits = []

  for (const rekaName of rekaImports) {
    const shape = getRekaShape(rekaName)
    if (!shape) continue

    const omissions = INTENTIONAL_OMISSIONS.get(rekaName) ?? new Set()
    const renames = RENAMED_PROPS.get(rekaName) ?? {}

    for (const prop of shape.props) {
      if (omissions.has(prop)) continue
      if (ourProps.has(prop)) continue
      // Check if this prop is intentionally renamed in Auron
      const renamed = renames[prop]
      if (renamed && ourProps.has(renamed)) continue
      if (hasAttrsPassthrough) continue
      missingProps.push({ prop, fromReka: rekaName })
    }

    const emitOmissions = INTENTIONAL_EMIT_OMISSIONS.get(rekaName) ?? new Set()
    for (const emit of shape.emits) {
      const kebab = rekaEmitToKebab(emit)
      if (emitOmissions.has(kebab) || emitOmissions.has(emit)) continue
      if (ourEmits.has(kebab)) continue
      if (ourEmits.has(emit)) continue
      missingEmits.push({ emit: kebab, fromReka: rekaName })
    }
  }

  if (missingProps.length === 0 && missingEmits.length === 0) continue

  // Derive component dir name for story mapping
  const relPath = vuePath.replace(componentsDir + '/', '')
  const dirName = relPath.split('/')[0]
  const storyFile = STORY_MAP[dirName] ?? null

  report.push({
    componentFile: vuePath.replace(root + '/', ''),
    storyFile: storyFile ? `packages/storybook/stories/${storyFile}` : null,
    rekaImports: [...rekaImports],
    missingProps,
    missingEmits,
  })
}

// Sort by componentFile for readability
report.sort((a, b) => a.componentFile.localeCompare(b.componentFile))

const outPath = join(__dirname, 'audit-report.json')
writeFileSync(outPath, JSON.stringify(report, null, 2))
console.log(`Wrote ${outPath}`)
console.log(`Found gaps in ${report.length} files`)
for (const entry of report) {
  const p = entry.missingProps.map(x => x.prop)
  const e = entry.missingEmits.map(x => x.emit)
  console.log(`  ${entry.componentFile}`)
  if (p.length) console.log(`    props: ${p.join(', ')}`)
  if (e.length) console.log(`    emits: ${e.join(', ')}`)
}
