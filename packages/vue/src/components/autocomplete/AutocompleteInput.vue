<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFocusWithin } from '@vueuse/core'
import { AutocompleteInput, AutocompleteTrigger, AutocompleteCancel, AutocompleteAnchor } from 'reka-ui'
import { useAutocompleteInject } from './Autocomplete.context'
import Chip from '../chip/Chip.vue'
import Spinner from '../spinner/Spinner.vue'
import AutocompleteOverflowChips from './AutocompleteOverflowChips.vue'

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

// In multiple mode, hide placeholder once chips are present
const effectivePlaceholder = computed(() =>
  ctx.multiple.value && ctx.selectedValues.value.length > 0 ? undefined : props.placeholder,
)

const getLabel = (v: string) => ctx.selectedLabels.value.find(l => l.value === v)?.label ?? v
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
      :placeholder="effectivePlaceholder"
      :disabled="ctx.isDisabled.value"
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
    />
    <!-- Clear button: only shown when filled and not in a readonly/disabled state.
         Reka's AutocompleteCancel does not set data-empty itself, so we drive it here.
         In multiple mode also clears selectedValues via ctx.clearAll(). -->
    <AutocompleteCancel
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
