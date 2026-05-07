<script setup lang="ts">
import { computed, inject } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { stepperContextKey } from './Stepper.context'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})

const ctx = inject(stepperContextKey)
const slotFns = computed(() => stepperVariants({ size: ctx?.size.value }))
</script>

<template>
  <p
    :class="composeClassName(slotFns.title(), props.class)"
    data-slot="stepper-title"
  >
    <slot />
  </p>
</template>
