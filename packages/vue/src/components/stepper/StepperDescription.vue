<script setup lang="ts">
import { computed } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})

const slotFns = computed(() => stepperVariants())
</script>

<template>
  <p
    :class="composeClassName(slotFns.description(), props.class)"
    data-slot="stepper-description"
  >
    <slot />
  </p>
</template>
