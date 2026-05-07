<script setup lang="ts">
import { ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxCancel } from 'reka-ui'
import { useComboBoxInject } from './ComboBox.context'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
}>(), {
  placeholder: undefined,
  class: undefined,
})

const ctx = useComboBoxInject()
</script>

<template>
  <ComboboxAnchor
    :class="ctx.slots.value.inputGroup()"
    data-slot="input-group"
  >
    <ComboboxInput
      :placeholder="props.placeholder"
      :disabled="ctx.isDisabled.value"
      :display-value="ctx.displayValue.value"
      class="combo-box__input"
      data-slot="input"
      autocomplete="off"
    />
    <!-- Clear button: shown when there's input -->
    <ComboboxCancel
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
