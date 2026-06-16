<script setup lang="ts">
import { computed } from 'vue'
import { AutocompleteItem as RekaAutocompleteItem, injectComboboxRootContext } from 'reka-ui'
import { useAutocompleteInject } from './Autocomplete.context'

const props = withDefaults(defineProps<{
  /**
   * Label for the create item. Accepts a static string or a function receiving
   * the current search term. Defaults to `Create "${term}"`.
   */
  label?: string | ((term: string) => string)
  class?: string
}>(), {
  label: undefined,
  class: undefined,
})

const ctx = useAutocompleteInject()
// Reka's combobox context (provided by AutocompleteRoot) — used to drive the
// open state and input focus directly, since this item's value equals the
// current search term and Reka's native select path is unreliable for it.
const comboboxCtx = injectComboboxRootContext()

const term = computed(() => ctx.searchTerm.value.trim())

const isVisible = computed(() => !!term.value && !ctx.hasExactMatch.value)

const displayLabel = computed(() => {
  if (typeof props.label === 'function') return props.label(term.value)
  return props.label ?? `Create "${term.value}"`
})

function handleSelect(event: Event) {
  // Always manage the creation ourselves — this item's value equals the current
  // search term, so Reka's native select (set-value + close) is unreliable here.
  event.preventDefault()
  ctx.onCreateValue(term.value)
  if (ctx.multiple.value) {
    // Keep the dropdown open for the next entry and restore input focus.
    comboboxCtx.inputElement.value?.focus()
  } else {
    // Single mode: close the dropdown, like selecting a regular item.
    comboboxCtx.onOpenChange(false)
  }
}
</script>

<template>
  <RekaAutocompleteItem
    v-if="isVisible"
    :key="term"
    :value="term"
    :text-value="term"
    :class="['list-box-item list-box-item--default', props.class]"
    data-slot="list-box-item"
    data-create-item
    @select="handleSelect"
  >
    <slot :term="term">
      <span
        class="autocomplete-item__text"
        data-slot="item-text"
      >
        {{ displayLabel }}
      </span>
    </slot>
  </RekaAutocompleteItem>
</template>
