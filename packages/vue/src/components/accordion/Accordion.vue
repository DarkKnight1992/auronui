<script setup lang="ts">
import { computed } from 'vue'
import { AccordionRoot } from 'reka-ui'
import { accordionVariants, type AccordionVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionProvide } from './accordion.context'

type SingleValue = string
type MultipleValue = string[]

const props = withDefaults(defineProps<{
  type: 'single' | 'multiple'
  modelValue?: SingleValue | MultipleValue
  defaultValue?: SingleValue | MultipleValue
  collapsible?: boolean
  disabled?: boolean
  variant?: AccordionVariants['variant']
  size?: AccordionVariants['size']
  class?: string
  /** Override classes for any slot */
  classNames?: Partial<{
    base: string
  }>
}>(), {
  collapsible: true,
  disabled: false,
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: SingleValue | MultipleValue]
}>()

const slotFns = computed(() => accordionVariants({ variant: props.variant, size: props.size }))

useAccordionProvide({ slotFns })
</script>

<template>
  <AccordionRoot
    :type="props.type"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :collapsible="props.collapsible"
    :disabled="props.disabled"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="(v: SingleValue | MultipleValue | undefined) => { if (v !== undefined) emit('update:modelValue', v) }"
  >
    <slot />
  </AccordionRoot>
</template>
