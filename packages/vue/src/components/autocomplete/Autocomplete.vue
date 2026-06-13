<script setup lang="ts">
import { computed, onMounted, ref, toRef, useAttrs, useId, watch, type Ref } from 'vue'
import { AutocompleteRoot } from 'reka-ui'
import { autocompleteVariants, type AutocompleteVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useAutocompleteProvide } from './Autocomplete.context'

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
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
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
  class?: string

  /* ─── Autocomplete-specific ─────────────────────────────────────── */
  /** Two-way bound selected value. */
  modelValue?: string
  /** Initial selected value (uncontrolled). */
  defaultValue?: string
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

// Open-state tracking so we can skip client-side filtering until the user types
const isOpen = ref(props.defaultOpen ?? false)
const termAtOpen = ref('')
const isUserTyping = ref(false)
const effectiveIgnoreFilter = computed(() => {
  if (props.loadItems) return true
  if (!props.filterOnOpen && isOpen.value && !isUserTyping.value) return true
  return false
})

// Internal display text — bound to AutocompleteRoot's model-value.
// Holds the LABEL (what the user reads), not the value. Bridged below.
// Priority: items prop entry > slot registry > identity fallback
function labelFor(value: string | undefined): string {
  if (value == null || value === '') return ''
  const match = internalItems.value.find((i) => i.value === value)
  if (match) return match.label ?? match.textValue ?? value
  return slotItemRegistry.value.get(value) ?? value
}
function valueFor(displayed: string): string {
  if (!displayed) return ''
  // Check items prop first
  const match = internalItems.value.find(
    (i) => (i.label ?? i.textValue ?? i.value) === displayed,
  )
  if (match) return match.value
  // Check slot registry: find value whose label equals displayed
  for (const [value, label] of slotItemRegistry.value) {
    if (label === displayed) return value
  }
  return displayed
}

const searchTerm = ref(labelFor(props.modelValue))

const isFilled = computed(() => !!searchTerm.value)
const hasItems = computed(() => internalItems.value.length > 0)

// Helper IDs / aria wiring
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

// Parent → internal: when the v-model value changes, reflect its label
watch(() => props.modelValue, (val) => {
  const next = labelFor(val)
  if (searchTerm.value !== next) searchTerm.value = next
})

// Internal → parent: when the displayed label changes, emit the real value.
// Also detect user typing (for open-time filtering suppression).
watch(searchTerm, (displayed) => {
  const next = valueFor(displayed)
  if (next !== (props.modelValue ?? '')) emit('update:modelValue', next)
  if (isOpen.value && displayed !== termAtOpen.value) {
    isUserTyping.value = true
  }
})

function handleOpenChange(val: boolean) {
  isOpen.value = val
  if (val) {
    termAtOpen.value = searchTerm.value
    isUserTyping.value = false
  } else {
    isUserTyping.value = false
  }
  emit('update:open', val)
}

// Debounce timer
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
    // Run immediately (for tests and zero-debounce configs)
    void runLoadItems(query)
  } else {
    debounceTimer = setTimeout(() => void runLoadItems(query), props.debounceMs)
  }
}

// Initial load on mount
onMounted(() => {
  if (props.loadItems) {
    void runLoadItems(searchTerm.value)
  }
})

// Watch searchTerm changes and invoke loadItems (debounced)
watch(searchTerm, (q) => {
  if (props.loadItems) {
    scheduleLoad(q)
  }
})

// Sync static items when they change
watch(() => props.items, (newItems) => {
  if (!props.loadItems) {
    internalItems.value = [...newItems]
  }
})

// When items arrive (async) or change, re-resolve the display label
watch(internalItems, () => {
  const next = labelFor(props.modelValue)
  if (next && searchTerm.value !== next && valueFor(searchTerm.value) === (props.modelValue ?? '')) {
    searchTerm.value = next
  }
})

// When slot items register (children mount after parent), re-resolve the display label.
// This covers the case where modelValue is set before children have mounted.
watch(slotItemRegistry, () => {
  const next = labelFor(props.modelValue)
  if (next && searchTerm.value !== next && valueFor(searchTerm.value) === (props.modelValue ?? '')) {
    searchTerm.value = next
  }
})

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
  registerItem,
  unregisterItem,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class)"
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
      :class="slotFns.label()"
    >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>

    <div :class="slotFns.mainWrapper()">
      <!-- AutocompleteRoot is Reka UI's distinct autocomplete primitive.
           ignoreFilter=true ensures server-returned items are never filtered
           client-side (the server handles filtering). -->
      <AutocompleteRoot
        v-model:model-value="searchTerm"
        :open="props.open"
        :default-open="props.defaultOpen"
        :disabled="props.isDisabled"
        :required="props.isRequired"
        :ignore-filter="effectiveIgnoreFilter"
        :open-on-focus="true"
        @update:open="handleOpenChange"
      >
        <slot
          :is-loading="isLoading"
          :items="internalItems"
        />
      </AutocompleteRoot>

      <div
        v-if="hasHelper"
        :class="slotFns.helperWrapper()"
      >
        <div
          v-if="showError"
          :id="errorMessageId"
          :class="slotFns.errorMessage()"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="showDescription"
          :id="descriptionId"
          :class="slotFns.description()"
        >
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
