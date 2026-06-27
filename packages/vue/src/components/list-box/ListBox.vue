<script setup lang="ts">
import { computed, toRef, useAttrs } from 'vue'
import { ListboxRoot, ListboxContent } from 'reka-ui'
import { listboxVariants, type ListBoxVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useListBoxProvide } from './ListBox.context'
import ListBoxItem from './ListBoxItem.vue'

type ListBoxShorthandItem = { value: string; label?: string; disabled?: boolean; textValue?: string }

// Disable Vue attribute fallthrough — we manually forward ARIA attrs to ListboxContent
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  defaultValue?: string | string[]
  selectionMode?: 'single' | 'multiple'
  variant?: ListBoxVariants['variant']
  isDisabled?: boolean
  class?: ClassValue
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    base: ClassValue
  }>
  /** Shorthand API: render list items from an array instead of the compound slot API */
  items?: ListBoxShorthandItem[]
  /** Allow selecting multiple values (alias for selectionMode="multiple"). */
  multiple?: boolean
  /** Orientation of the listbox for keyboard navigation. */
  orientation?: 'horizontal' | 'vertical'
  /** Reading direction for the component. */
  dir?: 'ltr' | 'rtl'
  /** Selection behavior when multiple is true. */
  selectionBehavior?: 'toggle' | 'replace'
  /** Highlight item on hover. */
  highlightOnHover?: boolean
  /** Key used to compare items for equality. */
  by?: string
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Form field name for native form submission. */
  name?: string
  /** Mark the field as required. */
  required?: boolean
  /** Render the ListboxContent as a different element. */
  contentAs?: string
  /** Merge content props onto child element. */
  contentAsChild?: boolean
  /** Hide the selected checkmark on all items (forwarded via context). */
  hideSelectedIcon?: boolean
}>(), {
  modelValue: undefined,
  defaultValue: undefined,
  selectionMode: 'single',
  variant: 'default',
  isDisabled: false,
  class: undefined,
  multiple: undefined,
  orientation: undefined,
  dir: undefined,
  selectionBehavior: undefined,
  highlightOnHover: undefined,
  by: undefined,
  as: undefined,
  asChild: false,
  name: undefined,
  required: undefined,
  contentAs: undefined,
  contentAsChild: false,
  hideSelectedIcon: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'highlight': [context: unknown]
  'entry-focus': [event: Event]
  'leave': [event: Event]
}>()

const attrs = useAttrs()

// Provide context for ListBoxItem and ListBoxSection children
useListBoxProvide({
  variant: toRef(props, 'variant'),
  itemVariant: toRef(props, 'variant'),
  isDisabled: toRef(props, 'isDisabled'),
  hideSelectedIcon: toRef(props, 'hideSelectedIcon'),
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
    :multiple="props.multiple ?? props.selectionMode === 'multiple'"
    :selection-behavior="props.selectionBehavior ?? (props.selectionMode === 'multiple' ? 'toggle' : 'replace')"
    :disabled="props.isDisabled"
    :orientation="props.orientation"
    :dir="props.dir"
    :highlight-on-hover="props.highlightOnHover"
    :by="props.by"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="props.required"
    @update:model-value="emit('update:modelValue', props.selectionMode === 'single' ? (Array.isArray($event) ? ($event as string[])[0] : $event as string) : $event as string[])"
    @highlight="emit('highlight', $event)"
    @entry-focus="emit('entry-focus', $event)"
    @leave="emit('leave', $event)"
  >
    <ListboxContent
      v-bind="attrs"
      :as="props.contentAs"
      :as-child="props.contentAsChild"
      :class="composeClassName(slotFns, props.class, props.classNames?.base)"
    >
      <template v-if="props.items">
        <ListBoxItem
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :is-disabled="item.disabled"
          :text-value="item.textValue"
        >{{ item.label ?? item.value }}</ListBoxItem>
      </template>
      <slot v-else />
    </ListboxContent>
  </ListboxRoot>
</template>
