<script setup lang="ts">
import { computed, toRef } from 'vue'
import { ToolbarRoot } from 'reka-ui'
import { toolbarVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToolbarProvide } from './toolbar.context'

const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  isAttached?: boolean
  class?: string
  /** Text direction */
  dir?: 'ltr' | 'rtl'
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  orientation: 'horizontal',
  loop: true,
  isAttached: false,
})

useToolbarProvide({ orientation: toRef(props, 'orientation') })

const baseClass = computed(() =>
  toolbarVariants({ orientation: props.orientation, isAttached: props.isAttached })
)
</script>

<template>
  <ToolbarRoot
    :orientation="props.orientation"
    :loop="props.loop"
    :dir="props.dir"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(baseClass, props.class)"
    :data-orientation="props.orientation"
  >
    <slot />
  </ToolbarRoot>
</template>
