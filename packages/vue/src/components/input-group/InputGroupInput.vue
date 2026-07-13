<!--
  InputGroupInput — bare native <input>, borderless and transparent so it
  visually merges into its parent InputGroup's box. Not meant to be used
  standalone (use Input for a self-contained field); this is the "use
  AuronUI, not raw HTML" answer specifically for InputGroup's own <input>.
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { inputGroupVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useInputGroupInject } from './input-group.context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Native input type. @default 'text' */
    type?: string
    placeholder?: string
    name?: string
    /** Overrides the parent InputGroup's isDisabled for this input specifically. */
    isDisabled?: boolean
    /** Extra classes merged onto the input. */
    class?: ClassValue
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    name: undefined,
    isDisabled: undefined,
    class: undefined,
  },
)

const modelValue = defineModel<string | number | null>({ default: '' })

const attrs = useAttrs()
const ctx = useInputGroupInject({
  size: computed(() => 'md'),
  isInvalid: computed(() => false),
  isDisabled: computed(() => false),
})

const isDisabled = computed(() => props.isDisabled ?? ctx.isDisabled.value)
const slotFns = computed(() => inputGroupVariants({ size: ctx.size.value }))
</script>

<template>
  <input
    v-bind="attrs"
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :disabled="isDisabled || undefined"
    :aria-invalid="ctx.isInvalid.value || undefined"
    :class="composeClassName(slotFns.input(), props.class)"
    data-slot="input-group-input"
  >
</template>
