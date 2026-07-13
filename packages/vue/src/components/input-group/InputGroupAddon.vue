<!--
  InputGroupAddon — a segment inside an InputGroup (icon, button, or plain
  text) that shares the parent box's border instead of having its own.
  Position (leading vs. trailing) is just DOM order — put it before or
  after InputGroupInput.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { inputGroupVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useInputGroupInject } from './input-group.context'

const props = withDefaults(
  defineProps<{
    /** Extra classes merged onto the addon. */
    class?: ClassValue
  }>(),
  {
    class: undefined,
  },
)

const ctx = useInputGroupInject({
  size: computed(() => 'md'),
  isInvalid: computed(() => false),
  isDisabled: computed(() => false),
  fieldId: computed(() => undefined),
  ariaDescribedBy: computed(() => undefined),
})

const slotFns = computed(() => inputGroupVariants({ size: ctx.size.value }))
</script>

<template>
  <span
    :class="composeClassName(slotFns.addon(), props.class)"
    data-slot="input-group-addon"
    :data-disabled="ctx.isDisabled.value || undefined"
  >
    <slot />
  </span>
</template>
