<script setup lang="ts">
import { computed, onMounted, ref, toRef, useAttrs, useId, watch, useSlots } from 'vue'
import { AutocompleteRoot } from 'reka-ui'
import { autocompleteVariants, type AutocompleteVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useAutocompleteProvide } from './Autocomplete.context'
import { hasSlotComponent } from '../../utils/hasSlotComponent'
import AutocompleteInput from './AutocompleteInput.vue'
import AutocompleteContent from './AutocompleteContent.vue'
import AutocompleteItem from './AutocompleteItem.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  labelPlacement: 'inside',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  multiple: false,
  multipleOverflow: 'wrap',
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  defaultOpen: undefined,
  items: () => [],
  loadItems: undefined,
  debounceMs: 200,
  filterOnOpen: false,
  truncateItems: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  'update:open': [value: boolean]
  /** Fired when the user creates a new value via `creatable` or `<AutocompleteCreateItem>`. */
  'create': [value: string]
}>()

export interface AutocompleteItem {
  value: string
  label?: string
  textValue?: string
  isDisabled?: boolean
}

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: AutocompleteVariants['variant']
  /** Field height. @default 'md' */
  size?: AutocompleteVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: AutocompleteVariants['color']
  /**
   * Where the `label` is rendered relative to the field.
   * - `inside`: floats above the trigger (shrinks when focused/filled)
   * - `outside`: sits above the field, static
   * - `outside-left`: sits to the left, horizontal layout
   * @default 'inside'
   */
  labelPlacement?: AutocompleteVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadonly?: boolean
  /** Adds a required asterisk next to the label. @default false */
  isRequired?: boolean
  /** Placeholder shown when empty. */
  placeholder?: string
  /** Form field name, for native form submission. */
  name?: string
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. */
  errorMessage?: string
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  class?: ClassValue
  /** Per-slot class overrides. Keys correspond to internal slot names (`base`, `label`, `mainWrapper`, `helperWrapper`, `errorMessage`, `description`). */
  classNames?: Partial<{
    base: ClassValue
    label: ClassValue
    mainWrapper: ClassValue
    helperWrapper: ClassValue
    errorMessage: ClassValue
    description: ClassValue
  }>

  /* ─── Autocomplete-specific ─────────────────────────────────────── */
  /** Two-way bound selected value. string in single mode, string[] in multiple mode. */
  modelValue?: string | string[]
  /** Initial selected value (uncontrolled). */
  defaultValue?: string | string[]
  /** Allow selecting multiple values. modelValue becomes string[]. @default false */
  multiple?: boolean
  /**
   * Controls how chips overflow in multiple mode.
   * - `wrap`: trigger grows in height, chips wrap to new lines (default)
   * - `collapse`: fixed height, overflowing chips are hidden behind "+N more"
   * @default 'wrap'
   */
  multipleOverflow?: 'wrap' | 'collapse'
  /** Controls open state of the dropdown. */
  open?: boolean
  /** Initial open state of the dropdown (uncontrolled). */
  defaultOpen?: boolean
  /** Static items list — used when no loadItems is provided. */
  items?: AutocompleteItem[]
  /** Async data source: called on every query change. */
  loadItems?: (query: string) => Promise<AutocompleteItem[]>
  /** Debounce delay for loadItems calls (ms). 0 = no debounce. */
  debounceMs?: number
  /** Apply filter immediately on open (default: false — show all items until user types). */
  filterOnOpen?: boolean
  /**
   * Truncate item text with an ellipsis when it overflows the dropdown width.
   * Set to `false` to show full text — the dropdown will widen to fit.
   * @default true
   */
  truncateItems?: boolean
}

const attrs = useAttrs()
const generatedId = useId()
const inputId = computed(() => (attrs.id as string | undefined) ?? generatedId)

const hasLabel = computed(() => !!props.label)

const slots = useSlots()
// Compound chrome present → pass slot through (advanced). Otherwise render the
// input/content/items internally (short-form).
const usesCustomChrome = computed(() =>
  hasSlotComponent(slots.default?.(), [AutocompleteInput, AutocompleteContent]),
)

// Registry for slot-rendered items: value → label (populated by AutocompleteItem at mount).
// Replaced with a new Map instance on each mutation so Vue's ref() reactivity tracks changes.
const slotItemRegistry = ref(new Map<string, string>())

function registerItem(value: string, label: string) {
  const next = new Map(slotItemRegistry.value)
  next.set(value, label)
  slotItemRegistry.value = next
}

function unregisterItem(value: string) {
  const next = new Map(slotItemRegistry.value)
  next.delete(value)
  slotItemRegistry.value = next
}

// Internal async state
const isLoading = ref(false)
const internalItems = ref<AutocompleteItem[]>([...props.items])

// ── Multiple-mode state ────────────────────────────────────────────────────
// Tracks selected values as an array. Only meaningful when props.multiple=true.
const selectedValues = ref<string[]>(
  props.multiple && Array.isArray(props.modelValue) ? [...props.modelValue] : [],
)

// Controlled open state used in multiple mode to prevent the dropdown closing
// after each item selection (Reka would normally close on selection).
const internalOpen = ref(props.defaultOpen ?? false)

// Flag set by onMultipleSelect so handleOpenChange can distinguish item
// selection from Escape/outside-click close.
let selectingItem = false

// ── Open-state tracking ────────────────────────────────────────────────────
const isOpen = ref(props.defaultOpen ?? false)
const termAtOpen = ref('')
const isUserTyping = ref(false)
// Controlled open state for single mode (mirrors multiple mode's internalOpen).
// Driving open ourselves lets handleOpenChange gate spurious reopens — e.g. the
// focus bounce caused when a create handler mutates the items list.
const singleOpen = ref(props.open ?? props.defaultOpen ?? false)
// When true, handleOpenChange ignores open=true requests. Set briefly after a
// single-mode create so the post-create re-render can't reopen the menu.
let blockReopen = false
let blockReopenTimer: ReturnType<typeof setTimeout> | undefined
const effectiveIgnoreFilter = computed(() => {
  if (props.loadItems) return true
  if (!props.filterOnOpen && isOpen.value && !isUserTyping.value) return true
  return false
})

// ── Label/value bridge ─────────────────────────────────────────────────────
// Priority: items prop entry > slot registry > identity fallback
function labelFor(value: string | undefined): string {
  if (value == null || value === '') return ''
  const match = internalItems.value.find((i) => i.value === value)
  if (match) return match.label ?? match.textValue ?? value
  return slotItemRegistry.value.get(value) ?? value
}
function valueFor(displayed: string): string {
  if (!displayed) return ''
  const match = internalItems.value.find(
    (i) => (i.label ?? i.textValue ?? i.value) === displayed,
  )
  if (match) return match.value
  for (const [value, label] of slotItemRegistry.value) {
    if (label === displayed) return value
  }
  return displayed
}

const singleModelValue = computed(() =>
  props.multiple ? undefined : (props.modelValue as string | undefined),
)

const searchTerm = ref(labelFor(singleModelValue.value))

const isFilled = computed(() =>
  props.multiple
    ? selectedValues.value.length > 0 || !!searchTerm.value
    : !!searchTerm.value,
)
const hasItems = computed(() => internalItems.value.length > 0)

const selectedLabels = computed(() =>
  selectedValues.value.map(v => ({ value: v, label: labelFor(v) || v })),
)

// ── Helpers ────────────────────────────────────────────────────────────────
const descriptionId = computed(() => `${inputId.value}-description`)
const errorMessageId = computed(() => `${inputId.value}-error`)
const showError = computed(() => props.isInvalid && !!props.errorMessage)
const showDescription = computed(() => !!props.description && !showError.value)
const hasHelper = computed(() => showError.value || showDescription.value)
const ariaDescribedBy = computed(() => {
  if (showError.value) return errorMessageId.value
  if (showDescription.value) return descriptionId.value
  return undefined
})

// ── Watchers ───────────────────────────────────────────────────────────────

// Parent → internal: sync controlled modelValue into local state
watch(() => props.modelValue, (val) => {
  if (props.multiple) {
    if (Array.isArray(val)) selectedValues.value = [...val]
  } else {
    const next = labelFor(val as string | undefined)
    if (searchTerm.value !== next) searchTerm.value = next
  }
})

// Parent → internal: sync consumer-controlled open into our single-mode state
watch(() => props.open, (val) => {
  if (!props.multiple && val !== undefined) singleOpen.value = val
})

// Internal → parent: single mode only — multiple mode emits inside onMultipleSelect
watch(searchTerm, (displayed) => {
  if (props.multiple) {
    if (isOpen.value && displayed !== termAtOpen.value) isUserTyping.value = true
    return
  }
  const next = valueFor(displayed)
  if (next !== (singleModelValue.value ?? '')) emit('update:modelValue', next)
  if (isOpen.value && displayed !== termAtOpen.value) isUserTyping.value = true
})

function handleOpenChange(val: boolean) {
  if (props.multiple) {
    isOpen.value = val
    // Suppress close when triggered by item selection; allow Escape/outside-click
    internalOpen.value = (!val && selectingItem) ? true : val
    selectingItem = false
    if (val) { termAtOpen.value = searchTerm.value; isUserTyping.value = false }
    else { isUserTyping.value = false }
    emit('update:open', val)
    return
  }

  // Single mode: ignore spurious reopen requests right after a create — the
  // create handler's re-render bounces focus back to the input, which would
  // otherwise reopen the menu via openOnFocus.
  if (val && blockReopen) return

  isOpen.value = val
  singleOpen.value = val
  if (val) { termAtOpen.value = searchTerm.value; isUserTyping.value = false }
  else { isUserTyping.value = false }
  emit('update:open', val)
}

// ── Multiple-mode actions ──────────────────────────────────────────────────

function onMultipleSelect(value: string) {
  selectingItem = true
  const idx = selectedValues.value.indexOf(value)
  selectedValues.value = idx === -1
    ? [...selectedValues.value, value]
    : selectedValues.value.filter((_, i) => i !== idx)
  // Clear the input and drop out of "typing" mode so the filter is ignored and
  // the full list shows again (effectiveIgnoreFilter depends on !isUserTyping).
  searchTerm.value = ''
  isUserTyping.value = false
  emit('update:modelValue', selectedValues.value)
}

function removeValue(value: string) {
  selectedValues.value = selectedValues.value.filter(v => v !== value)
  emit('update:modelValue', selectedValues.value)
}

function clearAll() {
  selectedValues.value = []
  emit('update:modelValue', [])
}

function isSelected(value: string): boolean {
  return selectedValues.value.includes(value)
}

// ── Creatable ──────────────────────────────────────────────────────────────

const hasExactMatch = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return false
  const inItems = internalItems.value.some(
    i => (i.label ?? i.textValue ?? i.value).toLowerCase() === term,
  )
  if (inItems) return true
  for (const label of slotItemRegistry.value.values()) {
    if (label.toLowerCase() === term) return true
  }
  return false
})

function onCreateValue(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return
  if (props.multiple) {
    // We own selection state; add the value, then reset input + filter for the
    // next entry (dropdown is kept open and refocused by AutocompleteCreateItem).
    if (!selectedValues.value.includes(trimmed)) {
      selectingItem = true
      selectedValues.value = [...selectedValues.value, trimmed]
      emit('update:modelValue', selectedValues.value)
    }
    searchTerm.value = ''
    isUserTyping.value = false
  } else {
    // Single mode: set the value ourselves and close the (controlled) dropdown.
    searchTerm.value = trimmed
    emit('update:modelValue', trimmed)
    isOpen.value = false
    singleOpen.value = false
    // The create handler (parent @create) typically mutates the items list, which
    // re-renders and bounces focus back to the input — that fires openOnFocus and
    // would reopen the menu. Block reopen requests briefly so the close sticks.
    blockReopen = true
    clearTimeout(blockReopenTimer)
    blockReopenTimer = setTimeout(() => { blockReopen = false }, 300)
  }
  emit('create', trimmed)
}

// ── Async loading ──────────────────────────────────────────────────────────
let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function runLoadItems(query: string) {
  if (!props.loadItems) return
  isLoading.value = true
  try {
    internalItems.value = await props.loadItems(query)
  } finally {
    isLoading.value = false
  }
}

function scheduleLoad(query: string) {
  if (!props.loadItems) return
  clearTimeout(debounceTimer)
  if (props.debounceMs === 0) {
    void runLoadItems(query)
  } else {
    debounceTimer = setTimeout(() => void runLoadItems(query), props.debounceMs)
  }
}

onMounted(() => {
  if (props.loadItems) void runLoadItems(searchTerm.value)
})

watch(searchTerm, (q) => {
  if (props.loadItems) scheduleLoad(q)
})

watch(() => props.items, (newItems) => {
  if (!props.loadItems) internalItems.value = [...newItems]
})

watch(internalItems, () => {
  if (props.multiple) return
  const next = labelFor(singleModelValue.value)
  if (next && searchTerm.value !== next && valueFor(searchTerm.value) === (singleModelValue.value ?? '')) {
    searchTerm.value = next
  }
})

watch(slotItemRegistry, () => {
  if (props.multiple) return
  const next = labelFor(singleModelValue.value)
  if (next && searchTerm.value !== next && valueFor(searchTerm.value) === (singleModelValue.value ?? '')) {
    searchTerm.value = next
  }
})

// ── Styles / context ───────────────────────────────────────────────────────

const slotFns = computed(() =>
  autocompleteVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: props.isReadonly,
    hasLabel: hasLabel.value,
    labelPlacement: props.labelPlacement,
  }),
)

const showOutsideLabel = computed(
  () => hasLabel.value && props.labelPlacement !== 'inside',
)

useAutocompleteProvide({
  isDisabled: toRef(props, 'isDisabled'),
  isInvalid: toRef(props, 'isInvalid'),
  isReadonly: toRef(props, 'isReadonly'),
  isRequired: toRef(props, 'isRequired'),
  isLoading,
  isFilled,
  fullWidth: toRef(props, 'fullWidth'),
  hasLabel,
  labelPlacement: toRef(props, 'labelPlacement'),
  inputId,
  label: toRef(props, 'label'),
  ariaDescribedBy,
  truncateItems: toRef(props, 'truncateItems'),
  hasItems,
  slots: slotFns,
  multiple: toRef(props, 'multiple'),
  multipleOverflow: toRef(props, 'multipleOverflow'),
  selectedValues,
  selectedLabels,
  onMultipleSelect,
  removeValue,
  clearAll,
  isSelected,
  registerItem,
  unregisterItem,
  searchTerm,
  hasExactMatch,
  onCreateValue,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-invalid="isInvalid || undefined"
    :data-disabled="isDisabled || undefined"
    :data-readonly="isReadonly || undefined"
    :data-required="isRequired || undefined"
    :data-has-label="hasLabel || undefined"
    :data-has-helper="hasHelper || undefined"
  >
    <label
      v-if="showOutsideLabel"
      :for="inputId"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <AutocompleteRoot
        v-model:model-value="searchTerm"
        :open="props.multiple ? internalOpen : singleOpen"
        :disabled="props.isDisabled"
        :required="props.isRequired"
        :ignore-filter="effectiveIgnoreFilter"
        :open-on-focus="true"
        @update:open="handleOpenChange"
      >
        <slot
          v-if="usesCustomChrome"
          :is-loading="isLoading"
          :items="internalItems"
        />
        <template v-else>
          <AutocompleteInput :placeholder="props.placeholder" />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in internalItems"
              :key="item.value"
              :value="item.value"
              :is-disabled="item.isDisabled"
            >
              <slot
                name="item"
                :item="item"
              >{{ item.label ?? item.textValue ?? item.value }}</slot>
            </AutocompleteItem>
          </AutocompleteContent>
        </template>
      </AutocompleteRoot>

      <div
        v-if="hasHelper"
        :class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
      >
        <div
          v-if="showError"
          :id="errorMessageId"
          :class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="showDescription"
          :id="descriptionId"
          :class="composeClassName(slotFns.description(), props.classNames?.description)"
        >
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
