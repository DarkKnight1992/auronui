<script setup lang="ts">
import { ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxCancel } from 'reka-ui'
import { useComboBoxInject } from './ComboBox.context'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
  /** Custom reference element for the anchor. */
  anchorReference?: object | null
  /** Render the anchor as a different element. */
  anchorAs?: string
  /** Merge anchor props onto child element. */
  anchorAsChild?: boolean
  /** Function to compute the display value from the current model value. */
  displayValue?: (value: string) => string
  /** Two-way bound search input value. */
  modelValue?: string
  /** Auto-focus the input on mount. */
  autoFocus?: boolean
  /** Disable the input. Falls back to context isDisabled. */
  disabled?: boolean
  /** Render the input as a different element. */
  as?: string
  /** Merge input props onto child element. */
  asChild?: boolean
  /** Disable the trigger button. */
  triggerDisabled?: boolean
  /** Render the trigger as a different element. */
  triggerAs?: string
  /** Merge trigger props onto child element. */
  triggerAsChild?: boolean
  /** Render the cancel button as a different element. */
  cancelAs?: string
  /** Merge cancel props onto child element. */
  cancelAsChild?: boolean
}>(), {
  placeholder: undefined,
  class: undefined,
  anchorReference: undefined,
  anchorAs: undefined,
  anchorAsChild: false,
  displayValue: undefined,
  modelValue: undefined,
  autoFocus: false,
  disabled: undefined,
  as: undefined,
  asChild: false,
  triggerDisabled: undefined,
  triggerAs: undefined,
  triggerAsChild: false,
  cancelAs: undefined,
  cancelAsChild: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const ctx = useComboBoxInject()
</script>

<template>
  <ComboboxAnchor
    :reference="props.anchorReference"
    :as="props.anchorAs"
    :as-child="props.anchorAsChild"
    :class="ctx.slots.value.inputGroup()"
    data-slot="input-group"
  >
    <ComboboxInput
      :placeholder="props.placeholder"
      :model-value="props.modelValue"
      :auto-focus="props.autoFocus"
      :disabled="props.disabled ?? ctx.isDisabled.value"
      :display-value="props.displayValue ?? ctx.displayValue.value"
      :as="props.as"
      :as-child="props.asChild"
      class="combo-box__input"
      data-slot="input"
      autocomplete="off"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <!-- Clear button: shown when there's input -->
    <ComboboxCancel
      :as="props.cancelAs"
      :as-child="props.cancelAsChild"
      class="combo-box__clear-button"
      data-slot="clear-button"
      aria-label="Clear"
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
    </ComboboxCancel>
    <!-- Dropdown trigger -->
    <ComboboxTrigger
      :disabled="props.triggerDisabled"
      :as="props.triggerAs"
      :as-child="props.triggerAsChild"
      :class="ctx.slots.value.trigger()"
      data-slot="selector-button"
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
          data-slot="combo-box-trigger-default-icon"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </ComboboxTrigger>
  </ComboboxAnchor>
</template>
