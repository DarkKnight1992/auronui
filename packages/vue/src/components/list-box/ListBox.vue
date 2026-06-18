<script setup lang="ts">
import { computed, toRef, useAttrs } from 'vue'
import { ListboxRoot, ListboxContent } from 'reka-ui'
import { listboxVariants, type ListBoxVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useListBoxProvide } from './ListBox.context'

// Disable Vue attribute fallthrough — we manually forward ARIA attrs to ListboxContent
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  defaultValue?: string | string[]
  selectionMode?: 'single' | 'multiple'
  variant?: ListBoxVariants['variant']
  isDisabled?: boolean
  class?: string
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    base: string
  }>
}>(), {
  modelValue: undefined,
  defaultValue: undefined,
  selectionMode: 'single',
  variant: 'default',
  isDisabled: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()

const attrs = useAttrs()

// Provide context for ListBoxItem and ListBoxSection children
useListBoxProvide({
  variant: toRef(props, 'variant'),
  itemVariant: toRef(props, 'variant'),
  isDisabled: toRef(props, 'isDisabled'),
})

const slotFns = computed(() =>
  listboxVariants({ variant: props.variant })
)
</script>

<template>
  <!-- ListboxRoot is an invisible wrapper that manages state; ListboxContent carries role="listbox" -->
  <!-- We forward attrs (aria-label, aria-labelledby, etc.) to ListboxContent, not the root -->
  <ListboxRoot
    :model-value="props.modelValue == null ? undefined : ([] as string[]).concat(props.modelValue)"
    :default-value="props.defaultValue == null ? undefined : ([] as string[]).concat(props.defaultValue)"
    :multiple="props.selectionMode === 'multiple'"
    :selection-behavior="props.selectionMode === 'multiple' ? 'toggle' : 'replace'"
    :disabled="props.isDisabled"
    @update:model-value="emit('update:modelValue', props.selectionMode === 'single' ? (Array.isArray($event) ? ($event as string[])[0] : $event as string) : $event as string[])"
  >
    <ListboxContent
      v-bind="attrs"
      :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    >
      <slot />
    </ListboxContent>
  </ListboxRoot>
</template>
