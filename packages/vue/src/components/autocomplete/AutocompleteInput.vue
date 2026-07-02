<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import { AutocompleteInput, AutocompleteTrigger, AutocompleteCancel, AutocompleteAnchor } from 'reka-ui'
import { useAutocompleteInject } from './Autocomplete.context'
import Chip from '../chip/Chip.vue'
import Spinner from '../spinner/Spinner.vue'
import AutocompleteOverflowChips from './AutocompleteOverflowChips.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
  /** Two-way bound search input value. */
  modelValue?: string
  /** Auto-focus the input on mount. */
  autoFocus?: boolean
  /** Disable the input. Falls back to context isDisabled. */
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render the AutocompleteInput as a different element. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Render the AutocompleteTrigger as a different element. */
  triggerAs?: string
  /** Merge trigger props onto child element. */
  triggerAsChild?: boolean
  /** Disable the trigger button. Falls back to context isDisabled. */
  triggerDisabled?: boolean
  /** Render the AutocompleteCancel as a different element. */
  cancelAs?: string
  /** Merge cancel props onto child element. */
  cancelAsChild?: boolean
  /** Custom reference element for the AutocompleteAnchor. */
  anchorReference?: object | null
  /** Render the AutocompleteAnchor as a different element. */
  anchorAs?: string
  /** Merge anchor props onto child element. */
  anchorAsChild?: boolean
}>(), {
  placeholder: undefined,
  class: undefined,
  modelValue: undefined,
  autoFocus: false,
  isDisabled: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
  triggerAs: undefined,
  triggerAsChild: false,
  triggerDisabled: undefined,
  cancelAs: undefined,
  cancelAsChild: false,
  anchorReference: undefined,
  anchorAs: undefined,
  anchorAsChild: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const ctx = useAutocompleteInject()

// Resolve own isDisabled/disabled prop pair, falling back to the parent Autocomplete's
// resolved isDisabled context value (reactively, via a fallback getter) only when neither
// is set on this input directly.
const isDisabled = useDeprecatedBooleanProp(
  'AutocompleteInput', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
  () => ctx.isDisabled.value,
)

// Track focused state via useFocusWithin (NOT manual @focus/@blur listeners) — the
// inner Reka <AutocompleteInput> wraps the native <input>; useFocusWithin observes
// the actual DOM subtree of the anchor, so isFocused flips reliably regardless of
// how Reka forwards refs/attrs.
const anchorRef = useTemplateRef<HTMLElement>('anchor')
const { focused: isFocused } = useFocusWithin(anchorRef)

// Render the inside-label only when (a) a label is set and (b) labelPlacement is 'inside'
const showInsideLabel = computed(
  () => ctx.hasLabel.value && ctx.labelPlacement.value === 'inside',
)

// In multiple mode, hide placeholder once chips are present
const effectivePlaceholder = computed(() =>
  ctx.multiple.value && ctx.selectedValues.value.length > 0 ? undefined : props.placeholder,
)

const getLabel = (v: string) => ctx.selectedLabels.value.find(l => l.value === v)?.label ?? v
</script>

<template>
  <AutocompleteAnchor
    ref="anchor"
    :reference="(props.anchorReference as any)"
    :as="props.anchorAs"
    :as-child="props.anchorAsChild"
    :class="ctx.slots.value.trigger()"
    :data-filled="ctx.hasLabel.value ? (ctx.isFilled.value || undefined) : undefined"
    :data-focused="isFocused || undefined"
    :data-invalid="ctx.isInvalid.value || undefined"
    :data-disabled="ctx.isDisabled.value || undefined"
    :data-readonly="ctx.isReadonly.value || undefined"
    :data-multiple-overflow="ctx.multiple.value ? ctx.multipleOverflow.value : undefined"
    data-slot="trigger"
  >
    <label
      v-if="showInsideLabel"
      :for="ctx.inputId.value"
      :class="ctx.slots.value.label()"
    >{{ ctx.label.value }}<span
      v-if="ctx.isRequired.value"
      aria-hidden="true"
    > *</span></label>
    <span
      v-if="$slots.startContent"
      :class="ctx.slots.value.startContent()"
      data-slot="start-content"
    >
      <slot name="startContent" />
    </span>
    <!-- Multiple/collapse: overflow chip area with truncation -->
    <AutocompleteOverflowChips
      v-if="ctx.multiple.value && ctx.multipleOverflow.value === 'collapse' && ctx.selectedValues.value.length > 0"
      :values="ctx.selectedValues.value"
      :get-label="getLabel"
      :remove-value="ctx.removeValue"
    />
    <!-- Multiple/wrap: chips that wrap onto new lines -->
    <template v-else-if="ctx.multiple.value && ctx.multipleOverflow.value === 'wrap'">
      <Chip
        v-for="item in ctx.selectedLabels.value"
        :key="item.value"
        size="sm"
        is-closable
        :close-aria-label="`Remove ${item.label}`"
        data-slot="selected-chip"
        @close.stop="ctx.removeValue(item.value)"
      >
        {{ item.label }}
      </Chip>
    </template>
    <AutocompleteInput
      :id="ctx.inputId.value"
      :model-value="props.modelValue"
      :auto-focus="props.autoFocus"
      :placeholder="effectivePlaceholder"
      :disabled="isDisabled"
      :as="props.as"
      :as-child="props.asChild"
      :readonly="ctx.isReadonly.value"
      :required="ctx.isRequired.value"
      :aria-invalid="ctx.isInvalid.value || undefined"
      :aria-describedby="ctx.ariaDescribedBy.value"
      :class="ctx.slots.value.input()"
      :style="ctx.multiple.value && ctx.multipleOverflow.value === 'collapse' && ctx.selectedValues.value.length > 0
        ? { flex: '0 0 auto', minWidth: '80px', width: 'auto' }
        : undefined"
      data-slot="input"
      autocomplete="off"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <!-- Clear button: only shown when filled and not in a readonly/disabled state.
         Reka's AutocompleteCancel does not set data-empty itself, so we drive it here.
         In multiple mode also clears selectedValues via ctx.clearAll(). -->
    <AutocompleteCancel
      :as="props.cancelAs"
      :as-child="props.cancelAsChild"
      :class="ctx.slots.value.clearButton()"
      :data-empty="(!ctx.isFilled.value || ctx.isReadonly.value || ctx.isDisabled.value) ? 'true' : undefined"
      data-slot="clear-button"
      aria-label="Clear"
      @click="ctx.multiple.value ? ctx.clearAll() : undefined"
    >
      <slot name="clearIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="autocomplete-clear-button-icon"
          aria-hidden="true"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          />
        </svg>
      </slot>
    </AutocompleteCancel>
    <!-- Inline loading spinner: replaces the dropdown indicator while loadItems is pending -->
    <span
      v-if="ctx.isLoading.value"
      :class="ctx.slots.value.indicator()"
      data-slot="autocomplete-loading-indicator"
      role="status"
      aria-live="polite"
      aria-label="Loading suggestions"
    >
      <Spinner size="sm" />
    </span>
    <!-- Dropdown trigger indicator (hidden while loading) -->
    <AutocompleteTrigger
      v-else
      :as="props.triggerAs"
      :as-child="props.triggerAsChild"
      :disabled="props.triggerDisabled"
      :class="ctx.slots.value.indicator()"
      data-slot="autocomplete-default-indicator"
      aria-label="Toggle suggestions"
    >
      <slot name="triggerIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </AutocompleteTrigger>
  </AutocompleteAnchor>
</template>
