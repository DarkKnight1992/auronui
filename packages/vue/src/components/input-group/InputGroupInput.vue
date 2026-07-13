<!--
  InputGroupInput — bare native <input>, borderless and transparent so it
  visually merges into its parent InputGroup's box. Not meant to be used
  standalone (use Input for a self-contained field); this is the "use
  AuronUI, not raw HTML" answer specifically for InputGroup's own <input>.

  Adopts the parent InputGroup's generated field id and aria-describedby
  (pointing at its label/description/error) automatically — the same
  wiring Input.vue does internally for its own single owned <input>, just
  split across two components here since InputGroup can hold more than
  one input-like child. An explicit `id` or `aria-describedby` fallthrough
  attr always wins over the inherited one.
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
const passthroughAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'id' && k !== 'aria-describedby'))
)

const ctx = useInputGroupInject({
  size: computed(() => 'md'),
  isInvalid: computed(() => false),
  isDisabled: computed(() => false),
  fieldId: computed(() => undefined),
  ariaDescribedBy: computed(() => undefined),
})

const isDisabled = computed(() => props.isDisabled ?? ctx.isDisabled.value)
const inputId = computed(() => (attrs.id as string | undefined) ?? ctx.fieldId.value)
const ariaDescribedBy = computed(() => (attrs['aria-describedby'] as string | undefined) ?? ctx.ariaDescribedBy.value)
const slotFns = computed(() => inputGroupVariants({ size: ctx.size.value }))
</script>

<template>
  <input
    v-bind="passthroughAttrs"
    :id="inputId"
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :disabled="isDisabled || undefined"
    :aria-invalid="ctx.isInvalid.value || undefined"
    :aria-describedby="ariaDescribedBy"
    :class="composeClassName(slotFns.input(), props.class)"
    data-slot="input-group-input"
  >
</template>
