<script setup lang="ts">
import { computed } from 'vue'
import { surfaceVariants, type SurfaceVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useSurfaceProvide } from './surface.context'

const {
  as = 'div',
  variant = 'default',
  class: className,
} = defineProps<{
  as?: string
  variant?: SurfaceVariants['variant']
  class?: string
}>()

useSurfaceProvide({ variant: computed(() => variant) })

const classes = computed(() =>
  composeClassName(surfaceVariants({ variant }), className)
)
</script>

<template>
  <component
    :is="as"
    :class="classes"
  >
    <slot />
  </component>
</template>
