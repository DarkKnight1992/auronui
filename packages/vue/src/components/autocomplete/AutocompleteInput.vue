<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import { AutocompleteInput, AutocompleteTrigger, AutocompleteCancel, AutocompleteAnchor } from 'reka-ui'
import { useAutocompleteInject } from './Autocomplete.context'
import Spinner from '../spinner/Spinner.vue';

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
}>(), {
  placeholder: undefined,
  class: undefined,
})

const ctx = useAutocompleteInject()

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
</script>

<template>
  <AutocompleteAnchor
    ref="anchor"
    :class="ctx.slots.value.trigger()"
    :data-filled="ctx.hasLabel.value ? (ctx.isFilled.value || undefined) : undefined"
    :data-focused="isFocused || undefined"
    :data-invalid="ctx.isInvalid.value || undefined"
    :data-disabled="ctx.isDisabled.value || undefined"
    :data-readonly="ctx.isReadonly.value || undefined"
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
    <AutocompleteInput
      :id="ctx.inputId.value"
      :placeholder="props.placeholder"
      :disabled="ctx.isDisabled.value"
      :readonly="ctx.isReadonly.value"
      :required="ctx.isRequired.value"
      :aria-invalid="ctx.isInvalid.value || undefined"
      :aria-describedby="ctx.ariaDescribedBy.value"
      :class="ctx.slots.value.input()"
      data-slot="input"
      autocomplete="off"
    />
    <!-- Clear button: resets the search term -->
    <AutocompleteCancel
      :class="ctx.slots.value.clearButton()"
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
