<script setup lang="ts">
import { computed } from 'vue'
import { AccordionRoot } from 'reka-ui'
import { accordionVariants, type AccordionVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'
import { useAccordionProvide } from './accordion.context'
import AccordionItem from './AccordionItem.vue'
import AccordionHeader from './AccordionHeader.vue'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'

type SingleValue = string
type MultipleValue = string[]
type AccordionShorthandItem = { value: string; title: string; content?: string; disabled?: boolean }

const props = withDefaults(defineProps<{
  type: 'single' | 'multiple'
  modelValue?: SingleValue | MultipleValue
  defaultValue?: SingleValue | MultipleValue
  collapsible?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
  unmountOnHide?: boolean
  as?: string
  asChild?: boolean
  variant?: AccordionVariants['variant']
  size?: AccordionVariants['size']
  class?: ClassValue
  /** Override classes for any slot */
  classNames?: Partial<{
    base: ClassValue
  }>
  /** Shorthand API: render items from an array instead of the compound slot API */
  items?: AccordionShorthandItem[]
}>(), {

  collapsible: true,
  isDisabled: undefined,
  disabled: undefined,
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: SingleValue | MultipleValue]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'Accordion', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slotFns = computed(() => accordionVariants({ variant: props.variant, size: props.size }))

useAccordionProvide({ slotFns })
</script>

<template>
  <AccordionRoot
    :type="props.type"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :collapsible="props.collapsible"
    :disabled="isDisabled"
    :dir="props.dir"
    :orientation="props.orientation"
    :unmount-on-hide="props.unmountOnHide"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="(v: SingleValue | MultipleValue | undefined) => { if (v !== undefined) emit('update:modelValue', v) }"
  >
    <template v-if="props.items">
      <AccordionItem
        v-for="item in props.items"
        :key="item.value"
        :value="item.value"
        :is-disabled="item.disabled"
      >
        <AccordionHeader>
          <AccordionTrigger>{{ item.title }}</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>{{ item.content }}</AccordionContent>
      </AccordionItem>
    </template>
    <slot v-else />
  </AccordionRoot>
</template>
