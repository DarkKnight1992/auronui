<script setup lang="ts">
import { computed } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: ClassValue
  /** Custom classNames to override the default component slots */
  classNames?: Partial<{
    content: ClassValue
  }>
}>(), {
  class: undefined,
})

const slotFns = computed(() => stepperVariants())
</script>

<template>
  <div
    :class="composeClassName(slotFns.content(), props.class, props.classNames?.content)"
    data-slot="stepper-content"
  >
    <slot />
  </div>
</template>
